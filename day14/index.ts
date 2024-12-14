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

      return {
        p,
        v,
        x: [] as number[],
        y: [] as number[],
      };
    });
  const robots = getBots();
  const bounds = [101, 103];

  const moveBots = (robots: ReturnType<typeof getBots>, amount = 1) => {
    robots.forEach((r) => {
      r.x.push(r.p[0]);
      r.y.push(r.p[1]);
      r.p[0] = (r.p[0] + amount * (r.v[0] + bounds[0])) % bounds[0];
      r.p[1] = (r.p[1] + amount * (r.v[1] + bounds[1])) % bounds[1];
    });
  };

  moveBots(robots, 100);

  const halves = [(bounds[0] - 1) / 2, (bounds[1] - 1) / 2];
  const quadrants = [0, 0, 0, 0];
  robots.forEach((r) => {
    const x = r.p[0] - halves[0];
    const y = r.p[1] - halves[1];
    if (x === 0 || y === 0) {
      return;
    }
    const index = (x < 0 ? 0 : 1) + (y < 0 ? 0 : 2);
    quadrants[index]++;
  });

  console.log(product(quadrants));

  const treeBots = getBots();

  let i = 0;
  let xLoop: null | [number, number] = null;
  let yLoop: null | [number, number] = null;
  while (true) {
    moveBots(treeBots);
    i++;
    if (!xLoop) {
      if (treeBots.every((b) => b.x.includes(b.p[0]))) {
        for (let j = 0; j < treeBots[0].x.length; j++) {
          const xs = treeBots
            .map((r) => r.x[j])
            .reduce(
              (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
              {} as Record<number, number>
            );
          if (Object.values(xs).some((v) => v > 25)) {
            xLoop = [i + j, j];
            break;
          }
        }
      }
    }
    if (!yLoop) {
      if (treeBots.every((b) => b.y.includes(b.p[1]))) {
        for (let j = 0; j < treeBots[0].y.length; j++) {
          const ys = treeBots
            .map((r) => r.y[j])
            .reduce(
              (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
              {} as Record<number, number>
            );
          if (Object.values(ys).some((v) => v > 25)) {
            yLoop = [i + j, j];
            break;
          }
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
