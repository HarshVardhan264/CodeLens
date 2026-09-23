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

You receive findings from three specialized code review agents:

1. Bug Agent
2. Security Agent
3. Quality Agent

Your job is to combine their findings into ONE repository-level code review report.

Responsibilities:

1. Combine findings from all three agents.
2. Remove duplicate issues.
3. Preserve the correct file path.
4. Preserve the correct line number.
5. Assign the appropriate severity to every issue.
6. Assign a confidence score to every issue.
7. Assign a priority score to every issue.
8. Calculate an overall code health score from 0 to 100.
9. Give a short repository summary.
10. Give 3 to 5 practical recommendations based only on the identified issues.

IMPORTANT:

The report must contain ALL valid issues found by the specialized agents.

Do NOT remove High, Medium, or Low severity issues just because they are not Critical.

The complete list of issues will be shown to the developer in the CodeLens report.

A separate system will later select the most important Critical issues for possible GitHub Issue creation.

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
            "suggestedFix": "Suggested fix.",
            "confidence": 90,
            "priorityScore": 85
        }}
    ],

    "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
    ]
}}

RULES:

- score must be an integer from 0 to 100.
- severity must be exactly one of:
  - Critical
  - High
  - Medium
  - Low
- category must be exactly one of:
  - Bug
  - Security
  - Quality
- line must be an integer.
- confidence must be an integer from 0 to 100.
- priorityScore must be an integer from 0 to 100.
- Do not invent issues.
- Only use issues supported by the findings provided by the specialized agents.
- Do not invent files, line numbers, vulnerabilities, or evidence.
- Preserve the original file path whenever available.
- Preserve the original line number whenever available.
- If a line number is genuinely unavailable, use 0.
- Remove duplicate issues that refer to the same underlying problem.
- Keep distinct issues even if they occur in the same file.
- Include ALL valid issues from the specialized agents.
- Do not hide Medium or Low severity issues.
- issueCounts must exactly match the issues array.
- Critical issues should generally have a higher priorityScore than High, Medium, or Low issues.
- priorityScore should consider:
    1. Severity
    2. Confidence
    3. Potential impact
    4. Exploitability
    5. How actionable the issue is
- confidence represents how confident you are that the issue is actually present in the code.
- priorityScore represents how important and actionable the issue is for the developer.
- A high confidence issue does not automatically mean it has high priority.
- A Critical issue with low confidence should not automatically receive a maximum priorityScore.
- Recommendations must be based only on the identified issues.
- Do not create recommendations for problems that were not identified.
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

        result = json.loads(content)

        return result

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