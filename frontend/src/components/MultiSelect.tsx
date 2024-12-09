import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import { DropDownOptionListType } from "../types/Catalog";

interface MultiSelectProps {
  label: string;
  options: DropDownOptionListType[];
  selectedOptions: DropDownOptionListType[];
  onChange: (options: DropDownOptionListType[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
}) => {
  const handleSelectChange = (
    event: SelectChangeEvent<(string | number)[]>
  ) => {
    const selectedValues = event.target.value as (string | number)[];
    const selectedOptions = options.filter((option) =>
      selectedValues.includes(option.value)
    );
    onChange(selectedOptions);
  };

  return (
    <FormControl variant="standard" sx={{ width:'30%'}}>
      <InputLabel>{label}</InputLabel>
      <Select

        multiple
        value={selectedOptions.map((option) => option.value)}
        onChange={handleSelectChange}
        renderValue={(selected) =>
          selected
            .map((value) => {
              const option = options.find((opt) => opt.value === value);
              return option ? option.label : "";
            })
            .join(", ")
        }
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox
              checked={selectedOptions.some(
                (opt) => opt.value === option.value
              )}
            />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
