import React, { useEffect } from "react";
import { useForm ,Controller} from "react-hook-form";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { MenuItemInput, menuItemSchema } from "@/types/validadion";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/apiService/api";
import Swal from "sweetalert2";


type props = {
  isOpen:boolean,
  setIsopen:(open:boolean)=>void,
  editingItem: MenuItemInput | null
};


function AddAndEDitDialog({isOpen, setIsopen, editingItem}:props) {
const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<MenuItemInput>({
    resolver:zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      is_available: true,
      image: null,
    },
  });




useEffect(() => {
if (editingItem) {
    reset({
      name: editingItem.name,
      price: editingItem.price,
      description: editingItem.description || '',
      is_available: editingItem.is_available,
      image: editingItem.image || '',
    });
  } else {
    reset({
      name: '',
      price: 0,
      description: '',
      is_available: true,
      image:null,
    })
}
  }, [editingItem, reset]);







const onSubmit = async (data: MenuItemInput) => {
  try {
    const formData = new FormData();

    // ✅ Required fields
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("is_available", data.is_available ? "1" : "0");

    // ✅ Optional fields
    if (data.description) {
      formData.append("description", data.description);
    }
    // Append file if selected
    if (data.image && data.image.length > 0) {
      const file = data.image[0]; // Works whether FileList or array
      formData.append("image", file);
      // console.log("Appending file:",file, file.name, file.size);
    }

    // console.log("function trigered", formData);
    setServerError(null); // clear previous error
    // Add this right before your api.post call

    let response;
    console.log("this is the data", formData);
    if (editingItem) {
      response = await api.put(`/menus/${editingItem.id}`, formData);
    } else {
      response = await api.post("/menus", formData);
    }

    console.log("Menu item saved:", response.data);

    Swal.fire({
      title: editingItem ? "Menu Item Updated" : "Menu Item Added",
      text: editingItem
        ? "The menu item has been updated successfully."
        : "The menu item has been added successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    setIsopen(false); // close dialog
    reset(); // reset form fields
  } catch (error: any) {
    console.error("Error submitting form:", error);

    // Laravel backend validation errors (422)
    if (error.response?.status === 422) {
      const backendErrors = error.response.data.errors;
      Object.keys(backendErrors).forEach((field) => {
        setError(field as keyof MenuItemInput, {
          type: "server",
          message: backendErrors[field][0],
        });
      });
    } 
    
    
    else {
      // Other errors (network/server)
      const errMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setServerError(errMessage); // show at top of form

      
    }
  }
};



  return (
    <Dialog open={isOpen} onOpenChange={setIsopen}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Menu Item" : "Add New Item"}
          </DialogTitle>
          <DialogDescription>
            Fill in the details for the menu item.
          </DialogDescription>
        </DialogHeader>
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}
        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2"> */}
        <form
          className="space-y-4 py-2"
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("Validation Failed:", errors),
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input
                id="name"
                {...register("name", { required: true })}
                placeholder="e.g. Pizza"
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { required: true, valueAsNumber: true })}
                placeholder="5.00"
              />
              {errors.price && (
                <p className="text-sm text-destructive">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* <div className="space-y-2">
              <Label htmlFor="category">Category</Label> */}
            {/* <Controller */}
            {/* // control={control}
              // name="category"

              // {...register("category", { required: true })}
              // defaultValue="Main"
              // render={({ field }) => ( */}
            {/* //   <Select onValueChange={field.onChange} value={field.value}>
              //     <SelectTrigger>
              //       <SelectValue placeholder="Select category" />
              //     </SelectTrigger>
              //     <SelectContent>
              //       <SelectItem value="Main">Main Course</SelectItem>
              //       <SelectItem value="Sides">Sides</SelectItem>
              //       <SelectItem value="Drinks">Drinks</SelectItem>
              //       <SelectItem value="Dessert">Dessert</SelectItem>
              //       <SelectItem value="Snacks">Snacks</SelectItem>
              //     </SelectContent>
              //   </Select> */}
            {/* // )}
              // /> */}
            {/* </div> */}
            <div className="space-y-2 flex flex-col justify-end pb-2">
              <div className="flex items-center space-x-2">
                <Controller
                  name="is_available"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="available"
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                {errors.is_available && (
                  <p className="text-sm text-destructive">
                    {errors.is_available.message}
                  </p>
                )}
                <Label htmlFor="available">Available for Order</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Food Image</Label>
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value, ...field } }) => (
                <Input
                  {...field}
                  id="image"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                  // Force value to undefined because file inputs are read-only
                  value={undefined}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      // We pass the FileList to react-hook-form
                      onChange(files);
                    }
                  }}
                />
              )}
            />
            {errors.image && (
              <p className="text-sm text-destructive">
                {errors.image.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Ingredients, allergens, etc."
            />

            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="cursor-pointer disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? editingItem
                  ? "Updating..."
                  : "Creating..."
                : editingItem
                  ? "Update Item"
                  : "Create Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddAndEDitDialog;
