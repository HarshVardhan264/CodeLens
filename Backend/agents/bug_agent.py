
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

from agents.llm_retry import invoke_with_retry

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0,
    max_retries=2,
    timeout=60,
    max_output_tokens=4096
)


def extract_text(response):
    content = response.content

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_parts = []

        for item in content:
            if isinstance(item, str):
                text_parts.append(item)

            elif isinstance(item, dict):
                text = item.get("text")
                if isinstance(text, str):
                    text_parts.append(text)

        return "\n".join(text_parts).strip()

    return ""


def bug_agent(chunks):

    prompt = f"""
You are a Bug Detection Agent.

Analyze the following code chunks and find ONLY:

- Logical bugs
- Runtime errors
- Incorrect conditions
- Incorrect calculations
- Null/undefined problems
- Edge case failures

DO NOT report:
- Security vulnerabilities
- Code quality/style issues

For every issue include:

File:
Line:
Severity:
Title:
Description:
Suggested Fix:

If there are no bugs, say:
No bugs found.

CODE CHUNKS:
{chunks}
"""

    start = time.perf_counter()

    print("[BUG AGENT] Sending request to Gemini...", flush=True)

    def call_bug_agent():

        response = llm.invoke(
            [HumanMessage(content=prompt)]
        )

        content = extract_text(response)

        if not content:
            print(
                "[BUG AGENT] Empty response metadata:",
                response.response_metadata,
                flush=True
            )

            print(
                "[BUG AGENT] Raw response:",
                repr(response.content),
                flush=True
            )

            raise RuntimeError("EMPTY_GEMINI_RESPONSE")

        return content

    try:
        content = invoke_with_retry(
            call_bug_agent,
            "BUG AGENT",
            max_attempts=3
        )

        print(
            f"[BUG AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return content

    except Exception as error:
        print(
            f"[BUG AGENT] Failed after "
            f"{time.perf_counter() - start:.2f}s: {error}",
            flush=True
        )
        raise
