import { isPointInArrays } from "../utils/array";
import type { Input } from "../utils/types";

type Coord = readonly [number, number];

export default async function run({ inputLines }: Input) {
  const map = inputLines.map((l) => l.split(""));
  const nodes = map.flatMap((l, i) =>
    l
      .map((x, j) => ({ node: x, coord: [i, j] as const }))
      .filter((x) => x.node !== ".")
  );
  const nodeMap = nodes.reduce<Record<string, Coord[]>>(
    (rv, curr) => (
      (rv[curr.node] = [...(rv[curr.node] ?? []), curr.coord]), rv
    ),
    {}
  );

  const antiNodes = map.map((l) => l.map(() => false));
  const isInMap = isPointInArrays(antiNodes);

  const antiNodeOf = (a: Coord, b: Coord, factor = 1) => [
    a[0] + (a[0] - b[0]) * factor,
    a[1] + (a[1] - b[1]) * factor,
  ];

  Object.values(nodeMap).forEach((coords) => {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const coord1 = coords[i];
        const coord2 = coords[j];
        const antiNode1 = antiNodeOf(coord1, coord2);
        const antiNode2 = antiNodeOf(coord2, coord1);

        if (isInMap(antiNode1)) {
          antiNodes[antiNode1[0]][antiNode1[1]] = true;
        }
        if (isInMap(antiNode2)) {
          antiNodes[antiNode2[0]][antiNode2[1]] = true;
        }
      }
    }
  });

  console.log(antiNodes.flatMap((l) => l.filter((x) => x)).length);

  const antiNodesWithResonance = map.map((l) => l.map(() => false));

  Object.values(nodeMap).forEach((coords) => {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const coord1 = coords[i];
        const coord2 = coords[j];

        let factor = 0;
        while (true) {
          const antiNode = antiNodeOf(coord1, coord2, factor);
          if (!isInMap(antiNode)) {
            break;
          }
          antiNodesWithResonance[antiNode[0]][antiNode[1]] = true;
          factor++;
        }

        factor = 0;
        while (true) {
          const antiNode = antiNodeOf(coord2, coord1, factor);
          if (!isInMap(antiNode)) {
            break;
          }
          antiNodesWithResonance[antiNode[0]][antiNode[1]] = true;
          factor++;
        }
      }
    }
  });

  console.log(antiNodesWithResonance.flatMap((l) => l.filter((x) => x)).length);
}
