import { TextField } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";

interface Props {
  num: number;
  id: string;
}

export const InputImportanceTable: FC<Props> = ({ num, id }) => {
  const [value, setValue] = useState<number>(num);

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    if (value !== num) {
      console.log("hare el cambio");
    }
  };
  return (
    <TextField
      type={"number"}
      sx={{ width: 65 }}
      value={value}
      onBlur={(e) => handleUpdate(e as ChangeEvent<HTMLInputElement>)}
      onChange={(e) => setValue(+e.target.value!)}
      variant="standard"
    />
  );
};
