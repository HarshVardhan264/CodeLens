
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
    """Safely extract text from LangChain AIMessage content."""

    content = response.content

    if isinstance(content, str):
        return content.strip()

    if isinstance(content, list):
        text_parts = []

        for block in content:
            if isinstance(block, str):
                text_parts.append(block)
            elif isinstance(block, dict):
                text = block.get("text")
                if isinstance(text, str):
                    text_parts.append(text)

        return "\n".join(text_parts).strip()

    return ""


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
        response = invoke_with_retry(
            lambda: llm.invoke(prompt),
            "QUALITY AGENT",
        )

        content = extract_text(response)

        if not content:
            print(
                "[QUALITY AGENT] Empty response metadata:",
                response.response_metadata,
                flush=True
            )

            print(
                "[QUALITY AGENT] Additional kwargs:",
                response.additional_kwargs,
                flush=True
            )

            raise RuntimeError(
                "Gemini returned an empty quality analysis"
            )

        print(
            f"[QUALITY AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return content

    except Exception as error:
        print(
            f"[QUALITY AGENT] Failed: {error}",
            flush=True
        )
        raise
