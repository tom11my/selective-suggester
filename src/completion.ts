import * as vscode from "vscode";
import Suggestion from "./suggestion";
import { TextDecoder } from "util";
export class SuggestionCompletionProvider
    implements vscode.CompletionItemProvider
{
    async provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.CompletionList | undefined> {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            if (!selection.isEmpty) {
                const suggestion = new Suggestion(
                    selection.start.line,
                    selection.end.line,
                    editor,
                    selection
                );
                const selectionText = suggestion.getSelectionContent();
                vscode.window.showInformationMessage(document.fileName);
                const fileContents = await readFileContent(
                    vscode.Uri.file(document.fileName)
                );

                const suggestions = await suggestion.suggestAlternatives(
                    selectionText,
                    fileContents
                );
                const completionItems = suggestions.map((suggestion, index) => {
                    const completionItem = new vscode.CompletionItem(
                        suggestion,
                        vscode.CompletionItemKind.Snippet
                    );
                    completionItem.sortText = `00${index}`; // Ensure the correct order of suggestions
                    return completionItem;
                });
                // Create a completion list with the isIncomplete property set to true
                const completionList = new vscode.CompletionList(
                    completionItems,
                    false // is complete, further typing will not trigger completion
                );
                return completionList;
            }
            return undefined;
        }
    }
}

async function readFileContent(uri: vscode.Uri): Promise<string> {
    try {
        const fileData = await vscode.workspace.fs.readFile(uri);
        const content = new TextDecoder().decode(fileData);
        return content;
    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return "";
    }
}
