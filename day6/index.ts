import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const baseMap = inputLines.map((l) => l.split(""));
  const locationY = baseMap.findIndex((l) => l.includes("^"));
  const locationX = baseMap[locationY].indexOf("^");

  const walkPath = (map: string[][]) => {
    const visited = map.map((l) => l.map(() => 0));
    let location = [locationY, locationX];
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

      if (
        newLocation[0] < 0 ||
        newLocation[1] < 0 ||
        newLocation[0] >= map.length ||
        newLocation[1] >= map[0].length
      ) {
        break;
      }

      if (map[newLocation[0]][newLocation[1]] === "#") {
        direction = [direction[1], -1 * direction[0]];
        continue;
      }
      location = newLocation;
    }

    return visited;
  };

  const baseMapVisited = walkPath(baseMap);
  if (baseMapVisited === null) {
    throw Error("This should not happen");
  }

  const visitedCount = baseMapVisited.flatMap((l) =>
    l.filter((x) => x !== 0)
  ).length;

  console.log(visitedCount);

  let obstructionPositions = 0;

  for (let i = 0; i < baseMap.length; i++) {
    for (let j = 0; j < baseMap[i].length; j++) {
      if (baseMap[i][j] !== "." || baseMapVisited[i][j] === 0) {
        continue;
      }
      const newMap = baseMap.map((l, y) =>
        l.map((s, x) => (y === i && x === j ? "#" : s))
      );

      const result = walkPath(newMap);
      if (result === null) {
        obstructionPositions++;
      }
    }
  }

  console.log(obstructionPositions);
}
