import { arrayOf, shape, string, number } from "prop-types";

export const command = arrayOf(
  shape({
    displevel: string,
    inttype: string,
    intypedesc: string,
    name: string,
    outtype: string,
    outtypedesc: string,
    tag: number
  })
);
