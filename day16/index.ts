import { PriorityQueue } from "../utils/queue";
import type { Input } from "../utils/types";

interface PathOption {
  position: number[];
  last: number[] | null;
  visited: number[][];
  score: number;
  dir: string;
}

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split(""));
  let start = [0, 0];
  let end = [0, 0];
  map.forEach((l, i) =>
    l.forEach((v, j) => {
      if (v === "S") {
        start = [i, j];
      } else if (v === "E") {
        end = [i, j];
      }
    })
  );
  const coordString = (coord: number[]) => `${coord[0]}-${coord[1]}`;

  const walkMap = (allRoutes = false) => {
    const queue = new PriorityQueue<PathOption>((a, b) => a.score < b.score);
    queue.push({
      position: start,
      last: null,
      score: 0,
      dir: "r",
      visited: [],
    });
    const bestPaths = [];
    let bestScore = Infinity;

    const bestMap = map.map((l) =>
      l.map<Record<string, number>>(() => ({
        u: Infinity,
        d: Infinity,
        r: Infinity,
        l: Infinity,
      }))
    );

    while (!queue.isEmpty()) {
      const current = queue.pop();
      if (current.score > bestScore) {
        break;
      }
      if (current.position[0] === end[0] && current.position[1] === end[1]) {
        bestPaths.push(current);
        bestScore = current.score;
        continue;
      }
      if (
        current.score + (allRoutes ? 0 : 1) >
        bestMap[current.position[0]][current.position[1]][current.dir]
      ) {
        continue;
      }
      bestMap[current.position[0]][current.position[1]][current.dir] =
        current.score;
      const up = [current.position[0] - 1, current.position[1]];
      const down = [current.position[0] + 1, current.position[1]];
      const left = [current.position[0], current.position[1] - 1];
      const right = [current.position[0], current.position[1] + 1];

      const candidates = [
        [up, "u"],
        [down, "d"],
        [left, "l"],
        [right, "r"],
      ] as [number[], string][];

      for (const [candidate, dir] of candidates) {
        if (
          current.last?.[0] === candidate[0] &&
          current.last?.[1] === candidate[1]
        ) {
          continue;
        }
        if (map[candidate[0]][candidate[1]] === "#") {
          continue;
        }
        const scoreAdd = current.dir === dir ? 1 : 1001;
        queue.push({
          position: candidate,
          last: current.position,
          score: current.score + scoreAdd,
          visited: [...current.visited, current.position],
          dir,
        });
      }
    }
    return {
      paths: bestPaths,
      score: bestScore,
    };
  };

  const { score } = walkMap();
  console.log(score);

  const { paths } = walkMap(true);
  const totalVisited = new Set<string>();
  paths.forEach((path) =>
    path.visited.forEach((l) => totalVisited.add(coordString(l)))
  );
  console.log(totalVisited.size + 1);
}
