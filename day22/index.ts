import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const startingNumbers = inputLines.map((l) => BigInt(+l));

  const changeSequences = new Map<string, Map<number, bigint>>();

  const sequencer = (secret: bigint) => {
    const mult64 = secret * 64n;
    const step1 = (secret ^ mult64) % 16777216n;
    const div32 = step1 / 32n;
    const step2 = (step1 ^ div32) % 16777216n;
    const mult2048 = step2 * 2048n;
    const step3 = (step2 ^ mult2048) % 16777216n;
    return step3;
  };

  const runForSteps = (steps: number) => (number: bigint, idx: number) => {
    let num = number;
    const diffs: bigint[] = [];
    for (let i = 0; i < steps; i++) {
      const next = sequencer(num);
      const price = next % 10n;
      const lastPrice = num % 10n;
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
  console.log(sum(after2000.map((x) => Number(x))));

  const sequenceValues = changeSequences
    .entries()
    .map(([k, v]) => [k, sum(v.values().map((x) => Number(x)))] as const)
    .toArray();
  const best = sequenceValues.sort((a, b) => b[1] - a[1])[0];
  console.log(best);
}
