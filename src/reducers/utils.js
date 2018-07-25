export function unique(list) {
  return list.filter((x, i) => list.indexOf(x) === i);
}
