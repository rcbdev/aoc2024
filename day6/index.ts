import type { Input } from "../utils/types";
import { isPointInArrays } from "../utils/array";

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split("").map((x) => x === "#"));
  const startY = inputLines.findIndex((l) => l.includes("^"));
  const startX = inputLines[startY].indexOf("^");
  const isInMap = isPointInArrays(map);

  const walkPath = () => {
    const visited = map.map((l) => l.map(() => 0));
    let location = [startY, startX];
    let direction = [-1, 0];

    while (true) {
      visited[location[0]][location[1]]++;
      if (visited[location[0]][location[1]] > 4) {
        return null;
      }
      const newLocation = [
        location[0] + direction[0],
        location[1] + direction[1],
      ];

      if (!isInMap(newLocation)) {
        break;
      }

      if (map[newLocation[0]][newLocation[1]]) {
        direction = [direction[1], -1 * direction[0]];
        continue;
      }
      location = newLocation;
    }

    return visited;
  };

  const baseMapVisited = walkPath();
  if (baseMapVisited === null) {
    throw Error("This should not happen");
  }

  const visitedCount = baseMapVisited.flatMap((l) =>
    l.filter((x) => x !== 0)
  ).length;

  console.log(visitedCount);

  let obstructionPositions = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] || baseMapVisited[i][j] === 0) {
        continue;
      }
      map[i][j] = true;
      if (walkPath() === null) {
        obstructionPositions++;
      }
      map[i][j] = false;
    }
  }

  console.log(obstructionPositions);
}
