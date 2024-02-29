import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useUpdateProductMutation } from "../../app/api/apiSlice";
import { useDispatch } from "react-redux";
import { setProduct } from "../../features/products/productSlice";

function EditItemDialog({ isOpen, setIsOpen, setItems, itemId, items }) {
  const dispach = useDispatch();
  const [open, setOpen] = useState(isOpen);
  const [isDisabled, setIsDisabled] = useState(true);

  const [updateItem, updateItemResult] = useUpdateProductMutation();
  const [item, setItem] = useState(null);
  const [data, setData] = useState({
    productName: null,
    price: null,
    buyPrice: null,
    count: null,
  });
  const dispatch = useDispatch();
  const handleClose = () => {
    setData({
      productName: null,
      buyPrice: null,

      price: null,
      count: null,
    });
    setIsDisabled(true);
    setOpen(false);
    setIsOpen(false);
    // setData("");
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const arr = items.filter((element) => element._id === itemId);
    setItem(arr[0]);
  }, [isOpen]);

  useEffect(() => {
    if (updateItemResult.status === "rejected") {
      console.log("error while updating item");
    } else if (updateItemResult.status === "fulfilled") {
      console.log(updateItemResult.data);
      const filteredItems = items?.map((item) => {
        console.log("updateItem", updateItemResult.data);

        if (item._id !== updateItemResult.data._id) {
          return item;
        } else {
          return updateItemResult.data;
        }
      });
      dispatch(setProduct(filteredItems));
    }

    console.log("item have updated successfully");

    handleClose();
  }, [updateItemResult]);

  const handleSave = async () => {
    await updateItem({
      data,
      productId: item._id,
    });
  };

  const handleChange = (field) => (event) => {
    setData({
      ...data,
      [field]: event.target.value,
    });
    //   console.log(...data)
  };

  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title">Edit Item</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ marginTop: "5px" }}
          type="text"
          label="Item name"
          defaultValue={item?.productName}
          onChange={(e) => {
            if (e.currentTarget.value.length > 0) {
              setIsDisabled(false);

              handleChange("productName")(e);
            } else {
              e.target.value = "";
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="number"
          label="Sell price"
          defaultValue={item?.price}
          onChange={(e) => {
            if (e.currentTarget.value >= 0) {
              setIsDisabled(false);

              handleChange("price")(e);
            } else {
              e.target.value = 0;
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="number"
          label="Buy price"
          defaultValue={item?.buyPrice}
          onChange={(e) => {
            if (e.currentTarget.value >= 0) {
              setIsDisabled(false);

              handleChange("buyPrice")(e);
            } else {
              e.target.value = 0;
              setIsDisabled(true);
            }
          }}
        />
        <TextField
          sx={{ marginTop: "5px" }}
          type="number"
          label="Item count"
          defaultValue={item?.count}
          placeholder="count"
          onChange={(e) => {
            if (e.currentTarget.value >= 0) {
              console.log(e.currentTarget.value);
              setIsDisabled(false);

              handleChange("count")(e);
            } else {
              setIsDisabled(true);
              e.target.value = 0;
            }
          }}
        />
        {/* <img alt="image" src={item.picrure} /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={isDisabled}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditItemDialog;
