import type { Input } from "../utils/types";
import { sum } from "../utils/math";

export default async function run({ inputLines }: Input) {
  const left: number[] = [];
  const right: number[] = [];

  inputLines.forEach((line) => {
    const parts = line.split(/\s+/);
    left.push(+parts[0]);
    right.push(+parts[1]);
  });

  left.sort();
  right.sort();

  const diffs = left.map((l, i) => Math.abs(l - right[i]));

  console.log(sum(diffs));

  const rightCounts = right.reduce<Record<number, number>>(
    (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
    {}
  );
  const similarities = left.map((l) => l * (rightCounts[l] ?? 0));

  console.log(sum(similarities));
}
