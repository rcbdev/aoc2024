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

  const coordString = (x: number[]) => `${x[0]}-${x[1]}`;

  const walkMap = (obstacleCount = count) => {
    const obstacles = bytes.slice(0, obstacleCount).map(coordString);
    const visited = Array.from({ length: size }).map(() =>
      Array.from({ length: size }).fill(false)
    );
    const obstacleMap = visited.map((l, i) =>
      l.map((_, j) => obstacles.includes(coordString([i, j])))
    );
    const isInMap = isPointInArrays(visited);
    const stack = [{ pos: [0, 0], path: [[0, 0]] }];
    let best: null | number[][] = null;
    while (stack.length > 0) {
      const curr = stack.shift()!;
      if (curr.pos[0] === size - 1 && curr.pos[1] === size - 1) {
        best = curr.path;
        break;
      }
      const next = moves.map((m) => [curr.pos[0] + m[0], curr.pos[1] + m[1]]);
      const filtered = next.filter(
        (x) => isInMap(x) && !obstacleMap[x[0]][x[1]] && !visited[x[0]][x[1]]
      );
      for (const pos of filtered) {
        visited[pos[0]][pos[1]] = true;
        stack.push({ pos, path: [...curr.path, pos] });
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
