import type { Input } from "../utils/types";

type Coord = [number, number];

export default async function run({ inputLines }: Input) {
  const searchForWord = (word: string) => {
    const matches = [];

    const checkForMatches = (start: Coord) => {
      const found = [];

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          if (x === 0 && y === 0) {
            continue;
          }
          const coords = [start];
          for (let i = 1; i < word.length; i++) {
            const coord: Coord = [start[0] + i * x, start[1] + i * y];
            if (inputLines[coord[0]]?.[coord[1]] !== word[i]) {
              break;
            }
            coords.push(coord);
            if (i === word.length - 1) {
              found.push(coords);
            }
          }
        }
      }

      return found;
    };

    for (let i = 0; i < inputLines.length; i++) {
      for (let j = 0; j < inputLines[i].length; j++) {
        if (inputLines[i][j] === word[0]) {
          matches.push(...checkForMatches([i, j]));
        }
      }
    }

    return matches;
  };

  console.log(searchForWord("XMAS").length);

  const masMatches = searchForWord("MAS");
  const diagonals = masMatches.filter(
    (m) => m[0][0] - m[1][0] !== 0 && m[0][1] - m[1][1] !== 0
  );
  const middles = diagonals.map((d) => d[1]);
  const matchingMiddles = middles.reduce(
    (rv, curr) => ((rv[curr.join(",")] = (rv[curr.join(",")] ?? 0) + 1), rv),
    {} as Record<string, number>
  );

  console.log(Object.values(matchingMiddles).filter((x) => x === 2).length);
}
