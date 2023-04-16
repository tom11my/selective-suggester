// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import Suggestion from "./suggestion";
import { Selection } from "vscode";
import { SuggestionCompletionProvider } from "./completion"; // Import the SuggestionCompletionProvider class

const LANG = "javascript";
// Type "suggester" in command pallete of Ext Host Window to start
export function activate(context: vscode.ExtensionContext) {
    // register completion provider
    vscode.window.showInformationMessage("Extension suggester is now active!");
    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: "file", language: LANG },
        new SuggestionCompletionProvider()
    );
    context.subscriptions.push(provider);

    // TODO: Make tab work normally when no selection is active when its pressed
    // register command to handle tab keypress
    const handleTabCommand = vscode.commands.registerCommand(
        "selective-suggester.handleTabKeypress",
        async () => {
            vscode.window.showInformationMessage("Tab pressed");
            const editor = vscode.window.activeTextEditor;
            if (editor && !editor.selection.isEmpty) {
                await vscode.commands.executeCommand(
                    "editor.action.triggerSuggest"
                );
            }
        }
    );
    context.subscriptions.push(handleTabCommand);

    let showInfoBox = vscode.commands.registerCommand(
        "selective-suggester.suggester",
        () => {}
    );
    context.subscriptions.push(showInfoBox);

    const selectionStoragePath = path.join(
        context.extensionPath,
        "testing/data.json" // serialization in local testing folder
    );
    let selections: Array<Suggestion> = [];
    if (fs.existsSync(selectionStoragePath)) {
        selections = JSON.parse(fs.readFileSync(selectionStoragePath, "utf8"));
    }

    // function saveData() {
    //     try {
    //         fs.writeFileSync(
    //             selectionStoragePath,
    //             JSON.stringify(selections),
    //             "utf8"
    //         );
    //     } catch (err) {
    //         console.error("Error writing file", err);
    //     }
    // }
}
// This method is called when your extension is deactivated
export function deactivate() {}
