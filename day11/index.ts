import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const stones = inputLines[0].split(" ").map((x) => +x);
  let stonesMap = new Map<number, number>();
  stones.forEach((s) => stonesMap.set(s, (stonesMap.get(s) ?? 0) + 1));

  const doLoops = (count: number) => {
    for (let i = 0; i < count; i++) {
      const next = new Map<number, number>();
      const addStone = (n: number, c: number) =>
        next.set(n, (next.get(n) ?? 0) + c);
      stonesMap.entries().forEach(([s, c]) => {
        if (s === 0) {
          addStone(1, c);
          return;
        }
        if (Math.log10(s) % 2 >= 1) {
          const string = s.toString();
          addStone(+string.substring(0, string.length / 2), c);
          addStone(+string.substring(string.length / 2), c);
          return;
        }
        addStone(s * 2024, c);
      });
      stonesMap = next;
    }
  };

  doLoops(25);
  console.log(sum(stonesMap.values()));

  doLoops(50);
  console.log(sum(stonesMap.values()));
}
