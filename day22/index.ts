import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const startingNumbers = inputLines.map((l) => +l);

  const changeSequences = new Map<string, Map<number, number>>();

  const sequencer = (secret: number) => {
    const mult64 = secret * 64;
    const step1 = secret ^ mult64 % 16777216;
    const div32 = step1 / 32;
    const step2 = step1 ^ div32;
    const mult2048 = step2 * 2048;
    const step3 = step2 ^ mult2048 % 16777216;
    return step3;
  };

  const runForSteps = (steps: number) => (number: number, idx: number) => {
    let num = number;
    const diffs: number[] = [];
    for (let i = 0; i < steps; i++) {
      const next = sequencer(num);
      const price = next % 10;
      const lastPrice = num % 10;
      diffs.push(price - lastPrice);
      if (diffs.length > 4) {
        diffs.shift();
      }
      if (diffs.length === 4) {
        const key = diffs.join();
        if (!changeSequences.has(key)) {
          changeSequences.set(key, new Map());
        }
        const map = changeSequences.get(key)!;
        if (!map.has(idx)) {
          map.set(idx, price);
        }
      }
      num = next;
    }
    return num;
  };

  const after2000 = startingNumbers.map(runForSteps(2000));
  console.log(sum(after2000));

  const sequenceValues = changeSequences
    .entries()
    .map(([k, v]) => [k, sum(v.values())] as const)
    .toArray();
  const best = sequenceValues.sort((a, b) => b[1] - a[1])[0];
  console.log(best);
}
