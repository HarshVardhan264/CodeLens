const axios = require("axios");

// GitHub API configuration
const GITHUB_API = "https://api.github.com";

// Get owner and repository name from URL
function getRepoInfo(repoUrl) {
    const url = new URL(repoUrl);

    const parts = url.pathname
        .split("/")
        .filter(Boolean);

    if (parts.length < 2) {
        throw new Error("Invalid GitHub repository URL");
    }

    return {
        owner: parts[0],
        repo: parts[1].replace(".git", ""),
    };
}

// Get authentication headers for GitHub API
function getGitHubHeaders() {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        throw new Error("GITHUB_TOKEN is not configured");
    }

    return {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2026-03-10",
    };
}

// Get all files from a repository
async function getRepositoryFiles(repoUrl) {
    const { owner, repo } = getRepoInfo(repoUrl);

    const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`
    );

    return response.data.tree;
}

// Get the content of a repository file
async function getFileContent(repoUrl, filePath) {
    const { owner, repo } = getRepoInfo(repoUrl);

    const response = await axios.get(
        `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`
    );

    const content = response.data.content;

    // Decode Base64 content returned by GitHub
    const decodedContent = Buffer
        .from(content, "base64")
        .toString("utf-8");

    return decodedContent;
}

// Create a GitHub issue
async function createGitHubIssue(repoUrl, issue) {
    const { owner, repo } = getRepoInfo(repoUrl);

    const response = await axios.post(
        `${GITHUB_API}/repos/${owner}/${repo}/issues`,
        {
            title: issue.title,
            body: issue.body,
        },
        {
            headers: getGitHubHeaders(),
        }
    );

    return {
        number: response.data.number,
        title: response.data.title,
        url: response.data.html_url,
    };
}

// Create multiple GitHub issues
async function createGitHubIssues(repoUrl, issues) {
    const createdIssues = [];

    for (const issue of issues) {
        try {
            const created = await createGitHubIssue(
                repoUrl,
                issue
            );

            createdIssues.push(created);
        } catch (error) {
            console.error(
                `Failed to create GitHub issue: ${issue.title}`,
                error.response?.data || error.message
            );

            throw error;
        }
    }

    return createdIssues;
}

// Export GitHub service functions
module.exports = {
    getRepositoryFiles,
    getFileContent,
    createGitHubIssue,
    createGitHubIssues,
};