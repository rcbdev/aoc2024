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
    const map = Array.from({ length: size }).map((_, i) =>
      Array.from({ length: size }).fill(false)
    );
    bytes.slice(0, obstacleCount).forEach((x) => (map[x[0]][x[1]] = true));
    const isInMap = isPointInArrays(map);
    const stack = [{ pos: [0, 0], path: [[0, 0]] }];
    let best: null | number[][] = null;
    while (stack.length > 0) {
      const curr = stack.shift()!;
      const next = moves.map((m) => [curr.pos[0] + m[0], curr.pos[1] + m[1]]);
      for (const pos of next) {
        if (isInMap(pos) && !map[pos[0]][pos[1]]) {
          if (pos[0] === size - 1 && pos[1] == size - 1) {
            best = curr.path;
            break;
          }
          map[pos[0]][pos[1]] = true;
          stack.push({ pos, path: [...curr.path, pos] });
        }
      }
    }
    return best;
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
