"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// Type "suggester" in command pallete of Ext Host Window to start
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "selective-suggester" is now active!');
    const dataFilePath = path.join(context.extensionPath, "testing/data.json");
    let showInfoBox = vscode.commands.registerCommand("selective-suggester.suggester", () => {
        vscode.window.showInformationMessage("Hello World from selective-suggester!" + dataFilePath);
    });
    context.subscriptions.push(showInfoBox);
    // read data from dataFilePath into lineMovements
    let lineMovements = {};
    if (fs.existsSync(dataFilePath)) {
        lineMovements = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));
    }
    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection((e) => {
        updateHighlightDecoration(e.textEditor);
        recordLineMovement(e.textEditor);
    }), vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            updateHighlightDecoration(editor);
        }
    }));
    const highlightDecorationType = vscode.window.createTextEditorDecorationType({
        backgroundColor: "rgba(255, 0, 0, 0.2)",
    });
    function updateHighlightDecoration(editor) {
        const currentLine = editor.selection.active.line;
        const range = editor.document.lineAt(currentLine).range;
        editor.setDecorations(highlightDecorationType, [range]);
    }
    function recordLineMovement(editor) {
        const fileName = editor.document.fileName;
        if (!lineMovements.hasOwnProperty(fileName)) {
            lineMovements[fileName] = 0;
        }
        lineMovements[fileName] += 1;
        saveData();
    }
    function saveData() {
        try {
            fs.writeFileSync(dataFilePath, JSON.stringify(lineMovements), "utf8");
        }
        catch (err) {
            console.error("Error writing file", err);
        }
    }
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map