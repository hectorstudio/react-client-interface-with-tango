import convert from "color-convert";
import { RGB } from "color-convert/conversions";

/**
 * Converts a CSS color string to an RGB format acceptable by color-convert
 * Accepts all valid css color formats that doesn't include an alpha channel e.g.:
 * * white
 * * #fff
 * * #ffffff
 * * rgb(255,255,255)
 * returns a color-convert RGB: [R:number, G:number, B:number]
 */
export const CSStoRGB = (cssColor: string): RGB => {
  let div = document.createElement("div");
  div.style.color = cssColor;
  const divColor = getComputedStyle(div).color;
  if (divColor) {
    const match = divColor.match(
      /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
    );
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    } else {
      //we might have gotten a css keyword back from getComputed style (e.g. "white")
      try {
        const tmp: any = divColor;
        return convert.keyword.rgb(tmp);
      } catch (error) {
        throw new Error("Color " + cssColor + " could not be parsed.");
      }
    }
  }
  throw new Error("Color " + cssColor + " could not be parsed.");
};

/**
 * Given a RGB returns a css string, always on the format '#rrggbb'
 * @param rgb
 */
export const RGBtoCSS = (rgb: RGB): string => {
  return (
    "#" +
    colorChannelToHex(rgb[0]) +
    colorChannelToHex(rgb[1]) +
    colorChannelToHex(rgb[2])
  );
};
function colorChannelToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}
export const CSStoHSL = (cssColor: string) => {
  const rgb = CSStoRGB(cssColor);
  return convert.rgb.hsl(rgb);
};

/**
 * Increases the brightness of a cssColor with brighnessDelta. Brightness is capped at the interval [0, 100] where 0 is black and 100 is white
 * A negative brightnessDelta can be provided to make it darker
 * Returns the new cssColor on the format #rrggbb
 */
export const brighten = (cssColor: string, brightnessDelta: number): string => {
  const hsl = CSStoHSL(cssColor);
  hsl[2] = Math.max(0, Math.min(hsl[2] + brightnessDelta, 100));
  return RGBtoCSS(convert.hsl.rgb(hsl));
};

/**
 * Increases the saturation of a cssColor with saturationDelta. Saturation  is capped at the interval [0, 100], where 0 always is grayscale
 * A negative saturationDelta can be provided to make it more desaturated
 * Returns the new cssColor on the format #rrggbb
 */
export const saturate = (cssColor: string, saturationDelta: number): string => {
  const hsl = CSStoHSL(cssColor);
  hsl[1] = Math.max(0, Math.min(hsl[1] + saturationDelta, 100));
  return RGBtoCSS(convert.hsl.rgb(hsl));
};

/**
 * Shifts the hue of a cssColor with hueDelta. hue  is returned modulo 360, going from red->orange->yellow->green->blue->indigo->violet
 * A negative hueDelta can be provided to shift backwards
 * Returns the new cssColor on the format #rrggbb
 */
export const shiftHue = (cssColor: string, hueDelta: number): string => {
  const hsl = CSStoHSL(cssColor);
  hsl[0] = hsl[0] + (hueDelta % 360);
  return RGBtoCSS(convert.hsl.rgb(hsl));
};

/**
 * Returns the inverse of cssColor on the format #rrggbb
 */
export const invert = (cssColor: string): string => {
  const rgb = CSStoRGB(cssColor);
  rgb[0] = 255 - rgb[0];
  rgb[1] = 255 - rgb[1];
  rgb[2] = 255 - rgb[2];
  return RGBtoCSS(rgb);
};
