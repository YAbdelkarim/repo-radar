import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

interface AutoHeightProps {
  children: ReactNode;
  sx?: SxProps<Theme>;
}

/** A container whose height animates to fit its content whenever the content resizes. */
export function AutoHeight({ children, sx }: AutoHeightProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = entry.borderBoxSize[0].blockSize;
      // 0 means an ancestor is hidden (inactive tab): keep the last height so it doesn't grow from 0
      if (next > 0) setHeight(next);
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={[
        (theme) => ({
          height,
          overflow: "hidden",
          transition: theme.transitions.create("height", {
            duration: theme.transitions.duration.complex,
            easing: theme.transitions.easing.easeInOut,
          }),
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box ref={innerRef}>{children}</Box>
    </Box>
  );
}
