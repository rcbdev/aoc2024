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

  let onWires = true;
  for (const line of inputLines) {
    if (line === "") {
      onWires = false;
      continue;
    }
    if (onWires) {
      const [wire, value] = line.split(": ");
      wires[wire] = value === "1" ? 1 : 0;
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
}
