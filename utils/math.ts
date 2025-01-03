type ArrOrIterator<T> = T[] | IteratorObject<T>;

export const sum = (arr: ArrOrIterator<number>) =>
  arr.reduce((rv, curr) => rv + curr, 0);
export const product = (arr: ArrOrIterator<number>) =>
  arr.reduce((rv, curr) => rv * curr, 1);
