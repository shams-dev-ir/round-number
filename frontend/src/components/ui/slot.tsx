import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal `asChild` implementation: merges our props onto the single child
 * element instead of rendering an extra wrapper. Enough for the two cases we
 * need (Button wrapping Link, Badge wrapping Link) without pulling in Radix.
 */
export function Slot({
  children,
  className,
  ...props
}: { children?: ReactNode; className?: string } & Record<string, unknown>) {
  const child = Children.only(children);
  if (!isValidElement<{ className?: string }>(child)) return null;

  return cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className),
  } as never);
}
