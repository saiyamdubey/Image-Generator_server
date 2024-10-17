const express = require("express");
const path = require("path");
const dotenv = require("dotenv").config();
// const fetch = require("node-fetch"); // Make sure to install node-fetch using `npm install node-fetch`
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static HTML files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to generate media (handle the Pixabay API calls)
app.get("/generate-media", async (req, res) => {
   const prompt  = "dog";

    if (!prompt || prompt.trim() === "") {
        return res.status(400).json({ message: "Prompt is required" });
    }

    try {
        // Fetch images from Pixabay API
        const imageResponse = await fetch(`https://pixabay.com/api/?key=45684768-73aac1d5f59f83ab66304ad54&q=${encodeURIComponent(prompt)}&image_type=photo`);
        const imageData = await imageResponse.json();

        // Log image data to inspect
        console.log("Image Data:", imageData);

        // Fetch videos from Pixabay API
        const videoResponse = await fetch(`https://pixabay.com/api/videos/?key=45684768-73aac1d5f59f83ab66304ad54&q=${encodeURIComponent(prompt)}`);
        const videoData = await videoResponse.json();

        // Log video data to inspect
        console.log("Video Data:", videoData);

        // Extract image and video URLs
        const imageUrls = imageData.hits ? imageData.hits.map(hit => hit.webformatURL) : [];
        const videoUrls = videoData.hits ? videoData.hits.map(hit => hit.videos.medium.url) : [];

        // If no results found
        if (imageUrls.length === 0 && videoUrls.length === 0) {
            return res.status(404).json({ message: "No results found for the prompt" });
        }

        // Send the URLs back to the client
        res.json({ imageUrls, videoUrls });
    } catch (error) {
        console.error("Error fetching media:", error);
        res.status(500).json({ message: "Error fetching media." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
