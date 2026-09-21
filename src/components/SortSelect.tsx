import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

interface SortSelectProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
  size?: "small" | "medium";
}

export function SortSelect<T extends string>({
  value,
  options,
  onChange,
  size = "medium",
}: SortSelectProps<T>) {
  return (
    <TextField
      select
      label="Sort by"
      size={size}
      value={value}
      onChange={(e) => {
        const selected = options.find((option) => option.value === e.target.value);
        if (selected) onChange(selected.value);
      }}
      sx={{ minWidth: 200 }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
