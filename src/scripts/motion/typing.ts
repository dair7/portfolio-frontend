import { gsap } from "gsap";

import { motionTiming } from "../../data/motion";
import type { MotionCleanup, MotionFeature } from "./types";

const cursorClasses =
  "pointer-events-none absolute top-0 left-0 w-0.5 bg-feature-accent";

function collectTextNodes(element: HTMLElement): Text[] {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) {
    if (walker.currentNode instanceof Text) nodes.push(walker.currentNode);
  }
  return nodes;
}

function wrapCharacters(node: Text): HTMLSpanElement[] {
  const characters: HTMLSpanElement[] = [];
  const fragment = document.createDocumentFragment();
  for (const character of node.data) {
    if (/\s/.test(character)) {
      fragment.append(character);
      continue;
    }
    const span = document.createElement("span");
    span.textContent = character;
    characters.push(span);
    fragment.append(span);
  }
  node.replaceWith(fragment);
  return characters;
}

function createCursor(element: HTMLElement): HTMLSpanElement {
  const cursor = document.createElement("span");
  cursor.className = cursorClasses;
  cursor.setAttribute("aria-hidden", "true");
  element.append(cursor);
  return cursor;
}

function typeOver(element: HTMLElement): MotionCleanup {
  const markup = element.innerHTML;
  const restore = (): void => {
    element.innerHTML = markup;
  };
  const characters = collectTextNodes(element).flatMap(wrapCharacters);
  if (characters.length === 0) return restore;
  const cursor = createCursor(element);
  const placeCursor = (character: HTMLSpanElement): void => {
    const box = character.getBoundingClientRect();
    const origin = element.getBoundingClientRect();
    gsap.set(cursor, {
      x: box.right - origin.left,
      y: box.top - origin.top,
      height: box.height,
    });
  };
  const { sweep, fade } = motionTiming.typing;
  const progress = { index: 0 };
  placeCursor(characters[0]);
  gsap
    .timeline({ onComplete: restore })
    .from(characters, {
      color: getComputedStyle(cursor).backgroundColor,
      duration: fade,
      ease: "none",
      immediateRender: false,
      stagger: { amount: sweep },
    })
    .to(
      progress,
      {
        index: characters.length - 1,
        duration: sweep,
        ease: "none",
        onUpdate: () => placeCursor(characters[Math.round(progress.index)]),
      },
      0,
    )
    .to(cursor, { opacity: 0, duration: fade });
  return restore;
}

export const typing: MotionFeature = (elements) => {
  const restorers = elements.map(typeOver);
  return () => restorers.forEach((restore) => restore());
};
