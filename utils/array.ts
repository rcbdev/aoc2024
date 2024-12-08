export const isPointInArrays = <T>(arr: T[][]) => {
  const maxY = arr.length;
  const maxX = arr[0].length;
  return (point: number[] | [number, number] | readonly [number, number]) =>
    point[0] >= 0 && point[1] >= 0 && point[0] < maxY && point[1] < maxX;
};
