import type { Input } from "../utils/types";

type Register = number[];
type Instruction = (
  register: Register,
  operand: number,
  output: number[]
) => Register | number | null;

export default async function run({ inputLines }: Input) {
  const comboOperand = (register: Register, operand: number) => {
    switch (operand) {
      case 4:
        return register[0];
      case 5:
        return register[1];
      case 6:
        return register[2];
      case 7:
        throw new Error("splat");
      default:
        return operand;
    }
  };

  const adv: Instruction = (register, operand) => {
    const numerator = register[0];
    const denominator = Math.pow(2, comboOperand(register, operand));
    return [Math.floor(numerator / denominator), register[1], register[2]];
  };
  const bxl: Instruction = (register, operand) => {
    const result = register[1] ^ operand;
    return [register[0], result, register[2]];
  };
  const bst: Instruction = (register, operand) => {
    const result = comboOperand(register, operand) % 8;
    return [register[0], result, register[2]];
  };
  const jnz: Instruction = (register, operand) => {
    if (register[0] === 0) {
      return null;
    }
    return operand;
  };
  const bxc: Instruction = (register) => {
    const result = register[1] ^ register[2];
    return [register[0], result, register[1]];
  };
  const out: Instruction = (register, operand, output) => {
    let mod8 = comboOperand(register, operand) % 8;
    if (mod8 < 0) {
      mod8 = 8 + mod8;
    }
    output.push(mod8);
    return null;
  };
  const bdv: Instruction = (register, operand) => {
    const numerator = register[0];
    const denominator = Math.pow(2, comboOperand(register, operand));
    return [register[0], Math.floor(numerator / denominator), register[2]];
  };
  const cdv: Instruction = (register, operand) => {
    const numerator = register[0];
    const denominator = Math.pow(2, comboOperand(register, operand));
    return [register[0], register[1], Math.floor(numerator / denominator)];
  };

  const instructions: Instruction[] = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

  const register: Register = [];
  let program: number[] = [];
  inputLines.forEach((l) => {
    if (l.startsWith("Register")) {
      register.push(+l.split(": ")[1]);
    } else if (l.startsWith("Program")) {
      program = l
        .split(": ")[1]
        .split(",")
        .map((x) => +x);
    }
  });

  const runProgram = (register: Register, loop = true) => {
    let pointer = 0;
    let currentRegister = register;
    const output: number[] = [];
    while (pointer < program.length) {
      const result = instructions[program[pointer]](
        currentRegister,
        program[pointer + 1],
        output
      );
      if (Array.isArray(result)) {
        currentRegister = result;
        pointer += 2;
      } else if (result === null) {
        pointer += 2;
      } else {
        if (loop) {
          pointer = result;
        } else {
          break;
        }
      }
    }

    return output;
  };

  console.log(runProgram(register)?.join(","));

  let numbers = [0];
  for (let i = 0; i < program.length; i++) {
    const next: number[] = [];
    for (let j = 0; j < 8; j++) {
      for (const number of numbers) {
        const check = number * 8 + j;
        const result = runProgram([check, 0, 0], false);
        const programSlice = program.slice(program.length - i - 1);

        if (result[0] !== programSlice[0]) {
          continue;
        }
        next.push(check);
      }
    }
    if (next.length === 0) {
      throw new Error("broke");
    }
    numbers = next;
  }
  console.log(numbers[0]);
}
