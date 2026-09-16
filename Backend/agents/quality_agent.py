from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
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

    response = llm.invoke(prompt)

    return response.content