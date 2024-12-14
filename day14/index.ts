import { product } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const getBots = () =>
    inputLines.map((l) => {
      const parts = l.split(" ");
      const p = parts[0]
        .replace("p=", "")
        .split(",")
        .map((x) => +x);
      const v = parts[1]
        .replace("v=", "")
        .split(",")
        .map((x) => +x);

      return { p, v };
    });
  const robots = getBots();
  // const bounds = [11, 7];
  const bounds = [101, 103];

  const moveBots = (
    robots: ReturnType<typeof getBots>,
    map: number[][] | null = null
  ) => {
    robots.forEach((r) => {
      if (map) {
        map[r.p[1]][r.p[0]]--;
      }
      r.p[0] = (r.p[0] + r.v[0] + bounds[0]) % bounds[0];
      r.p[1] = (r.p[1] + r.v[1] + bounds[1]) % bounds[1];
      if (map) {
        map[r.p[1]][r.p[0]]++;
      }
    });
  };

  for (let i = 0; i < 100; i++) {
    moveBots(robots);
  }

  const quadrants = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const halves = [(bounds[0] + 1) / 2, (bounds[1] + 1) / 2];
      const topLeft = [i * halves[0], j * halves[1]];
      const bottomRight = [(i + 1) * halves[0] - 1, (j + 1) * halves[1] - 1];

      const bots = robots.filter(
        (r) =>
          r.p[0] >= topLeft[0] &&
          r.p[0] < bottomRight[0] &&
          r.p[1] >= topLeft[1] &&
          r.p[1] < bottomRight[1]
      ).length;

      quadrants.push(bots);
    }
  }
  console.log(product(quadrants));

  const treeBots = inputLines.map((l) => {
    const parts = l.split(" ");
    const p = parts[0]
      .replace("p=", "")
      .split(",")
      .map((x) => +x);
    const v = parts[1]
      .replace("v=", "")
      .split(",")
      .map((x) => +x);

    return { p, v };
  });

  const isTree = async (map: number[][]) => {
    const output = map
      .map((l) => l.map((x) => (x > 0 ? "#" : " ")).join(""))
      .join("\n");
    console.clear();
    console.log(output);

    for await (const line of console) {
      if (line === "y") {
        return true;
      }
      return false;
    }
  };

  const map = Array.from({ length: bounds[1] }).map((_, i) =>
    Array.from({ length: bounds[0] }).map(
      (_, j) => treeBots.filter((b) => b.p[1] === i && b.p[0] === j).length
    )
  );
  let i = 0;
  while (true) {
    if (await isTree(map)) {
      break;
    }
    moveBots(treeBots, map);
    i++;
  }

  console.log(i);
}
