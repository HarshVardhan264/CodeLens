import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0,
    max_retries=2,
    timeout=60,
    max_output_tokens=4096
)


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

    try:
        response = llm.invoke([HumanMessage(content=prompt)])

        print(
            "[BUG AGENT] Response metadata:",
            response.response_metadata,
            flush=True
        )

        content = response.content

        if isinstance(content, str):
            content = content.strip()

        elif isinstance(content, list):
            content = "\n".join(
                item.get("text", "")
                for item in content
                if isinstance(item, dict) and item.get("text")
            ).strip()

        if not content:
            raise RuntimeError(
                "Gemini returned empty content. Check response metadata."
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