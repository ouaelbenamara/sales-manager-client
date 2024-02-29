import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  
} from "@mui/material";
import { useAddProductMutation } from "../../app/api/apiSlice";
import { useDispatch,  } from "react-redux";
import { setProduct } from "../../features/products/productSlice";

function AddItemDialog({ isOpen, setIsOpen, setItems }) {
  const [open, setOpen] = useState(isOpen);
  const [isDisabled, setIsDisabled] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const dispatch = useDispatch()
  const [addItem, addItemResult] = useAddProductMutation();
  const [data, setData] = useState({
    productName: undefined,
    productPicture: undefined,
    price: undefined,
    count: undefined,
  });

  const handleClose = () => {
    setData({
      productName: undefined,
      productPicture: undefined,
      price: undefined,
      buyPrice: undefined,
      count: undefined,
    });
    setOpen(false);
    setIsOpen(false);
    
  };

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (addItemResult.status === "rejected") {
      console.log("error while adding item");
    } else if (addItemResult.status === "fulfilled") {
      setItems((prev) =>{ 
        dispatch(setProduct([...prev, addItemResult.data]));
        return[...prev, addItemResult.data]});



        //creating a sale for this product whith 0 sell count

      handleClose()
      console.log("item have been added successfully");
    }
  }, [addItemResult,]);



  const handleSave = async () => {
    await addItem({
      ...data,
    });
    console.log(data);
    
  };
  useEffect(() => {
    console.log(data);
  }, [data]);
  const handleChange = (field) => (event) => {
    setData({
      ...data,
      [field]: event.target.value,
    });
   

  };


  useEffect(()=>{
 if (data.count && data.price && data.productPicture && data.productName&& data.buyPrice) {
   setIsDisabled(false);
 } else {
   setIsDisabled(true);
 }
  },[data])
  const handlePictureChange = (image) => {
    setData({
      ...data,
      productPicture: image,
    });
    console.log(data);
  };

  useEffect(() => {
    handlePictureChange(selectedImage);
    console.log(selectedImage);
  }, [selectedImage]);
  return (
    <Dialog
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      open={open}
      onClose={handleClose}
    >
      <DialogTitle id="dialog-title">Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          label="Item picture"
          type="file"
          onChange={(e) => {

            console.log(e.target.files[0]);
            setSelectedImage(e.target.files[0]);

          }}
        />
        <TextField
          type="text"
          label="Item name"
          onChange={(e) => {

            handleChange("productName")(e);
            console.log(selectedImage);
          }}
        />
        <TextField
          type="number"
          label="Sell Price"
          onChange={(e) => {

            handleChange("price")(e);
          }}
        />
        <TextField
          type="number"
          label="Buy Price"
          onChange={(e) => {

            handleChange("buyPrice")(e);
          }}
        />
        <TextField
          type="number"
          label="Item count"
          placeholder="count"
          onChange={(e) => {

            handleChange("count")(e);
            console.log(selectedImage);
          }}
        />

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

export default AddItemDialog;
