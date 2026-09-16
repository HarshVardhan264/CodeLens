from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
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

    response = llm.invoke(prompt)

    return response.content