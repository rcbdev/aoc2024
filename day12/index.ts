import { isPointInArrays } from "../utils/array";
import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split(""));
  const regions = [];
  const visited = map.map((l) => l.map(() => false));
  const isInMap = isPointInArrays(map);

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (visited[i][j]) {
        continue;
      }
      const region = {
        letter: map[i][j],
        coords: [] as number[][],
        area: 0,
        perimeter: 0,
      };
      const toVisit = [[i, j]];
      while (toVisit.length > 0) {
        const next = toVisit.shift()!;
        if (!isInMap(next) || map[next[0]][next[1]] !== region.letter) {
          region.perimeter++;
          continue;
        }
        if (visited[next[0]][next[1]]) {
          continue;
        }

        region.coords.push(next);
        region.area++;
        visited[next[0]][next[1]] = true;

        toVisit.push(
          [next[0] - 1, next[1]],
          [next[0] + 1, next[1]],
          [next[0], next[1] - 1],
          [next[0], next[1] + 1]
        );
      }
      regions.push(region);
    }
  }

  console.log(sum(regions.map((r) => r.area * r.perimeter)));

  const countSides = (coords: number[][]) => {
    const pointToString = (a: number, b: number) => `${a},${b}`;
    const coordStrings = coords.map((c) => pointToString(c[0], c[1]));

    const allY = coords.map((c) => c[0]);
    const allX = coords.map((c) => c[1]);
    const minY = Math.min(...allY);
    const maxY = Math.max(...allY);
    const minX = Math.min(...allX);
    const maxX = Math.max(...allX);

    let sidesCount = 0;
    let lastSidesIn: number[] = [];
    let lastSidesOut: number[] = [];
    let thisSidesIn: number[] = [];
    let thisSidesOut: number[] = [];
    let inside = false;
    const checkPoint = (coordStr: string, dist: number) => {
      const pointHits = coordStrings.includes(coordStr);
      if (inside && !pointHits) {
        thisSidesOut.push(dist);
        if (!lastSidesOut.includes(dist)) {
          sidesCount++;
        }
        inside = false;
      } else if (!inside && pointHits) {
        thisSidesIn.push(dist);
        if (!lastSidesIn.includes(dist)) {
          sidesCount++;
        }
        inside = true;
      }
    };

    for (let i = minY; i <= maxY; i++) {
      inside = false;
      thisSidesIn = [];
      thisSidesOut = [];
      for (let j = minX; j <= maxX + 1; j++) {
        checkPoint(pointToString(i, j), j);
      }
      lastSidesIn = thisSidesIn;
      lastSidesOut = thisSidesOut;
    }

    lastSidesIn = [];
    lastSidesOut = [];
    for (let i = minX; i <= maxX; i++) {
      inside = false;
      thisSidesIn = [];
      thisSidesOut = [];
      for (let j = minY; j <= maxY + 1; j++) {
        checkPoint(pointToString(j, i), j);
      }
      lastSidesIn = thisSidesIn;
      lastSidesOut = thisSidesOut;
    }

    return sidesCount;
  };

  console.log(sum(regions.map((r) => r.area * countSides(r.coords))));
}
