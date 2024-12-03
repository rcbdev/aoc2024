import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputText }: Input) {
  const text = inputText.replaceAll("\n", "");
  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = text.matchAll(regex);

  const results = matches.map((m) => +m[1] * +m[2]).toArray();

  console.log(sum(results));

  const disabledStuffRegex = /don't\(\).*?(do\(\)|$)/g;
  const disabledText = text.matchAll(disabledStuffRegex);
  const enabledText = disabledText.reduce(
    (rv, curr) => rv.replace(curr[0], ""),
    text
  );

  const multMatches = enabledText.matchAll(regex);

  const results2 = multMatches.map((m) => +m[1] * +m[2]).toArray();

  console.log(sum(results2));
}
