import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const towels = inputLines[0].split(", ");
  const desired = inputLines.slice(2);
  const cache = new Map<string, number>();

  const checkPattern = (pattern: string) => {
    if (cache.has(pattern)) {
      return cache.get(pattern)!;
    }
    if (pattern.length === 0) {
      return 1;
    }
    const matching = towels.filter((t) => pattern.startsWith(t));
    const result = sum(
      matching.map((m) => checkPattern(pattern.replace(m, "")))
    );
    cache.set(pattern, result);
    return result;
  };

  let possiblePatterns = 0;
  let possible = 0;
  for (const pattern of desired) {
    const count = checkPattern(pattern);
    possible += count;
    possiblePatterns += count > 0 ? 1 : 0;
  }

  console.log(possiblePatterns);
  console.log(possible);
}
