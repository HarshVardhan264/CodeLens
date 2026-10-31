from langgraph.graph import StateGraph, START, END

from graph.state import ReviewState

from agents.bug_agent import bug_agent
from agents.security_agent import security_agent
from agents.quality_agent import quality_agent
from agents.final_agent import final_agent

from graph.prioritizer import select_github_candidates


def run_bug_agent(state: ReviewState):

    result = bug_agent(state["chunks"])

    return {
        "bug_results": result
    }


def run_security_agent(state: ReviewState):

    result = security_agent(state["chunks"])

    return {
        "security_results": result
    }


def run_quality_agent(state: ReviewState):

    result = quality_agent(state["chunks"])

    return {
        "quality_results": result
    }


def run_final_agent(state: ReviewState):

    result = final_agent(
        state["bug_results"],
        state["security_results"],
        state["quality_results"]
    )

    return {
        "final_report": result
    }


def run_prioritizer(state: ReviewState):

    candidates = select_github_candidates(
        state["final_report"]
    )

    return {
        "github_candidates": candidates
    }


graph = StateGraph(ReviewState)


graph.add_node("bug_agent", run_bug_agent)
graph.add_node("security_agent", run_security_agent)
graph.add_node("quality_agent", run_quality_agent)
graph.add_node("final_agent", run_final_agent)
graph.add_node("prioritize_findings", run_prioritizer)


graph.add_edge(START, "bug_agent")
graph.add_edge(START, "security_agent")
graph.add_edge(START, "quality_agent")


graph.add_edge(
    ["bug_agent", "security_agent", "quality_agent"],
    "final_agent"
)

graph.add_edge("final_agent", "prioritize_findings")

graph.add_edge("prioritize_findings", END)


review_graph = graph.compile()