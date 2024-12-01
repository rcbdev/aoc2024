const args = process.argv;

const day = `day${args[2]}`;
const input = args[3] ?? "input";

const file = Bun.file(`./${day}/${input}.txt`);
const inputText = await file.text();
const inputLines = inputText.split(/\r?\n/);

const solution = await import(`./${day}`);

console.time("execution time");
await solution.default({
  inputText,
  inputLines,
});
console.timeEnd("execution time");
