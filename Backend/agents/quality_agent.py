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


def quality_agent(chunks):

    prompt = f"""
You are a Code Quality Review Agent.

Analyze the following code chunks and find ONLY code quality problems.

Look for:

- Poor naming
- Duplicate code
- High complexity
- Poor organization
- Bad readability
- Missing useful documentation
- Unnecessary code
- Poor coding practices
- Functions that are unnecessarily large

DO NOT report:
- Bugs
- Security vulnerabilities

For every issue include:

File:
Line:
Severity:
Title:
Description:
Suggested Fix:

If there are no quality issues, say:
No quality issues found.

CODE CHUNKS:

{chunks}
"""

    start = time.perf_counter()

    print("[QUALITY AGENT] Calling Gemini...", flush=True)

    try:
        response = llm.invoke(prompt)
        content = response.content

        if not isinstance(content, str) or not content.strip():
            raise RuntimeError(
                "Gemini returned an empty quality analysis"
            )

        print(
            f"[QUALITY AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return content.strip()

    except Exception as error:
        print(f"[QUALITY AGENT] Failed: {error}", flush=True)
        raise
