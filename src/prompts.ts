// export const DELIMITER = "%%%";
// const GPT4_PROMPT = `Output a, b, c in the form 'a$%%%b$%%%c' where a, b, and c are useful alternatives to the generative art code selection that follows:\n`;
export const REGEX_FOR_OUTPUT =
    /(?:SUGGESTION \d+: )(.*?)(?=\n\nSUGGESTION|\n?$)/g;
const GPT3_PROMPT = `Output 3 alternatives to the following code that exists in a program for generative art.
Before outputting a suggestion, label it SUGGESTION X where X=1,2,3. Here is the code:`;
export const PROMPT = GPT3_PROMPT;
