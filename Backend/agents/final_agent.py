
import time
import json

from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0,
    max_output_tokens=8192,
    max_retries=2,
    timeout=60
)


def final_agent(bug_results, security_results, quality_results):

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
3. Preserve the correct file path and line number.
4. Assign severity, confidence and priority scores.
5. Calculate an overall code health score from 0 to 100.
6. Give a short repository summary.
7. Give 3 to 5 practical recommendations based only on identified issues.

IMPORTANT:
Include ALL valid issues from specialized agents.
Do not remove High, Medium, or Low severity issues.

Return ONLY valid JSON using EXACTLY this structure:

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

- score: integer from 0 to 100.
- severity: Critical, High, Medium, or Low.
- category: Bug, Security, or Quality.
- line: integer; use 0 only when unavailable.
- confidence: integer from 0 to 100.
- priorityScore: integer from 0 to 100.
- Do not invent issues, files, line numbers, or evidence.
- Preserve original file paths and line numbers whenever available.
- Remove duplicate underlying issues but retain distinct issues.
- Include all valid findings, including Medium and Low severity.
- issueCounts must exactly match the issues array.
- Critical issues should generally have higher priority scores.
- Priority should consider severity, confidence, impact, exploitability, and actionability.
- Recommendations must be based only on identified issues.
- Do not use Markdown or code fences.

BUG FINDINGS:
{bug_results}

SECURITY FINDINGS:
{security_results}

QUALITY FINDINGS:
{quality_results}
"""

    start = time.perf_counter()

    print("[FINAL AGENT] Calling Gemini...", flush=True)

    try:
        response = llm.invoke(prompt)

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

        if not isinstance(content, str) or not content.strip():
            raise RuntimeError(
                "Gemini returned an empty final report"
            )

        content = content.strip()

        # Remove Markdown code fences if present
        if content.startswith("```"):
            content = content.replace("```json", "", 1)
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

        result = json.loads(content)

        if not isinstance(result, dict):
            raise ValueError("Final report must be a JSON object")

        required_keys = {
            "score",
            "summary",
            "issueCounts",
            "issues",
            "recommendations"
        }

        if not required_keys.issubset(result):
            raise ValueError("Final report is missing required fields")

        print(
            f"[FINAL AGENT] Completed in "
            f"{time.perf_counter() - start:.2f}s",
            flush=True
        )

        return result

    except Exception as error:
        print(f"[FINAL AGENT] Failed: {error}", flush=True)
        raise
