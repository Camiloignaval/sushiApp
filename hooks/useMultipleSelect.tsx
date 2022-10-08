import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { FC } from "react";
import Typography from "@mui/material/Typography";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type valuesType = {
  name: string;
  value: string;
}[];

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

interface Props {
  label: string;
  values: valuesType;
}

export const useMultipleSelect = ({
  label = "Seleccione",
  values = [] as valuesType,
}) => {
  const theme = useTheme();
  const [valuesChoose, setvaluesChoose] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof valuesChoose>) => {
    const {
      target: { value },
    } = event;
    setvaluesChoose(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const SelectComponent: React.FunctionComponent = () => (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
      <Select
        size="small"
        labelId="selectToolBar"
        id="demo-multiple-chip"
        multiple
        value={valuesChoose}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label={label} />}
        renderValue={(selected) => (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              // maxHeight: 28,
            }}
          >
            {selected.map((value, i) =>
              i < 2 ? (
                <Chip
                  sx={{ borderColor: "#cccc00" }}
                  variant="outlined"
                  key={value}
                  label={values.find((v) => v.value === value)?.name ?? value}
                />
              ) : i === 2 ? (
                <Typography sx={{ ml: 1, display: "flex", alignItems: "end" }}>
                  {" "}
                  ...
                </Typography>
              ) : (
                ""
              )
            )}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {values.map((value) => (
          <MenuItem key={value.value} value={value.value}>
            {value.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return [SelectComponent, valuesChoose, setvaluesChoose] as const;
};
