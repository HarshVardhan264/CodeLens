const axios = require("axios");

async function sendCodeForReview(chunks) {
    const startTime = Date.now();

    console.log("Sending request to FastAPI...");
    console.log("Chunks being sent:", chunks.length);

    try {
        const response = await axios.post(
            `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8000"}/review`,
            { chunks },
            { timeout: 120000 } // 2 minutes
        );

        console.log("FastAPI response received!");
        console.log(
            "Response time:",
            ((Date.now() - startTime) / 1000).toFixed(2),
            "seconds"
        );

        return response.data;

    } catch (error) {
        console.error("FastAPI request failed:", error.message);

        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Response:", error.response.data);
        }

        throw error;
    }
}

module.exports = { sendCodeForReview };