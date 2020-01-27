import Color from "color"
export const STATE_COLORS = {
    ON: "green",
    OFF: "white",
    CLOSE: "white",
    OPEN: "green",
    INSERT: "white",
    EXTRACT: "green",
    MOVING: "lightblue",
    STANDBY: "yellow",
    FAULT: "red",
    INIT : "beige",
    RUNNING: "darkgreen",
    ALARM: "orange",
    DISABLE: "magenta",
    UNKONWN: "grey",
}

/**
 * Lightness is capped at the interval [0, 1] where 0 is black and 1 is white
 * Returns true if the given color is more dark than light
 */
export const isDark = (cssColor:string): boolean => {
  const color = Color(cssColor)
  return color.lightness() < 0.5
}

/**
 * Increases the brightness of a cssColor with brighnessDelta. Brightness is capped at the interval [0, 100] where 0 is black and 100 is white
 * A negative brightnessDelta can be provided to make it darker
 * Returns the new string color on the format #RRGGBB
 */

export const brighten = (cssColor: string, lightnessDelta: number): string => {
    const color = Color(cssColor);
    return color.lightness(color.lightness() + lightnessDelta).hex();
  };
  
  /**
   * Increases the saturation of a cssColor with saturationDelta. Saturation is capped at the interval [0, 100], where 0 always is grayscale
   * A negative saturationDelta can be provided to desaturated a color
   * Returns the new string color on the format #RRGGBB
   */
  export const saturate = (cssColor: string, saturationDelta: number): string => {
    const color = Color(cssColor);
    return color.saturationl(color.saturationl() + saturationDelta).hex();
  };

  /**
   * Rotates the hue. The hue is a values between 0 and 360, but any number can be provided, since it's calculated modulo 360. 
   * Returns the new string color on the format #RRGGBB
   */
  export const rotate = (cssColor: string, degrees: number): string => {
    return Color(cssColor).rotate(degrees).hex();
  };

  /**
   * Change the opacity of a color with opacityDelta. Opacity is a value in the interval [0, 100], where 0 is completely transparent.
   * Note that you need to provide a negative value to make it more transparent
   */
  export const opague = (cssColor: string, opacityDelta: number): string => {
    const color = Color(cssColor);
    return color.alpha(color.alpha() + opacityDelta ).rgb().string();
  };
  