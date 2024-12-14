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

      return { p, v, x: [] as number[], y: [] as number[] };
    });
  const robots = getBots();
  // const bounds = [11, 7];
  const bounds = [101, 103];

  const moveBots = (robots: ReturnType<typeof getBots>, amount = 1) => {
    robots.forEach((r) => {
      r.x.push(r.p[0]);
      r.y.push(r.p[1]);
      r.p[0] = (r.p[0] + amount * r.v[0] + amount * bounds[0]) % bounds[0];
      r.p[1] = (r.p[1] + amount * r.v[1] + amount * bounds[1]) % bounds[1];
    });
  };

  moveBots(robots, 100);

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

  const treeBots = getBots();

  let i = 0;
  let xLoop: null | [number, number] = null;
  let yLoop: null | [number, number] = null;
  while (true) {
    moveBots(treeBots);
    i++;
    if (!xLoop) {
      const looping = treeBots.filter((b) => b.x.includes(b.p[0]));
      if (looping.length > treeBots.length / 2) {
        const xs = looping
          .map((r) => r.p[0])
          .reduce(
            (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
            {} as Record<number, number>
          );
        if (Object.values(xs).some((v) => v > 25)) {
          xLoop = [i, looping[0].x.indexOf(looping[0].p[0])];
        }
      }
    }
    if (!yLoop) {
      const looping = treeBots.filter((b) => b.y.includes(b.p[1]));
      if (looping.length > treeBots.length / 2) {
        const ys = looping
          .map((r) => r.p[1])
          .reduce(
            (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
            {} as Record<number, number>
          );
        if (Object.values(ys).some((v) => v > 25)) {
          yLoop = [i, looping[0].y.indexOf(looping[0].p[1])];
        }
      }
    }
    if (xLoop && yLoop) {
      break;
    }
  }

  const a = xLoop[1];
  const b = xLoop[0] - a;
  const c = yLoop[1];
  const d = yLoop[0] - c;

  let j = 1;
  while (true) {
    const test = a + j * b;
    if ((test - c) % d === 0) {
      console.log(test);
      break;
    }
    j++;
  }
}
