import { isPointInArrays } from "../utils/array";
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

  const isInMap = isPointInArrays(map);

  const findCheats = (time = 2) => {
    return path.flatMap((x, i) => {
      const saves = [];
      const before = coordString(x);
      const seen = [before];

      let options = directions.map((d) => [d[0] + x[0], d[1] + x[1]]);
      options.forEach((x) => seen.push(coordString(x)));
      const maxCheat = Math.min(path.length - i - 2, time);
      for (let i = 1; i < maxCheat; i++) {
        if (options.length === 0) {
          break;
        }
        const nextOptions = [];
        for (const d2 of directions) {
          for (const option of options) {
            const double = [d2[0] + option[0], d2[1] + option[1]];
            const doubleStr = coordString(double);
            if (seen.includes(doubleStr)) {
              continue;
            }
            if (!isInMap(double)) {
              continue;
            }
            seen.push(doubleStr);
            nextOptions.push(double);
            if (!pathCheck.includes(doubleStr)) {
              continue;
            }
            const save =
              pathCheck.indexOf(doubleStr) - pathCheck.indexOf(before) - i - 1;
            if (save >= 0) {
              saves.push(save);
            }
          }
        }
        options = nextOptions;
      }

      return saves;
    });
  };

  console.log(findCheats().filter((x) => x >= 100).length);
  console.log(findCheats(20).filter((x) => x >= 100).length);
}
