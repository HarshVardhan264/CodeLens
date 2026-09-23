from typing import TypedDict, List, Dict, Any


class ReviewState(TypedDict):

    chunks: List[dict]

    bug_results: str
    security_results: str
    quality_results: str

    # Complete repository report containing ALL issues
    final_report: Dict[str, Any]

    # Critical issues selected for possible GitHub Issue creation
    github_candidates: List[Dict[str, Any]]