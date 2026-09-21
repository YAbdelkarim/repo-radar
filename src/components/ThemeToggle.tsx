import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import { useColorScheme } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import SettingsBrightnessOutlined from "@mui/icons-material/SettingsBrightnessOutlined";

type Mode = "light" | "system" | "dark";

const MODES: { value: Mode; label: string; icon: ReactNode }[] = [
  { value: "light", label: "Light", icon: <LightModeOutlined fontSize="small" /> },
  { value: "system", label: "System", icon: <SettingsBrightnessOutlined fontSize="small" /> },
  { value: "dark", label: "Dark", icon: <DarkModeOutlined fontSize="small" /> },
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Cross-fades the whole page between schemes where the View Transitions API is available
function withTransition(update: () => void) {
  if (!("startViewTransition" in document) || prefersReducedMotion.matches) {
    update();
    return;
  }
  // flushSync so the new scheme class is on <html> before the browser snapshots the new view
  document.startViewTransition(() => flushSync(update));
}

// MUI persists the chosen mode in localStorage and applies it via the theme's class selector
export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null; // not resolved yet

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={mode}
      aria-label="Color theme"
      onChange={(_event, value: Mode | null) => {
        if (value) withTransition(() => setMode(value));
      }}
    >
      {MODES.map(({ value, label, icon }) => (
        <Tooltip key={value} title={`${label} theme`}>
          <ToggleButton value={value} aria-label={`${label} theme`}>
            {icon}
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}
