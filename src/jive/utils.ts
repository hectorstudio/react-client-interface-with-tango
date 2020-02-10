export function unique<T>(arr: T[]) {
  return arr.filter((x, i) => arr.indexOf(x) === i);
}

<<<<<<< HEAD
export function objectValues<T>(obj: { [key: string]: T }) {
=======
export function objectValues<T>(obj: {[key: string]: T}) {
>>>>>>> origin/master
  return obj ? Object.keys(obj).map(key => obj[key]) : [];
}
