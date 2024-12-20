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

  const coordString = (x: number[]) => `${x[0]},${x[1]}`;

  let pos = start;
  path.push(pos);
  pathCheck.push(coordString(pos));
  while (pos[0] !== end[0] || pos[1] !== end[1]) {
    const next = directions
      .map((d) => [pos[0] + d[0], pos[1] + d[1]])
      .filter((x) => map[x[0]][x[1]] !== "#")
      .find((x) => !pathCheck.includes(coordString(x)))!;
    path.push(next);
    pathCheck.push(coordString(next));
    pos = next;
  }

  const findCheats = (time = 2, cheatTarget = 100) => {
    return path.reduce((rv, x, i) => {
      const possible = path.filter((y, j) => {
        if (j <= i) {
          return false;
        }
        const dist = Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]);
        return j - i - dist >= cheatTarget && dist <= time;
      });

      return rv + possible.length;
    }, 0);
  };

  console.log(findCheats());
  console.log(findCheats(20, 100));
}
