export const beanViewBox = { width: 14, height: 20 } as const;

const body = { centerX: 7, centerY: 10, radiusX: 5.6, radiusY: 8.4, tilt: -14 };
const crease = { path: "M7 2.6 C 4.9 7, 9.1 13, 7 17.4", width: 1.5 };

export interface BeanColors {
  fill: string;
  crease: string;
}

export const beanShape = {
  rotation: `rotate(${body.tilt} ${body.centerX} ${body.centerY})`,
  body: {
    cx: body.centerX,
    cy: body.centerY,
    rx: body.radiusX,
    ry: body.radiusY,
  },
  crease: crease.path,
  creaseWidth: crease.width,
} as const;

export function beanMarkup({ fill, crease: creaseColor }: BeanColors): string {
  const { cx, cy, rx, ry } = beanShape.body;
  return [
    `<g transform="${beanShape.rotation}">`,
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"/>`,
    `<path d="${beanShape.crease}" fill="none" stroke="${creaseColor}" stroke-width="${beanShape.creaseWidth}" stroke-linecap="round"/>`,
    `</g>`,
  ].join("");
}
