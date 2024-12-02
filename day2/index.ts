import type { Input } from "../utils/types";

export default async function run({ inputLines }: Input) {
  const reports = inputLines.map((l) => l.split(" ").map((x) => +x));

  const isSafe = (r: number[]) => {
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
  };

  const reportStatuses = reports.map((r) => {
    if (isSafe(r)) {
      return {
        safe: true,
        safeWithDampener: true,
      };
    }

    const options = r.map((_, i) => r.filter((_1, i2) => i !== i2));

    return {
      safe: false,
      safeWithDampener: options.some(isSafe),
    };
  });

  console.log(reportStatuses.filter(({ safe }) => safe).length);
  console.log(
    reportStatuses.filter(({ safeWithDampener }) => safeWithDampener).length
  );
}
