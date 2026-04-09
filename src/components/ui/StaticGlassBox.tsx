import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import {
  staticGlassPanelClass,
  staticGlassPanelPaddingClass,
  staticGlassPanelStyle,
} from "@/lib/staticGlass";

export type StaticGlassBoxProps = HTMLAttributes<HTMLDivElement> & {
  /** When true (default), applies comfortable padding for body copy. */
  padded?: boolean;
};

export default function StaticGlassBox({
  className,
  style,
  padded = true,
  children,
  ...props
}: StaticGlassBoxProps) {
  const mergedStyle: CSSProperties = {
    ...staticGlassPanelStyle,
    ...style,
  };

  return (
    <div
      className={cn(
        staticGlassPanelClass,
        padded && staticGlassPanelPaddingClass,
        className,
      )}
      style={mergedStyle}
      {...props}
    >
      {children}
    </div>
  );
}
