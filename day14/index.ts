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
      };
    });
  const robots = getBots();
  const bounds = [101, 103];

  const moveBots = (robots: ReturnType<typeof getBots>, amount = 1) => {
    robots.forEach((r) => {
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

  let xLoop: null | [number, number] = null;
  let yLoop: null | [number, number] = null;
  const maxSteps = Math.max(...bounds);
  const baseArray = <T>(length: number): T[] => new Array(length).fill(0);
  for (let i = 0; i < maxSteps; i++) {
    const [x, y] = treeBots.reduce(
      (rv, curr) => {
        rv[0][curr.p[0]]++;
        rv[1][curr.p[1]]++;
        return rv;
      },
      [baseArray<number>(bounds[0]), baseArray<number>(bounds[1])]
    );
    if (!xLoop && Math.max(...x) > 25) {
      xLoop = [bounds[0], i];
    }
    if (!yLoop && Math.max(...y) > 25) {
      yLoop = [bounds[1], i];
    }
    if (xLoop && yLoop) {
      break;
    }
    moveBots(treeBots);
  }

  if (!xLoop || !yLoop) {
    throw new Error("Something broke");
  }

  const a = xLoop[1];
  const b = xLoop[0];
  const c = yLoop[1];
  const d = yLoop[0];

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
