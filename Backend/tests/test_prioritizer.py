
from graph.prioritizer import select_github_candidates


def test_selects_only_critical_issues():
    report = {
        "issues": [
            {"severity": "critical", "priorityScore": 90},
            {"severity": "high", "priorityScore": 80},
            {"severity": "low", "priorityScore": 40},
        ]
    }

    result = select_github_candidates(report)

    assert len(result) == 1
    assert result[0]["priorityScore"] == 90


def test_sorts_critical_issues_by_priority():
    report = {
        "issues": [
            {"severity": "critical", "priorityScore": 50},
            {"severity": "critical", "priorityScore": 100},
            {"severity": "critical", "priorityScore": 75},
        ]
    }

    result = select_github_candidates(report)

    assert [issue["priorityScore"] for issue in result] == [100, 75, 50]


def test_returns_maximum_four_issues():
    report = {
        "issues": [
            {"severity": "critical", "priorityScore": score}
            for score in [20, 90, 40, 100, 70, 80]
        ]
    }

    result = select_github_candidates(report)

    assert len(result) == 4
    assert [issue["priorityScore"] for issue in result] == [100, 90, 80, 70]


def test_returns_empty_list_for_invalid_report():
    assert select_github_candidates(None) == []
    assert select_github_candidates("invalid") == []


def test_returns_empty_list_when_issues_is_not_a_list():
    report = {"issues": "invalid"}

    result = select_github_candidates(report)

    assert result == []
