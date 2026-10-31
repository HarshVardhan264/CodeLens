def select_github_candidates(final_report):

    if not isinstance(final_report, dict):
        return []

    issues = final_report.get("issues", [])

    if not isinstance(issues, list):
        return []

    critical_issues = [
        issue
        for issue in issues
        if isinstance(issue, dict)
        and str(issue.get("severity", "")).lower() == "critical"
    ]

    critical_issues.sort(
        key=lambda issue: issue.get("priorityScore", 0) or 0,
        reverse=True
    )

    return critical_issues[:4]