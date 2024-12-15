import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const map = [] as string[][];
  const instructions = [] as string[];
  let mapSection = true;
  inputLines.forEach((l) => {
    if (l === "") {
      mapSection = false;
      return;
    }
    if (mapSection) {
      map.push(l.split(""));
    } else {
      instructions.push(...l.split(""));
    }
  });
  const map2 = map.map((l) => [...l]);

  let robot = [-1, -1];
  map.forEach((l, i) => {
    if (l.indexOf("@") !== -1) {
      robot = [i, l.indexOf("@")];
    }
  });

  const directions: Record<string, number[]> = {
    ">": [0, 1],
    "<": [0, -1],
    "^": [-1, 0],
    v: [1, 0],
  };

  for (const instruction of instructions) {
    const direction = directions[instruction];
    let i = 1;
    while (
      map[robot[0] + direction[0] * i][robot[1] + direction[1] * i] === "O"
    ) {
      i++;
    }
    if (map[robot[0] + direction[0] * i][robot[1] + direction[1] * i] === "#") {
      continue;
    }
    for (let j = i; j > 0; j--) {
      map[robot[0] + direction[0] * j][robot[1] + direction[1] * j] =
        map[robot[0] + direction[0] * (j - 1)][
          robot[1] + direction[1] * (j - 1)
        ];
    }
    map[robot[0]][robot[1]] = ".";
    robot = [robot[0] + direction[0], robot[1] + direction[1]];
  }

  const scores = map.flatMap((l, i) =>
    l.map((v, j) => (v === "O" ? i * 100 + j : 0))
  );

  console.log(sum(scores));

  const bigMap = map2.map((l) =>
    l.flatMap((v) => {
      switch (v) {
        case "#":
          return ["#", "#"];
        case "O":
          return ["[", "]"];
        case "@":
          return ["@", "."];
        default:
          return [".", "."];
      }
    })
  );
  bigMap.forEach((l, i) => {
    if (l.indexOf("@") !== -1) {
      robot = [i, l.indexOf("@")];
    }
  });

  for (const instruction of instructions) {
    const direction = directions[instruction];
    if (direction[0] === 0) {
      let i = 1;
      while (
        bigMap[robot[0]][robot[1] + direction[1] * i] === "[" ||
        bigMap[robot[0]][robot[1] + direction[1] * i] === "]"
      ) {
        i++;
      }
      if (bigMap[robot[0]][robot[1] + direction[1] * i] === "#") {
        continue;
      }
      for (let j = i; j > 0; j--) {
        bigMap[robot[0]][robot[1] + direction[1] * j] =
          bigMap[robot[0]][robot[1] + direction[1] * (j - 1)];
      }
      bigMap[robot[0]][robot[1]] = ".";
      robot = [robot[0], robot[1] + direction[1]];
    } else {
      const toMove: number[][] = [];
      const toCheck = [[robot[0], robot[1]]];
      let passed = true;

      while (toCheck.length > 0) {
        const curr = toCheck.shift()!;
        if (toMove.find(([y, x]) => y === curr[0] && x === curr[1])) {
          continue;
        }
        toMove.push(curr);
        const next = [curr[0] + direction[0], curr[1]];
        if (bigMap[next[0]][next[1]] === "#") {
          passed = false;
          break;
        }
        if (bigMap[next[0]][next[1]] === "]") {
          toCheck.push(next, [next[0], next[1] - 1]);
        } else if (bigMap[next[0]][next[1]] === "[") {
          toCheck.push(next, [next[0], next[1] + 1]);
        }
      }
      if (!passed) {
        continue;
      }

      for (let i = toMove.length - 1; i >= 0; i--) {
        const moving = toMove[i];
        bigMap[moving[0] + direction[0]][moving[1]] =
          bigMap[moving[0]][moving[1]];
        bigMap[moving[0]][moving[1]] = ".";
      }
      robot = [robot[0] + direction[0], robot[1]];
    }
  }

  const bigScores = bigMap.flatMap((l, i) =>
    l.map((v, j) => (v === "[" ? i * 100 + j : 0))
  );

  console.log(sum(bigScores));
}
