import { isPointInArrays } from "../utils/array";
import { sum } from "../utils/math";
import type { Input } from "../utils/types";

type Coord = [number, number];

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split("").map((x) => +x));
  const isInMap = isPointInArrays(map);

  const walk = (from: Coord[]): Coord[][] => {
    const current = from.at(-1);
    if (!current) {
      return [];
    }
    const nextNumber = map[current[0]][current[1]] + 1;
    if (nextNumber === 10) {
      return [from];
    }
    const up: Coord = [current[0] - 1, current[1]];
    const down: Coord = [current[0] + 1, current[1]];
    const left: Coord = [current[0], current[1] - 1];
    const right: Coord = [current[0], current[1] + 1];

    return [up, down, left, right]
      .filter((x) => isInMap(x) && map[x[0]][x[1]] === nextNumber)
      .flatMap((x) => walk([...from, x]));
  };

  const trailHeads = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] !== 0) {
        continue;
      }
      trailHeads.push(walk([[i, j]]));
    }
  }

  const scores = trailHeads.map((t) => {
    const ends = new Set<string>();
    for (const path of t) {
      ends.add(path.at(-1)?.join("") ?? "");
    }
    return ends.size;
  });

  console.log(sum(scores));

  console.log(sum(trailHeads.map((t) => t.length)));
}
