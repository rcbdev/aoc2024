import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const startingNumbers = inputLines.map((l) => +l);

  const changeSequences = new Map<number, number>();

  const sequencer = (secret: number) => {
    const mult64 = secret * 64;
    const step1 = secret ^ mult64 % 16777216;
    const div32 = step1 / 32;
    const step2 = step1 ^ div32;
    const mult2048 = step2 * 2048;
    const step3 = step2 ^ mult2048 % 16777216;
    return step3;
  };

  const runForSteps = (steps: number) => (number: number) => {
    let num = number;
    let diffs: number = 0;
    const seen = new Set<number>();
    for (let i = 0; i < steps; i++) {
      const next = sequencer(num);
      const price = next % 10;
      const lastPrice = num % 10;
      const diff = price - lastPrice;
      diffs = ((diffs << 5) + 10 + diff) % 1_048_576;
      if (i >= 3) {
        const key = diffs;
        if (!seen.has(key)) {
          if (!changeSequences.has(key)) {
            changeSequences.set(key, price);
          } else {
            const total = changeSequences.get(key)!;
            changeSequences.set(key, total + price);
          }
          seen.add(key);
        }
      }
      num = next;
    }
    return num;
  };

  const after2000 = startingNumbers.map(runForSteps(2000));
  console.log(sum(after2000));

  const sequenceValues = changeSequences.entries().toArray();
  const best = sequenceValues.sort((a, b) => b[1] - a[1])[0];
  console.log(best[1]);
}
