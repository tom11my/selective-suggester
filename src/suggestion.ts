import { Selection, TextEditor, Range } from "vscode";
import { getAlternativesWithoutContext } from "./api";
import { PROMPT } from "./prompts";

enum Status {
    INITITAL = "INITITAL",
    SUGGESTING = "SUGGESTING",
    ACCEPTED = "ACCEPTED",
}

export default class Suggestion {
    editor: TextEditor;
    selection: Selection;
    start: number;
    end: number;
    status: Status;
    suggestions: Array<string>;

    constructor(
        start: number,
        end: number,
        editor: TextEditor,
        selection: Selection
    ) {
        this.start = start;
        this.end = end;
        this.editor = editor;
        this.selection = selection;
        this.status = Status.INITITAL;
        this.suggestions = [];
    }
    async suggestAlternatives(selectionText: string): Promise<Array<string>> {
        this.status = Status.SUGGESTING;
        const alternatives: Array<string> = await getAlternativesWithoutContext(
            PROMPT + selectionText
        );
        return alternatives;
    }

    getSelectionContent(): string {
        const selection = this.editor.selection;
        const range = new Range(selection.start, selection.end);
        return this.editor.document.getText(range);
    }
}
