import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const reports = inputLines.map((l) => l.split(" ").map((x) => +x));

  const safe = reports.filter((r) => {
    let dir = 0;
    for (let i = 1; i < r.length; i++) {
      const diff = r[i] - r[i - 1];
      if (dir === 0) {
        dir = diff;
      } else if (diff * dir <= 0) {
        return false;
      }
      if (diff === 0 || Math.abs(diff) > 3) {
        return false;
      }
    }
    return true;
  });

  console.log(safe.length);

  const safeWithDampener = reports.filter((r) => {
    if (safe.includes(r)) {
      return true;
    }
    const options = r.map((_, i) => r.filter((_1, i2) => i !== i2));
    const safeOptions = options.filter((x) => {
      let dir = 0;
      for (let i = 1; i < x.length; i++) {
        const diff = x[i] - x[i - 1];
        if (dir === 0) {
          dir = diff;
        } else if (diff * dir <= 0) {
          return false;
        }
        if (diff === 0 || Math.abs(diff) > 3) {
          return false;
        }
      }
      return true;
    });

    return safeOptions.length > 0;
  });

  console.log(safeWithDampener.length);
}
