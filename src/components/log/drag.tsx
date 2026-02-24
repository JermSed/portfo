"use client";

import { useLayoutEffect, useRef, useState } from "react";
import useMaxZIndex from "@/hooks/useMaxZIndex";
import { cn, getRandomRotation } from "@/lib/utils";
import { motion, type PanInfo, useAnimation } from "framer-motion";
import React from "react";

const Drag = React.memo(
  ({
    children,
    className,
    initialX,
    initialY,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
    initialX?: number;
    initialY?: number;
  }) => {
    const hasPresetPosition =
      typeof initialX === "number" && typeof initialY === "number";
    const [zIndex, updateZIndex] = useMaxZIndex();
    const controls = useAnimation();
    const [initialRotate, setInitialRotate] = useState(0);
    const [position, setPosition] = useState<{
      x: number;
      y: number;
      rotate: number;
    } | null>(hasPresetPosition ? { x: initialX, y: initialY, rotate: 0 } : null);
    const elementRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      // Avoid SSR hydration mismatch by generating random placement only on client.
      let x = typeof initialX === "number" ? initialX : 0;
      let y = typeof initialY === "number" ? initialY : 0;
      const rotate =
        hasPresetPosition ? 0 : getRandomRotation();

      if (!hasPresetPosition) {
        const gridEl = document.getElementById("mat-grid");
        const dragEl = elementRef.current;
        const parentEl = dragEl?.offsetParent as HTMLElement | null;
        const inset = 24;

        if (gridEl && dragEl && parentEl) {
          const gridRect = gridEl.getBoundingClientRect();
          const parentRect = parentEl.getBoundingClientRect();
          const dragRect = dragEl.getBoundingClientRect();

          const minX = gridRect.left - parentRect.left + inset;
          const minY = gridRect.top - parentRect.top + inset;
          const maxX = gridRect.right - parentRect.left - dragRect.width - inset;
          const maxY = gridRect.bottom - parentRect.top - dragRect.height - inset;

          x = maxX > minX ? Math.random() * (maxX - minX) + minX : minX;
          y = maxY > minY ? Math.random() * (maxY - minY) + minY : minY;
        }
      }

      setInitialRotate(rotate);
      controls.set({ rotate });
      setPosition({ x, y, rotate });

      // keep existing behavior for pre-positioned notes
      if (hasPresetPosition) {
        return;
      }
      // Compute initial placement once per mount so re-renders don't re-position items.
      // biome-ignore lint/correctness/useExhaustiveDependencies: initial placement should not rerun on re-render
    }, []);

    const handleDragEnd = (event: MouseEvent, info: PanInfo) => {
      const direction = info.offset.x > 0 ? 1 : -1;
      const velocity = Math.min(Math.abs(info.velocity.x), 1);
      controls.start({
        rotate: Math.floor(initialRotate + velocity * 40 * direction),
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 30,
          mass: 1,
          restDelta: 0.001,
        },
      });
    };

    return (
      <motion.div
        ref={elementRef}
        drag
        dragElastic={0.2}
        className={cn(
          "select-none w-fit h-fit drag-elements absolute",
          className
        )}
        dragTransition={{ power: 0.2, timeConstant: 200 }}
        onMouseDown={updateZIndex}
        onTouchStart={updateZIndex}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={controls}
        style={{
          zIndex,
          left: position?.x ?? 0,
          top: position?.y ?? 0,
          visibility: position ? "visible" : "hidden",
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

export default Drag;
