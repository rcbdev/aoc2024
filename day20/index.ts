import { isPointInArrays } from "../utils/array";
import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split(""));
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const pathCheck: string[] = [];
  const path: number[][] = [];
  let start = [0, 0];
  let end = [0, 0];

  map.forEach((l, i) =>
    l.forEach((v, j) => {
      if (v === "S") {
        start = [i, j];
      }
      if (v === "E") {
        end = [i, j];
      }
    })
  );

  let pos = start;
  path.push(pos);
  let back = [0, 0];
  while (pos[0] !== end[0] || pos[1] !== end[1]) {
    const [next, d] = directions
      .filter((d) => d[0] !== back[0] || d[1] !== back[1])
      .map((d) => [[pos[0] + d[0], pos[1] + d[1]], d])
      .find((x) => map[x[0][0]][x[0][1]] !== "#")!;
    path.push(next);
    back = [d[0] * -1, d[1] * -1];
    pos = next;
  }

  const findCheats = (time = 2, cheatTarget = 100) => {
    return path.reduce((rv, x, i) => {
      const possible = path.slice(i).filter((y, j) => {
        const dist = Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]);
        return j - dist >= cheatTarget && dist <= time;
      });

      return rv + possible.length;
    }, 0);
  };

  console.log(findCheats());
  console.log(findCheats(20, 100));
}
