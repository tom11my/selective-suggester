import * as dotenv from "dotenv";
import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";
import * as fs from "fs";
import { REGEX_FOR_OUTPUT } from "./prompts";

const LOGGER_PATH = path.join(__dirname, "..", "logs", "one-time-log");
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
const apiKey = process.env.OPENAI_SECRET_KEY;
const openaiApiUrl = "https://api.openai.com/v1/completions";

export async function getAlternativesWithoutContext(
    prompt: string
): Promise<Array<string>> {
    try {
        const response = await axios.post(
            openaiApiUrl,
            {
                model: "text-davinci-003",
                // mode: "gpt-3.5-turbo",
                prompt: prompt,
                n: 1,
                max_tokens: 150,
                temperature: 0.5,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
            }
        );
        // for testing
        // const output =
        //     "\n\nSUGGESTION 1: fill(random(255), random(0), random(100));\n\nSUGGESTION 2: fill(random(200), random(100), random(200));\n\nSUGGESTION 3: fill(random(100), random(255), random(150));";
        const output = response.data.choices[0].text ?? "";
        const suggestions: Array<string> = [];
        let match;
        while ((match = REGEX_FOR_OUTPUT.exec(output.trim())) !== null) {
            suggestions.push(match[1].trim());
        }
        // log the output since console is broken
        fs.writeFileSync(LOGGER_PATH, JSON.stringify(response.data));
        vscode.window.showInformationMessage("success");
        return suggestions;
    } catch (error) {
        const message = (error as any).message;
        vscode.window.showErrorMessage("Error: " + message);
        return [];
    }
}
