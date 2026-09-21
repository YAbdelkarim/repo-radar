import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { SORT_OPTIONS, type SortOption } from "./constants";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <TextField
      select
      label="Sort by"
      value={value}
      onChange={(e) => {
        const selected = SORT_OPTIONS.find((option) => option.value === e.target.value);
        if (selected) onChange(selected.value);
      }}
      sx={{ minWidth: 200 }}
    >
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
