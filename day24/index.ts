import type { Input } from "../utils/types";

interface Gate {
  type: "AND" | "XOR" | "OR";
  inputs: string[];
  output: string;
  active: boolean;
}

export default async function run({ inputLines }: Input) {
  const wires: Record<string, number> = {};
  const gates: Gate[] = [];
  let largestZ = 0;
  let largestX = 0;
  let largestY = 0;

  let onWires = true;
  for (const line of inputLines) {
    if (line === "") {
      onWires = false;
      continue;
    }
    if (onWires) {
      const [wire, value] = line.split(": ");
      wires[wire] = value === "1" ? 1 : 0;
      if (wire.startsWith("x")) {
        const number = +wire.substring(1);
        if (number > largestX) {
          largestX = number;
        }
      }
      if (wire.startsWith("y")) {
        const number = +wire.substring(1);
        if (number > largestY) {
          largestY = number;
        }
      }
    } else {
      const [in1, type, in2, _, out] = line.split(" ");
      const gate: Gate = {
        type: type as Gate["type"],
        inputs: [in1, in2],
        output: out,
        active: false,
      };
      gates.push(gate);
      if (out.startsWith("z")) {
        const number = +out.substring(1);
        if (number > largestZ) {
          largestZ = number;
        }
      }
    }
  }

  const originalWires = Object.keys(wires);

  const wireVal = (wireKey: string) => wires[wireKey];
  const wireActive = (wireKey: string) => wireKey in wires;

  const toProcess = [...gates];
  while (toProcess.length > 0) {
    const gate = toProcess.shift()!;
    if (!wireActive(gate.inputs[0]) || !wireActive(gate.inputs[1])) {
      toProcess.push(gate);
      continue;
    }
    let outputValue = 0;
    switch (gate.type) {
      case "AND":
        outputValue = wireVal(gate.inputs[0]) & wireVal(gate.inputs[1]);
        break;
      case "OR":
        outputValue = wireVal(gate.inputs[0]) | wireVal(gate.inputs[1]);
        break;
      case "XOR":
        outputValue = wireVal(gate.inputs[0]) ^ wireVal(gate.inputs[1]);
        break;
    }
    wires[gate.output] = outputValue;
    gate.active = true;
  }

  let result = 0;
  for (let i = largestZ; i >= 0; i--) {
    result = result * 2 + wires[`z${i.toString().padStart(2, "0")}`];
  }
  console.log(result);

  let x = 0;
  for (let i = largestX; i >= 0; i--) {
    x = x * 2 + wires[`x${i.toString().padStart(2, "0")}`];
  }
  let y = 0;
  for (let i = largestY; i >= 0; i--) {
    y = y * 2 + wires[`y${i.toString().padStart(2, "0")}`];
  }
  const actualSum = (x + y).toString(2);
  const wrongSum = result.toString(2);
  const wrong: string[] = [];
  for (let i = 0; i < actualSum.length; i++) {
    if (actualSum[i] !== wrongSum[i]) {
      wrong.push(`z${i.toString().padStart(2, "0")}`);
    }
  }
  console.log(wrong);

  const graph: string[] = [];
  const shapes: string[] = [];
  for (const wire in wires) {
    const theGates = gates.filter((g) => g.inputs.includes(wire));
    for (const gate of theGates) {
      graph.push(`${wire} -> ${gate.type}${gate.output};`);
      graph.push(`${gate.type}${gate.output} -> ${gate.output};`);
    }
    if (wire.startsWith("z")) {
      shapes.push(`${wire} [shape=Msquare];`);
    }
  }
  Bun.write(
    Bun.file("./day24/output.txt"),
    graph.join("\n") + "\n\n" + shapes.join("\n")
  );
}
