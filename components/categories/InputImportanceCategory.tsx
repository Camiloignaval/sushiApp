import { RemoveCircleOutlineOutlined } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { ChangeEvent, FC, useState } from "react";
import {
  useDeleteImportanceNumberMutation,
  useUpdateCategoryByPropertyMutation,
} from "../../store/RTKQuery/categoriesApi";

interface Props {
  num: number;
  id: string;
}

export const InputImportanceCategory: FC<Props> = ({ num, id }) => {
  const [value, setValue] = useState<any>(num ? num * -1 : num);
  const [updateImportance, updateImportanceStatus] =
    useUpdateCategoryByPropertyMutation();
  const [deleteImportance, deleteImportanceStatus] =
    useDeleteImportanceNumberMutation();

  const handleUpdate = (e: ChangeEvent<HTMLInputElement>) => {
    if (value !== num && ![null, undefined, ""].includes(value)) {
      updateImportance({
        id,
        category: "importanceNumber",
        value: Number(value! * -1),
      });
    }
  };
  const handleDeleteImportance = async () => {
    try {
      await deleteImportance({ id }).unwrap();
      setValue("");
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <>
      <TextField
        disabled={updateImportanceStatus.isLoading}
        type={"number"}
        sx={{ width: 65, paddingTop: 1 }}
        value={value}
        onBlur={(e) => handleUpdate(e as ChangeEvent<HTMLInputElement>)}
        onChange={(e) => setValue(+e.target.value!)}
        variant="standard"
      />
      {num && (
        <IconButton
          disabled={deleteImportanceStatus.isLoading}
          onClick={handleDeleteImportance}
        >
          <RemoveCircleOutlineOutlined color="error" />
        </IconButton>
      )}
    </>
  );
};
