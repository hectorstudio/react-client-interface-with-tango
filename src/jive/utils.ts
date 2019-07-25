export function unique<T>(arr: T[]) {
  return arr.filter((x, i) => arr.indexOf(x) === i);
}

export function objectValues<T>(obj: { [key: string]: T }) {
  return obj ? Object.keys(obj).map(key => obj[key]) : [];
}
