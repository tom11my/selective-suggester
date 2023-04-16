import * as dotenv from "dotenv";
import * as vscode from "vscode";
import * as path from "path";
import axios from "axios";
import * as fs from "fs";
import { getRegexForOutput } from "./prompts";
import { log } from "./logger";

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
const apiKey = process.env.OPENAI_SECRET_KEY;
const openaiApiUrl = "https://api.openai.com/v1/completions";

// for testing
// export async function getAlternativesWithoutContext(
//     prompt: string
// ): Promise<Array<string>> {
//     const response = {
//         text: "\nSUGGESTION 1:\nconst x = (i + 0.5) * squareSize;\n            const y = (j + 0.5) * squareSize;\n            const n = noise(i * 0.1, j * 0.1);\n\nSUGGESTION 2:\nconst x = (i + 0.5) * squareSize;\n            const y = (j + 0.5) * squareSize;\n            const n = ((i + j) % 4) * (PI / 2);\n\nSUGGESTION 3:\nconst x = (i + 0.5) * squareSize;\n            const y = (j + 0",
//     };

//     // const response = {
//     //     text: "\n\nSUGGESTION 1: fill(random(255), random(0), random(100));\n\nSUGGESTION 2: fill(random(200), random(100), random(200));\n\nSUGGESTION 3: fill(random(100), random(255), random(150));",
//     // };
//     const suggestions = splitOuputIntoSuggestions(response.text);
//     log(JSON.stringify(suggestions));
//     return suggestions;
// }

function splitOuputIntoSuggestions(output: string): Array<string> {
    const regex = getRegexForOutput();

    const suggestions: Array<string> = [];
    let match;
    while ((match = regex.exec(output)) !== null) {
        suggestions.push(match[1].trim());
    }
    // const suggestions = output.match(regex);
    // if (suggestions) {
    //     return suggestions.map((suggestion) => suggestion.replace(regex, "$1"));
    // }
    return suggestions;
}
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
        log(JSON.stringify(response.data));
        // const output = (response.data.choices[0].text ?? "").trim();
        // const suggestions: Array<string> = [];

        // log the output since console is broken
        const suggestions = splitOuputIntoSuggestions(
            response.data.choices[0].text
        );
        log(JSON.stringify(suggestions));

        vscode.window.showInformationMessage("success");
        return suggestions;
    } catch (error) {
        const message = (error as any).message;
        vscode.window.showErrorMessage("Error: " + message);
        return [];
    }
}
