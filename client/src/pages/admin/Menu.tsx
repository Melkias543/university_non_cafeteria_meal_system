import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { useForm, Controller, set } from "react-hook-form";
import AddAndEDitDialog from "./AddAndEDitDialog";
import { MenuItemInput } from "@/types/validadion";
import api from "@/apiService/api";
import Swal from "sweetalert2";

export default function AdminMenu() {
  // const { menu, addMenuItem, updateMenuItem, deleteMenuItem } = useData();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemInput | null>(null)
  const [isOpen, setIsopen] = useState(false);
const [menus, setMenus] = useState<MenuItemInput|[]>([]);
const imageUrl = import.meta.env.VITE_IMAGE_API_URL;

const [pagination, setPagination] = useState({
  currentPage: 1,
  lastPage: 1,
  perPage: 15,
  total: 0,
});

useEffect(()=>{

  fethAllchMenu();
},[])

console.log(imageUrl)
const fethAllchMenu =async()=>{
  try {
    const response = await api.get("/menus");

    // console.log(response.data.data)
    setMenus(response.data.data.data);
    setPagination({
      currentPage: response.data.current_page,
      lastPage: response.data.last_page,
      perPage: response.data.per_page,
      total: response.data.total,
    });
  } catch (error:any) {
    
console.log("error in fetch menu", error)
console.log("error in fetch menu", error.response.data);

  }
} 


// console.log("menus at render", menus, Array.isArray(menus));






const handleChecked = async (id:String) => {
  const itemToUpdate = menus.find((i) => i.id === id);
  console.log("first", itemToUpdate.is_available);
  const newValue = !itemToUpdate.is_available;
console.log("newValue", newValue);
  await api.put(`/availability/${id}`, { is_available: newValue });

  setMenus((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, is_available: newValue } : item,
    ),
  );
};


const deleteMenuItem = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This menu item will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    console.log("delete req fired", id);

const res=    await api.delete(`/menus/${id}`);
console.log("from api",res.data.message)


    Swal.fire({
      title: "Deleted!",
      text: res?.data?.message,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);

    Swal.fire({
      title: "Error!",
      text: "Failed to delete menu item.",
      icon: "error",
    });
  }
};


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">
            Menu Management
          </h1>
          <p className="text-muted-foreground">
            Add, edit, or remove items from the daily menu
          </p>
        </div>
        <Button
          onClick={() => setIsopen(true)}
          className="bg-primary cursor-pointer hover:bg-blue-800"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus?.map((item) => (
          <Card key={item.id} className="overflow-hidden group relative">
            <div className="absolute top-2 right-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                className="cursor-pointer"
                size="icon"
                variant="secondary"
                onClick={() => (setEditingItem(item), setIsopen(true))}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                className="cursor-pointer"
                size="icon"
                variant="destructive"
                onClick={() => deleteMenuItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="h-40 bg-gray-100 relative">
              {/* src={`${imageUrl}/${item.image}`} */}
              <img
                src={`${imageUrl}/storage/${item.image}`}
                alt={item.name}
                className={`w-full h-full object-cover ${
                  !item.is_available ? "grayscale opacity-50" : ""
                }`}
              />
              {!item.is_available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-black/70 text-white px-2 py-1 text-sm font-bold uppercase rounded">
                    Unavailable
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg leading-tight">
                    {item.name}
                  </h3>
                  <span className="text-xs flex-row text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    <input
                      type="checkbox"
                      checked={item.is_available} // controlled input
                      onChange={() => handleChecked(item.id)} // call handler with item ID
                      className="mr-1"
                    />
                    <span>
                      {item.is_available ? "Available" : "Unavailable"}
                    </span>
                  </span>
                </div>
                <span className="font-bold text-primary">${item.price}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddAndEDitDialog
        isOpen={isOpen}
        setIsopen={setIsopen}
        editingItem={editingItem || null}
      />

      {/* Add/Edit Modal */}
      {/* <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Menu Item' : 'Add New Item'}</DialogTitle>
                <DialogDescription>Fill in the details for the menu item.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" {...register("name", { required: true })} placeholder="e.g. Pizza" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" step="0.01" {...register("price", { required: true })} placeholder="5.00" />
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Controller
                            control={control}
                            name="category"
                            defaultValue="Main"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Main">Main Course</SelectItem>
                                        <SelectItem value="Sides">Sides</SelectItem>
                                        <SelectItem value="Drinks">Drinks</SelectItem>
                                        <SelectItem value="Dessert">Dessert</SelectItem>
                                        <SelectItem value="Snacks">Snacks</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2 flex flex-col justify-end pb-2">
                        <div className="flex items-center space-x-2">
                            <Controller
                                control={control}
                                name="is_available"
                                defaultValue={true}
                                render={({ field }) => (
                                    <Switch 
                                        checked={field.value} 
                                        onCheckedChange={field.onChange} 
                                        id="available"
                                    />
                                )}
                            />
                            <Label htmlFor="available">Available for Order</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                             <Input id="image" {...register("image")} placeholder="https://..." />
                        </div>
                         <Button type="button" variant="outline" size="icon" onClick={() => {
                             // This would trigger an image generator or picker in a real app
                             // For now just does nothing, relying on text input
                         }}>
                            <ImageIcon className="h-4 w-4" />
                         </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} placeholder="Ingredients, allergens, etc." />
                </div>

                <DialogFooter>
                    <Button type="submit">{editingItem ? 'Update Item' : 'Create Item'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
