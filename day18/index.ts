import { isPointInArrays } from "../utils/array";
import type { Input } from "../utils/types";

const example = {
  count: 12,
  size: 7,
};
const actual = {
  count: 1024,
  size: 71,
};

const moves = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

export default async function run({ inputLines }: Input) {
  const bytes = inputLines.map((l) => l.split(",").map((x) => +x));
  const { count, size } = actual;

  const walkMap = (obstacleCount = count) => {
    const map = Array.from({ length: size }).map(() =>
      Array.from({ length: size }).fill(false)
    );
    bytes.slice(0, obstacleCount).forEach((x) => (map[x[0]][x[1]] = true));
    const isInMap = isPointInArrays(map);
    const stack = [[[0, 0]]];
    while (stack.length > 0) {
      const curr = stack.shift()!;
      for (const move of moves) {
        const pos = [curr.at(-1)![0] + move[0], curr.at(-1)![1] + move[1]];
        if (isInMap(pos) && !map[pos[0]][pos[1]]) {
          const next = curr.concat([pos]);
          if (pos[0] === size - 1 && pos[1] == size - 1) {
            return next;
          }
          map[pos[0]][pos[1]] = true;
          stack.push(next);
        }
      }
    }
    return null;
  };

  const best = walkMap();
  console.log(best!.length - 1);

  let highestBefore = count;
  let lowestAfter = bytes.length - 1;
  let currentCheck = Math.floor((lowestAfter + highestBefore) / 2);

  while (true) {
    const check = walkMap(currentCheck) === null;
    if (check) {
      lowestAfter = currentCheck;
    } else {
      highestBefore = currentCheck;
    }
    currentCheck = Math.floor((lowestAfter + highestBefore) / 2);
    if (currentCheck === highestBefore) {
      break;
    }
  }
  console.log(bytes[lowestAfter - 1].join(","));
}
