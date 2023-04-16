"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const completion_1 = require("./completion"); // Import the SuggestionCompletionProvider class
const LANG = "javascript";
// Type "suggester" in command pallete of Ext Host Window to start
function activate(context) {
    // register completion provider
    vscode.window.showInformationMessage("Extension suggester is now active!");
    const provider = vscode.languages.registerCompletionItemProvider({ scheme: "file", language: LANG }, new completion_1.SuggestionCompletionProvider());
    context.subscriptions.push(provider);
    // TODO: Make tab work normally when no selection is active when its pressed
    // register command to handle tab keypress
    const handleTabCommand = vscode.commands.registerCommand("selective-suggester.handleTabKeypress", async () => {
        vscode.window.showInformationMessage("Tab pressed");
        const editor = vscode.window.activeTextEditor;
        if (editor && !editor.selection.isEmpty) {
            await vscode.commands.executeCommand("editor.action.triggerSuggest");
        }
    });
    context.subscriptions.push(handleTabCommand);
    let showInfoBox = vscode.commands.registerCommand("selective-suggester.suggester", () => { });
    context.subscriptions.push(showInfoBox);
    const selectionStoragePath = path.join(context.extensionPath, "testing/data.json" // serialization in local testing folder
    );
    let selections = [];
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
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map