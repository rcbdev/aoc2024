import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const equations = inputLines.map((l) => {
    const [result, rest] = l.split(": ");
    const parts = rest.split(" ").map((x) => +x);

    return {
      result: +result,
      parts,
    };
  });

  const isSolvable =
    (includeConcat = false) =>
    ({ result, parts }: { result: number; parts: number[] }) => {
      let totals = [parts[0]];

      for (let i = 1; i < parts.length; i++) {
        totals = totals
          .flatMap((t) => [
            t + parts[i],
            t * parts[i],
            includeConcat ? +`${t}${parts[i]}` : null,
          ])
          .filter((x): x is number => x !== null && x <= result);
      }

      return totals.includes(result);
    };

  const solvable = equations.filter(isSolvable());

  console.log(sum(solvable.map(({ result }) => result)));

  const solvableWithConcat = equations.filter(isSolvable(true));

  console.log(sum(solvableWithConcat.map(({ result }) => result)));
}
