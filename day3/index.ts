import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputText }: Input) {
  const text = inputText.replaceAll("\n", "");

  const runInstructions = (text: string) => {
    const matches = text.matchAll(/mul\((\d+),(\d+)\)/g);
    const results = matches.map((m) => +m[1] * +m[2]);
    return sum(results);
  };

  console.log(runInstructions(text));

  const disabledText = text.matchAll(/don't\(\).*?(do\(\)|$)/g);
  const enabledText = disabledText.reduce(
    (rv, curr) => rv.replace(curr[0], ""),
    text
  );

  console.log(runInstructions(enabledText));
}
