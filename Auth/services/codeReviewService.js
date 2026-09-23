const {
    getRepositoryFiles,
    getFileContent,
} = require("./githubService");

const {
    filterCodeFiles,
} = require("./fileFilter");

const {
    selectFiles,
} = require("./fileSelector");

const {
    chunkCode,
} = require("./codeChunker");

const {
    sendCodeForReview,
} = require("./reviewService");


const MAX_FILES = 10;
const MAX_LINES_PER_CHUNK = 300;


async function reviewRepository(repoUrl) {

    console.log("\n=================================");
    console.log("Starting CodeLens repository review");
    console.log("Repository:", repoUrl);
    console.log("=================================\n");


    // 1. Get repository files

    const allFiles =
        await getRepositoryFiles(repoUrl);

    console.log(
        `Found ${allFiles.length} repository items`
    );


    // 2. Filter source-code files

    const codeFiles =
        filterCodeFiles(allFiles);

    console.log(
        `Found ${codeFiles.length} source files`
    );


    if (codeFiles.length === 0) {

        throw new Error(
            "No supported source-code files found in repository"
        );
    }


    // 3. Select important files

    const selectedFiles =
        selectFiles(
            codeFiles,
            MAX_FILES
        );

    console.log(
        `Selected ${selectedFiles.length} files for review`
    );


    // 4. Download and chunk files

    const allChunks = [];


    for (const file of selectedFiles) {

        try {

            console.log(
                `Reading: ${file.path}`
            );


            const content =
                await getFileContent(
                    repoUrl,
                    file.path
                );


            const chunks =
                chunkCode(
                    content,
                    file.path,
                    MAX_LINES_PER_CHUNK
                );


            allChunks.push(
                ...chunks
            );


        } catch (error) {

            console.error(
                `Failed to read ${file.path}:`,
                error.message
            );
        }
    }


    console.log(
        `Created ${allChunks.length} code chunks`
    );


    if (allChunks.length === 0) {

        throw new Error(
            "No code chunks could be created"
        );
    }


    // 5. Send chunks to Python LangGraph service

    console.log(
        "Sending code to AI review service..."
    );


    const aiResult =
        await sendCodeForReview(
            allChunks
        );


    console.log(
        "AI review completed"
    );


    // 6. Return complete review result

    return {

        filesReviewed:
            selectedFiles.length,

        chunksReviewed:
            allChunks.length,

        report:
            aiResult.report || aiResult,

        // Critical issues selected by Python prioritizer
        githubCandidates:
            aiResult.github_candidates || [],
    };
}


module.exports =
    reviewRepository;