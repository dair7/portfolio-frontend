import type { CSSProperties, ReactElement } from "react";

import { logoParts } from "../data/brand";
import { themeColors } from "../data/theme";
import { beanMarkup, beanViewBox } from "./bean";
import type { OgCardContent } from "../data/seo";

type CardChild = string | CardNode;
type CardNode = ReactElement<{
  style: CSSProperties;
  children?: CardChild | CardChild[];
  src?: string;
  width?: number;
  height?: number;
}>;

export const ogFontFamily = {
  display: "Space Grotesk",
  body: "Inter",
} as const;

const colors = themeColors.dark;

const headingSize = 88;
const summarySize = 34;
const logoSize = 40;
const beanHeightEm = 0.3;
const beanGapEm = 0.06;

function box(
  style: CSSProperties,
  children?: CardChild | CardChild[],
): CardNode {
  return { type: "div", key: null, props: { style, children } };
}

function bean(): CardNode {
  const height = logoSize * beanHeightEm;
  const width = (height * beanViewBox.width) / beanViewBox.height;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${beanViewBox.width} ${beanViewBox.height}">`,
    beanMarkup({ fill: colors.accent, crease: colors.bg }),
    "</svg>",
  ].join("");
  const gap = logoSize * beanGapEm;
  return {
    type: "img",
    key: null,
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`,
      width,
      height,
      style: { marginLeft: gap, marginRight: gap },
    },
  };
}

function logo(): CardNode {
  return box(
    {
      display: "flex",
      alignItems: "baseline",
      fontFamily: ogFontFamily.display,
      fontSize: logoSize,
      fontWeight: 700,
      color: colors.text,
    },
    [box({}, logoParts.name), bean(), box({}, logoParts.suffix)],
  );
}

function heading(text: string): CardNode {
  return box(
    {
      fontFamily: ogFontFamily.display,
      fontSize: headingSize,
      fontWeight: 700,
      lineHeight: 1,
      letterSpacing: headingSize * -0.045,
      color: colors.text,
    },
    text,
  );
}

function summary(text: string): CardNode {
  return box(
    {
      display: "block",
      maxWidth: 960,
      fontFamily: ogFontFamily.body,
      fontSize: summarySize,
      lineHeight: 1.4,
      color: colors.muted,
      lineClamp: 2,
    },
    text,
  );
}

export function createOgCard(content: OgCardContent): CardNode {
  return box(
    {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box",
      width: "100%",
      height: "100%",
      padding: 80,
      backgroundColor: colors.bg,
    },
    [
      logo(),
      box({ display: "flex", flexDirection: "column", gap: 28 }, [
        heading(content.heading),
        summary(content.summary),
      ]),
    ],
  );
}
