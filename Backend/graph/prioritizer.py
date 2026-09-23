def select_github_candidates(final_report):

    issues = final_report.get("issues", [])

    # Only Critical issues are eligible
    critical_issues = [
        issue
        for issue in issues
        if issue.get("severity", "").lower() == "critical"
    ]

    # Highest priority first
    critical_issues.sort(
        key=lambda issue: issue.get("priorityScore", 0),
        reverse=True
    )

    # Maximum 4 issues
    return critical_issues[:4]