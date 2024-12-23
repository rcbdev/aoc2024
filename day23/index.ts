import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const computers: Record<string, string[]> = {};

  inputLines.forEach((l) => {
    const [a, b] = l.split("-");
    computers[a] = [...(computers[a] ?? []), b];
    computers[b] = [...(computers[b] ?? []), a];
  });

  const triples = new Set<string>();
  const allConnections = new Set<string>();

  Object.entries(computers).forEach(([com, conn]) => {
    const connectedTo = [...conn];
    while (connectedTo.length > 1) {
      const next = connectedTo.pop()!;
      const shared = connectedTo.filter((c) => computers[next].includes(c));
      for (const third of shared) {
        const triple = [com, next, third].sort().join();
        triples.add(triple);
      }
      const allShare = shared.filter((x) =>
        shared.every((y) => x === y || computers[x].includes(y))
      );
      const all = [com, next, ...allShare].sort().join();
      allConnections.add(all);
    }
  });

  const withT = triples
    .values()
    .filter((v) => v.split(",").some((x) => x.startsWith("t")))
    .toArray();
  console.log(withT.length);

  console.log(
    allConnections
      .values()
      .toArray()
      .sort((a, b) => b.length - a.length)[0]
  );
}
