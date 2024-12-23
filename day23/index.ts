import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const computers: Record<string, string[]> = {};

  inputLines.forEach((l) => {
    const [a, b] = l.split("-");
    computers[a] = [...(computers[a] ?? []), b];
    computers[b] = [...(computers[b] ?? []), a];
  });

  const triples = new Set<string>();
  let biggest: string[] = [];

  Object.entries(computers).forEach(([com, conn]) => {
    const connectedTo = [...conn];
    while (connectedTo.length > 1) {
      const next = connectedTo.pop()!;
      const shared = connectedTo.filter((c) => computers[next].includes(c));
      for (const third of shared) {
        const machines = [com, next, third];
        if (machines.some((m) => m.startsWith("t"))) {
          const triple = machines.sort().join();
          triples.add(triple);
        }
      }
      const allShare = shared.filter((x) =>
        shared.every((y) => x === y || computers[x].includes(y))
      );
      const all = [com, next, ...allShare];
      if (all.length > biggest.length) {
        biggest = all;
      }
    }
  });

  console.log(triples.values().toArray().length);
  console.log(biggest.sort().join());
}
