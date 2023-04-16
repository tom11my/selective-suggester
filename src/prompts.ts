export function getPromptWithoutContext(linesOfCode: string): string {
    // const gpt4_prompt= `Output a, b, c in the form 'a$%%%b$%%%c' where a, b, and c are useful alternatives to the generative art code selection that follows:\n`;
    const gpt3Prompt = `You are an expert in generative art in p5.js. Output 3 alternatives to the following code CODE. 
Before outputting a working code suggestion, label it SUGGESTION X where X=1,2,3.
CODE: 
${linesOfCode}
`;
    return gpt3Prompt;
}

export function getPromptWithContext(
    linesOfCode: string,
    sourceCode: string
): string {
    const gpt3Prompt = `You are an expert in generative art in p5.js. Output 3 interesting and different alternatives to the following code CODE which exists in the larger context of FILE.
Do not recommend changes outside of the code selection.
Label each suggestion that might replace CODE as SUGGESTION X where X=1,2,3.
CODE: 
${linesOfCode}
FILE:
${sourceCode}`;
    return gpt3Prompt;
}

export function getRegexForOutput() {
    // return /(?:SUGGESTION \d+: )(.*?)(?=\n\nSUGGESTION|\n?$)/g;
    return /SUGGESTION \d+: +((?:(?!SUGGESTION \d+:)[\s\S])+)/g;
}
