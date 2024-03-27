const pxBreakpoints = {
  phone: 480,
  tablet: 1024,
  laptop: 1600,
};

export const mediaQueryWithScreenSize = {
  smallAndSmaller: `@media (max-width: ${pxBreakpoints.phone}px)`,
  medium: `@media (min-width: ${pxBreakpoints.phone}px) and (max-width: ${pxBreakpoints.laptop}px)`,
  mediumAndSmaller: `@media (max-width: ${pxBreakpoints.tablet}px)`,
  mediumAndLarger: `@media (min-width: ${pxBreakpoints.phone}px)`,
  largeAndSmaller: `@media (max-width: ${pxBreakpoints.laptop}px)`,
  largeAndLarger: `@media (min-width: ${pxBreakpoints.laptop}px)`,
};
