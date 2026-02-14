import React, {createContext,useContext, useReducer,ReactNode,useEffect} from "react";

/* ================= TYPES ================= */

type CartItem = {
  id: string; // Changed to string for UUID compatibility
  name: string;
  price: number;
  quantity: number;
 // Added image for UI consistency

 
};

type CartState = {
  cart: CartItem[];
  totalAmount: number;
  totalItems: number;
};

type Action = { type: "ADD_TO_CART"; payload: Omit<CartItem, "quantity"> }
  | { type: "INCREASE"; payload: string }
  | { type: "DECREASE"; payload: string }
  | { type: "REMOVE"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

/* ================= REDUCER ================= */

// Helper to calculate totals (Keep it DRY)
const calculateTotals = (cart: CartItem[]) => {
  return cart.reduce(
    (acc, item) => {
      acc.totalAmount += item.price * item.quantity;
      acc.totalItems += item.quantity;
      return acc;
    },
    { totalAmount: 0, totalItems: 0 },
  );
};

function cartReducer(state: CartState, action: Action): CartState {
  let newCart: CartItem[];

  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.cart.find((i) => i.id === action.payload.id);
      newCart = existing
        ? state.cart.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...state.cart, { ...action.payload, quantity: 1 }];
      break;

    case "INCREASE":
      newCart = state.cart.map((i) =>
        i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i,
      );
      break;

    case "DECREASE":
      newCart = state.cart
        .map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
      break;

    case "REMOVE":
      newCart = state.cart.filter((i) => i.id !== action.payload);
      break;

    case "CLEAR_CART":
      newCart = [];
      break;

    case "LOAD_CART":
      newCart = action.payload;
      break;

    default:
      return state;
  }

  return {
    cart: newCart,
    ...calculateTotals(newCart),
  };
}

/* ================= CONTEXT & PROVIDER ================= */

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: [],
    totalAmount: 0,
    totalItems: 0,
  });

  // Persistence: Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("meal_cart");
    if (savedCart) {
      dispatch({ type: "LOAD_CART", payload: JSON.parse(savedCart) });
    }
  }, []);

  // Persistence: Save cart to LocalStorage on change
  useEffect(() => {
    localStorage.setItem("meal_cart", JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
