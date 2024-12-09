import { sum } from "../utils/math";
import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const ranges = inputLines[0].split("").map((x) => +x);
  const blocks: (number | null)[] = [];
  const fileRanges: number[][] = [];
  const freeSpaceRanges: number[][] = [];
  for (let i = 0; i < ranges.length; i++) {
    if (i % 2 === 0) {
      fileRanges.push([blocks.length, ranges[i], i / 2]);
      blocks.push(...Array.from<number>({ length: ranges[i] }).fill(i / 2));
    } else {
      freeSpaceRanges.push([blocks.length, ranges[i]]);
      blocks.push(...Array.from<null>({ length: ranges[i] }).fill(null));
    }
  }

  const checksum = (data: (number | null)[]) =>
    sum(data.map((x, i) => (x ?? 0) * i));

  const part1 = [...blocks];
  let j = part1.length - 1;
  for (let i = 0; i < part1.length; i++) {
    if (part1[i] === null) {
      while (part1[j] === null) {
        j--;
      }
      if (j > i) {
        part1[i] = part1[j];
        part1[j] = null;
      } else {
        break;
      }
    }
  }

  console.log(checksum(part1));

  const part2 = [...blocks];
  for (let i = fileRanges.length - 1; i >= 0; i--) {
    const file = fileRanges[i];
    const freeSpace = freeSpaceRanges.find(
      (x) => x[1] >= file[1] && x[0] < file[0]
    );

    if (!freeSpace) {
      continue;
    }

    for (let j = 0; j < file[1]; j++) {
      part2[j + freeSpace[0]] = file[2];
      part2[j + file[0]] = null;
    }

    freeSpace[0] += file[1];
    freeSpace[1] -= file[1];
  }

  console.log(checksum(part2));
}
