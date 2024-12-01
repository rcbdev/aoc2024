export default async function run({ inputLines }) {
  const left = [];
  const right = [];

  for (let i = 0; i < inputLines.length; i++) {
    const line = inputLines[i].split(/\s+/);
    left.push(line[0]);
    right.push(line[1]);
  }

  left.sort();
  right.sort();

  const diffs = left.map((l, i) => Math.abs(l - right[i]));

  console.log(diffs.reduce((rv, curr) => rv + curr));

  const rightCounts = right.reduce(
    (rv, curr) => ((rv[curr] = (rv[curr] ?? 0) + 1), rv),
    {}
  );
  const similarities = left.map((l) => l * (rightCounts[l] ?? 0));

  console.log(similarities.reduce((rv, curr) => rv + curr));
}
