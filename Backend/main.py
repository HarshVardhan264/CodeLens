from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from graph.review_graph import review_graph


app = FastAPI()


class CodeChunk(BaseModel):
    filePath: str
    startLine: int
    endLine: int
    code: str


class ReviewRequest(BaseModel):
    chunks: List[CodeChunk]


@app.get("/")
def home():

    return {
        "message": "AI Code Reviewer backend is running"
    }


@app.post("/review")
def review_code(request: ReviewRequest):

    chunks = [
        chunk.model_dump()
        for chunk in request.chunks
    ]

    result = review_graph.invoke({
    "chunks": chunks,
    "bug_results": "",
    "security_results": "",
    "quality_results": "",
    "final_report": {},
    "github_candidates": []
    })

    return {
        "report": result["final_report"]
    }