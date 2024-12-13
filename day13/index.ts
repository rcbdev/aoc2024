import { sum } from "../utils/math";
import type { Input } from "../utils/types";

interface Machine {
  a: [number, number];
  b: [number, number];
  prize: [number, number];
}

export default async function run({ inputLines }: Input) {
  const machines = [];

  for (let i = 0; i < inputLines.length; i += 4) {
    const machine: Machine = {
      a: [0, 0],
      b: [0, 0],
      prize: [0, 0],
    };

    const a = inputLines[i].split(": ")[1].split(", ");
    machine.a = [+a[0].replace("X+", ""), +a[1].replace("Y+", "")];
    const b = inputLines[i + 1].split(": ")[1].split(", ");
    machine.b = [+b[0].replace("X+", ""), +b[1].replace("Y+", "")];
    const prize = inputLines[i + 2].split(": ")[1].split(", ");
    machine.prize = [+prize[0].replace("X=", ""), +prize[1].replace("Y=", "")];
    machines.push(machine);
  }

  const findTokens =
    (max = 100) =>
    (m: Machine) => {
      const b = +(
        (m.prize[0] - (m.a[0] * m.prize[1]) / m.a[1]) /
        (m.b[0] - (m.a[0] * m.b[1]) / m.a[1])
      ).toPrecision(14); // stupid floats

      if (!Number.isInteger(b)) {
        return 0;
      }
      const a = (m.prize[1] - b * m.b[1]) / m.a[1];

      if (!Number.isInteger(a)) {
        return 0;
      }

      if (max !== -1 && (a > max || b > max)) {
        return 0;
      }

      return a * 3 + b;
    };

  const tokens = machines.map(findTokens());

  console.log(sum(tokens));

  const machines2 = machines.map<Machine>((m) => ({
    ...m,
    prize: [m.prize[0] + 10000000000000, m.prize[1] + 10000000000000],
  }));

  const tokens2 = machines2.map(findTokens(-1));

  console.log(sum(tokens2));
}
