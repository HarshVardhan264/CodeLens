from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import json

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0
)


def final_agent(
    bug_results,
    security_results,
    quality_results
):

    prompt = f"""
You are the Final Code Review Agent.

You receive findings from three specialized agents.

Your job is to combine them into ONE repository-level report.

Responsibilities:

1. Remove duplicate issues.
2. Preserve the correct file path.
3. Preserve the correct line number.
4. Prioritize serious issues.
5. Calculate a code health score from 0 to 100.
6. Give a short repository summary.
7. Give 3 to 5 practical, prioritized recommendations based only on the identified issues.

Return ONLY valid JSON.

Use EXACTLY this structure:

{{
    "score": 75,
    "summary": "Short repository summary",

    "issueCounts": {{
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0
    }},

    "issues": [
        {{
            "file": "src/example.py",
            "line": 10,
            "category": "Bug",
            "severity": "High",
            "title": "Example issue",
            "description": "Description of the issue.",
            "suggestedFix": "Suggested fix."
        }}
    ],

    "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
    ]
}}

Rules:

- score must be an integer from 0 to 100.
- severity must be Critical, High, Medium, or Low.
- category must be Bug, Security, or Quality.
- line must be an integer.
- Do not invent issues.
- Only use findings provided by the specialized agents.
- If no issues exist, use an empty issues array.
- issueCounts must exactly match the issues array.
- Do not use markdown.
- Do not wrap the JSON in ```.

BUG FINDINGS:

{bug_results}


SECURITY FINDINGS:

{security_results}


QUALITY FINDINGS:

{quality_results}
"""

    response = llm.invoke(prompt)

    # Gemini/LangChain may return content as either a string
    # or a list of content blocks.
    content = response.content

    if isinstance(content, list):
        text_parts = []

        for item in content:
            if isinstance(item, dict):
                text = item.get("text", "")
                if text:
                    text_parts.append(text)
            elif isinstance(item, str):
                text_parts.append(item)

        content = "".join(text_parts)

    content = str(content).strip()

    # Remove markdown code fences if Gemini adds them
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    try:
        return json.loads(content)

    except json.JSONDecodeError:

        return {
            "score": 0,
            "summary": "The final AI response could not be parsed.",
            "issueCounts": {
                "critical": 0,
                "high": 0,
                "medium": 0,
                "low": 0
            },
            "issues": [],
            "recommendations": [],
            "error": "Invalid JSON returned by final agent"
        }