import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function checkModels() {
    try {
        console.log("Fetching models from:", URL.replace(API_KEY, "HIDDEN_KEY"));
        const response = await fetch(URL);
        const data = await response.json();
        console.log("Response Status:", response.status);
        const fs = await import('fs');
        if (data.models) {
            const modelNames = data.models.map(m => m.name).join('\n');
            console.log("Available Models:\n" + modelNames);
            fs.writeFileSync('models_list.txt', modelNames);
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
            fs.writeFileSync('models_list.txt', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error fetching models:", error);
    }
}

checkModels();
