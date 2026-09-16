from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
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

Return your findings in a clear format.

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

    response = llm.invoke(prompt)

    return response.content