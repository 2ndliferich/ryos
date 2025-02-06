import { PaintAppComponent } from "./components/PaintAppComponent";
import type { BaseApp } from "../base/types";

export const helpItems = [
  {
    icon: "✏️",
    title: "Drawing Tools",
    description:
      "Use the toolbar on the left to select different drawing tools like pencil, brush, shapes, and more.",
  },
  {
    icon: "🎨",
    title: "Colors",
    description:
      "Select colors from the palette below the tools to change your drawing color.",
  },
  {
    icon: "↩️",
    title: "Undo",
    description: "Press ⌘Z or use Edit > Undo to undo your last action.",
  },
  {
    icon: "💾",
    title: "Saving",
    description:
      "Use File > Save to save your artwork, or File > Save As to save it with a new name.",
  },
];

export const appMetadata = {
  name: "MacPaint",
  version: "1.0.0",
  creator: {
    name: "System 7",
    url: "https://github.com/yourusername/paint",
  },
  github: "https://github.com/yourusername/paint",
  icon: "/icons/paint.png",
};

export const PaintApp: BaseApp = {
  id: "paint",
  name: "MacPaint",
  icon: { type: "image", src: "/icons/paint.png" },
  description: "Classic MacPaint-style drawing application",
  component: PaintAppComponent,
  helpItems,
  metadata: appMetadata,
};
