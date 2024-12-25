import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const locks: number[][] = [];
  const keys: number[][] = [];

  for (let i = 0; i < inputLines.length; i += 8) {
    const lockOrKey = Array.from<number>({ length: inputLines[i].length }).fill(
      -1
    );
    for (let j = 0; j < 7; j++) {
      for (let k = 0; k < inputLines[i + j].length; k++) {
        if (inputLines[i + j][k] === "#") {
          lockOrKey[k]++;
        }
      }
    }
    if (inputLines[i].split("").every((x) => x === "#")) {
      locks.push(lockOrKey);
    } else {
      keys.push(lockOrKey);
    }
  }

  let pairs = 0;
  for (const lock of locks) {
    for (const key of keys) {
      if (lock.every((pin, i) => pin + key[i] < 6)) {
        pairs++;
      }
    }
  }
  console.log(pairs);
}
