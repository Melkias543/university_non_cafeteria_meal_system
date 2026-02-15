
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MenuItemInput } from "@/types/validadion";
import api from "@/apiService/api";
import { set } from "react-hook-form";
import { useCart } from "@/feature/Context/CartContext";
const imageUrl = import.meta.env.VITE_IMAGE_API_URL;

export default function StudentMenu() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menus, setMenus] = useState<MenuItemInput[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 10,
    loading: false,
  });

  useEffect(() => {
    getMenus();
  }, []);

  const getMenus = async (page = 1) => {
    setPagination((prev) => ({ ...prev, loading: true }));
    try {
      const res = await api.get("/student-menu");
      console.log("all menus", res.data);
      setMenus(res.data.data.data);

      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        total: res.data.total,
        per_page: res.data.per_page,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error during fetching ", error);
      setPagination((prev) => ({ ...prev, loading: false }));
    }
  };

const {state, dispatch}= useCart()
// console.log('state from menu', state)

  // Dummy menu data

  // Filter menu based on search
  const filteredMenu = menus?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const orderNow = (item: any) => {
    // console.log("go to dispatch",item)
   dispatch({
    type: "ADD_TO_CART",
    payload: {
      id: item.id,
      name: item.name,
      price: item.price,
    },
  });


}

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Today's Menu
        </h1>
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col h-full hover:shadow-lg transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden rounded-t-lg bg-gray-100">
                <img
                  src={`${imageUrl}/storage/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* {!item.is_available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase rounded">
                      Sold Out
                    </span>
                  </div>
                )} */}
              </div>
              <CardHeader className="p-4 pt-3 flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <span className="font-bold text-lg text-primary">
                  ${item.price}
                </span>
              </CardHeader>
              <CardContent className="flex-1 p-4">
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  className="w-full gap-2 hover:cursor-pointer"
                  onClick={() => orderNow(item)}
                  disabled={!item.is_available}
                >
                  <Plus className="h-4 w-4" />
                  {item.is_available ? "Order Now" : "Unavailable"}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No menu items found.
          </p>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <button
          disabled={pagination.current_page <= 1 || pagination.loading}
          onClick={() => getMenus(pagination.current_page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
        >
          Prev
        </button>

        <span className="px-3 py-1">
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        <button
          disabled={
            pagination.current_page >= pagination.last_page ||
            pagination.loading
          }
          onClick={() => getMenus(pagination.current_page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
