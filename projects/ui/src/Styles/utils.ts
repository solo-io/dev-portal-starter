import { css } from "@emotion/react";

// HEX isn't made more specific as after a point it becomes "to complex" for the IDE to handle
type HEX = `#${string}`;
export type Color = HEX;
export type ColorOrAllowed =
  | Color
  | "currentColor"
  | "transparent"
  | "white"
  | "black";

/**
 * An SVG color replace function that works on both stroke and fill automatically.
 *
 * WARNING: This does not work properly on colors applied via inline <defs><style>.
 * - Since there is no attribute to detect, this can't overwrite it. This isn't an issue when the style is fill:none (since we don't want to overwrite that anyways)
 * - One solution is to move the styles out of a class and onto the element directly (or on a <g> surrounding the elements)
 * - Otherwise the following classes may be applied on an element to force the issue: `skip-fill-replace`, `fill-replace`, `skip-stroke-replace`, `stroke-replace`
 * @param color The color to replace with
 */
export function svgColorReplace(color?: ColorOrAllowed) {
  if (color === undefined) return;
  return css`
    svg {
      // By default all svg elements have a fill color that inherits from svg's fill (black if undefined); change this default to our color
      fill: ${color};

      // If a fill is defined (but not set to none as a way to hide it), then replace that color
      *[fill]:not([fill="none"], [fill="transparent"], .skip-fill-replace),
      .fill-replace {
        fill: ${color};
      }

      // replace stroke if it exists - since stroke is none by default there shouldn't be a reason to check it, but do so for safety
      *[stroke]:not(
          [stroke="none"],
          [stroke="transparent"],
          .skip-stroke-replace
        ),
      .stroke-replace {
        stroke: ${color};
      }
    }
  `;
}
