
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0,
    max_output_tokens=4096,
    max_retries=2,
    timeout=60
)


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

    try:
        response = llm.invoke(prompt)
        content = response.content

        if not isinstance(content, str) or not content.strip():
            raise RuntimeError(
                "Gemini returned an empty security analysis"
            )

        print(
            f"[SECURITY AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return content.strip()

    except Exception as error:
        print(f"[SECURITY AGENT] Failed: {error}", flush=True)
        raise
