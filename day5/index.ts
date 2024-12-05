import { sum } from "../utils/math";
import type { Input } from "../utils/types";

const isValid = (orders: Record<number, number[]>) => (update: number[]) => {
  return update.every((x, i) =>
    (orders[x] ?? []).every(
      (y) => i < update.indexOf(y) || update.indexOf(y) === -1
    )
  );
};

const middleSums = (updates: number[][]) => {
  const middles = updates.map((u) => u[(u.length - 1) / 2]);
  return sum(middles);
};

export default async function run({ inputLines }: Input) {
  const orders: Record<number, number[]> = {};
  const updates: number[][] = [];

  let moreOrders = true;

  inputLines.forEach((l) => {
    if (l === "") {
      moreOrders = false;
      return;
    }
    if (moreOrders) {
      const [first, second] = l.split("|").map((x) => +x);
      if (!orders[first]) {
        orders[first] = [];
      }
      orders[first].push(second);
    } else {
      updates.push(l.split(",").map((x) => +x));
    }
  });

  const validUpdates = updates.filter(isValid(orders));

  console.log(middleSums(validUpdates));

  const invalidUpdates = updates.filter((u) => !validUpdates.includes(u));

  const fixed = [];
  let toFix: number[] | undefined;

  while ((toFix = invalidUpdates.pop())) {
    const problems = toFix
      .map((x, i) => ({
        lower: i,
        higher: (orders[x] ?? [])
          .map((y) => toFix?.indexOf(y) ?? -1)
          .filter((y) => y !== -1 && y < i),
      }))
      .filter((x) => x.higher.length > 0);

    const toMove = problems.reduce((rv, curr) => {
      curr.higher.forEach((x) => {
        rv[x] ??= [];
        rv[x].push(curr.lower);
      });
      return rv;
    }, {} as Record<number, number[]>);

    Object.entries(toMove)
      .reverse()
      .forEach(([from, to]) => {
        const [moving] = toFix?.splice(+from, 1) ?? [];
        toFix?.splice(to.at(-1) ?? 1, 0, moving);
      });

    if (isValid(orders)(toFix)) {
      fixed.push(toFix);
    } else {
      invalidUpdates.push(toFix);
    }
  }

  console.log(middleSums(fixed));
}
