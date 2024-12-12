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
    for (let i = minY; i <= maxY; i++) {
      let inside = false;
      const thisSidesIn: number[] = [];
      const thisSidesOut: number[] = [];
      for (let j = minX; j <= maxX; j++) {
        const pointHits = coordStrings.includes(pointToString(i, j));
        if (inside && !pointHits) {
          thisSidesOut.push(j);
          if (!lastSidesOut.includes(j)) {
            sidesCount++;
          }
          inside = false;
        } else if (!inside && pointHits) {
          thisSidesIn.push(j);
          if (!lastSidesIn.includes(j)) {
            sidesCount++;
          }
          inside = true;
        }
        if (inside && j === maxX) {
          thisSidesOut.push(j + 1);
          if (!lastSidesOut.includes(j + 1)) {
            sidesCount++;
          }
          inside = false;
        }
      }
      lastSidesIn = thisSidesIn;
      lastSidesOut = thisSidesOut;
    }

    lastSidesIn = [];
    lastSidesOut = [];
    for (let i = minX; i <= maxX; i++) {
      let inside = false;
      const thisSidesIn: number[] = [];
      const thisSidesOut: number[] = [];
      for (let j = minY; j <= maxY; j++) {
        const pointHits = coordStrings.includes(pointToString(j, i));
        if (inside && !pointHits) {
          thisSidesOut.push(j);
          if (!lastSidesOut.includes(j)) {
            sidesCount++;
          }
          inside = false;
        } else if (!inside && pointHits) {
          thisSidesIn.push(j);
          if (!lastSidesIn.includes(j)) {
            sidesCount++;
          }
          inside = true;
        }
        if (inside && j === maxY) {
          thisSidesOut.push(j + 1);
          if (!lastSidesOut.includes(j + 1)) {
            sidesCount++;
          }
          inside = false;
        }
      }
      lastSidesIn = thisSidesIn;
      lastSidesOut = thisSidesOut;
    }

    return sidesCount;
  };

  console.log(sum(regions.map((r) => r.area * countSides(r.coords))));
}
