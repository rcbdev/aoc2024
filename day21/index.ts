import { sum } from "../utils/math";
import type { Input } from "../utils/types";

type PairsCounts = Record<string, number>;

export default async function run({ inputLines }: Input) {
  const targets = inputLines;
  const keypad = [
    ["7", "8", "9"],
    ["4", "5", "6"],
    ["1", "2", "3"],
    [" ", "0", "A"],
  ];
  const movepad = [
    [" ", "^", "A"],
    ["<", "v", ">"],
  ];

  const cache = new Map<string, string[]>();
  let cacheHits = 0;

  const makeString = (char: string, length: number) =>
    Array.from({
      length: Math.abs(length),
    })
      .fill(char)
      .join("");

  const findMoves = (pair: string, pad = keypad) => {
    if (cache.has(pair)) {
      cacheHits++;
      return cache.get(pair)!;
    }
    const banned = pad === keypad ? [3, 0] : [0, 0];
    const fromRow = pad.findIndex((x) => x.includes(pair[0]));
    const fromColumn = pad[fromRow].indexOf(pair[0]);
    const toRow = pad.findIndex((x) => x.includes(pair[1]));
    const toColumn = pad[toRow].indexOf(pair[1]);
    const verticalCount = toRow - fromRow;
    const horizontalCount = toColumn - fromColumn;
    const verticalSymbol = verticalCount < 0 ? "^" : "v";
    const horizontalSymbol = horizontalCount < 0 ? "<" : ">";
    const verticalMoves = makeString(verticalSymbol, verticalCount);
    const horizontalMoves = makeString(horizontalSymbol, horizontalCount);
    const options: string[] = [];
    if (horizontalCount === 0) {
      options.push(verticalMoves + "A");
    } else if (verticalCount === 0) {
      options.push(horizontalMoves + "A");
    } else {
      if (toRow !== banned[0] || fromColumn !== banned[1]) {
        options.push(verticalMoves + horizontalMoves + "A");
      }
      if (toColumn !== banned[1] || fromRow !== banned[0]) {
        options.push(horizontalMoves + verticalMoves + "A");
      }
    }
    cache.set(pair, options);
    return options;
  };

  const codeToPair = (code: string) => {
    return code.split("").reduce<PairsCounts>((rv, curr, i, arr) => {
      const p = (i === 0 ? "A" : arr[i - 1]) + curr;
      rv[p] = (rv[p] ?? 0) + 1;
      return rv;
    }, {});
  };
  const cache2 = Array.from({ length: 26 }).map(
    () => new Map<string, PairsCounts>()
  );
  const findBest2 = (pair: string, count: number, bots: number, bot = 0) => {
    if (bot === bots) {
      return { [pair]: count };
    }
    if (!cache2[bot].has(pair)) {
      const options = findMoves(pair, bot === 0 ? keypad : movepad);
      let shortestForMove: Record<string, number> = {};
      let shortestLength = Infinity;
      for (const option of options) {
        const thisPairs = codeToPair(option);
        const best: Record<string, number> = {};
        for (const [p, c] of Object.entries(thisPairs)) {
          const next = findBest2(p, c, bots, bot + 1);
          Object.entries(next).forEach(([p, c]) => {
            best[p] = (best[p] ?? 0) + c;
          });
        }
        const length = sum(Object.values(best));
        if (length < shortestLength) {
          shortestForMove = best;
          shortestLength = length;
        }
      }
      cache2[bot].set(pair, shortestForMove);
    }
    const data = cache2[bot].get(pair)!;
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v * count])
    );
  };

  const findBest = (target: string, bots: number) => {
    const thisPairs = codeToPair(target);
    const best: Record<string, number> = {};
    for (const [p, c] of Object.entries(thisPairs)) {
      Object.entries(findBest2(p, c, bots)).forEach(([p, c]) => {
        best[p] = (best[p] ?? 0) + c;
      });
    }
    return best;
  };

  const solveForBots = (bots: number) => {
    cache2.forEach((c) => c.clear());
    return sum(
      targets.map((code) => {
        const endMoves = findBest(code, bots);
        return +code.replace("A", "") * sum(Object.values(endMoves));
      })
    );
  };

  console.log(solveForBots(3));
  console.log(solveForBots(26));
}
