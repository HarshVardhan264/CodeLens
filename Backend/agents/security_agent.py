
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

from agents.llm_retry import invoke_with_retry

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.1-flash-lite",
    temperature=0,
    max_output_tokens=4096,
    max_retries=2,
    timeout=60
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


def security_agent(chunks):

    prompt = f"""
You are a Security Code Review Agent.

Analyze the following code chunks and find ONLY security vulnerabilities.

Look for:

- Hardcoded secrets
- API keys
- SQL injection
- Command injection
- Unsafe file operations
- Authentication problems
- Authorization problems
- Unsafe user input
- Sensitive information exposure
- Insecure dependencies or configurations

DO NOT report:
- Normal bugs
- Code style issues
- Readability issues

For every issue include:

File:
Line:
Severity:
Title:
Description:
Suggested Fix:

If there are no security issues, say:
No security issues found.

CODE CHUNKS:

{chunks}
"""

    start = time.perf_counter()

    print("[SECURITY AGENT] Calling Gemini...", flush=True)

    def call_security_agent():

        response = llm.invoke(prompt)

        content = extract_text(response)

        if not content:
            print(
                "[SECURITY AGENT] Response metadata:",
                response.response_metadata,
                flush=True
            )

            print(
                "[SECURITY AGENT] Raw content:",
                repr(response.content),
                flush=True
            )

            raise RuntimeError("EMPTY_GEMINI_RESPONSE")

        return content

    try:
        content = invoke_with_retry(
            call_security_agent,
            "SECURITY AGENT",
            max_attempts=3
        )

        print(
            f"[SECURITY AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return content

    except Exception as error:
        print(
            f"[SECURITY AGENT] Failed after "
            f"{time.perf_counter() - start:.2f}s: {error}",
            flush=True
        )
        raise
