import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { trackEvent } from "@/utils/analytics";
import { API_BASE_URL } from "@/config";

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  hasItem: (id: string) => boolean;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load local cart on mount
  useEffect(() => {
    const localCart = localStorage.getItem("wellforged_cart");
    if (localCart) {
      try {
        const parsed = JSON.parse(localCart);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (e) {
        console.error("Failed to parse local cart:", e);
      }
    }
  }, []);

  // Persist to localStorage on change: always active in Ephemeral Model
  useEffect(() => {
    localStorage.setItem("wellforged_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === newItem.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = prev.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedItems = [...prev, { ...newItem, quantity }];
      }
      return updatedItems;
    });

    trackEvent("add_to_cart", {
      item_id: newItem.id,
      item_name: newItem.name,
      price: newItem.price,
      quantity
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("wellforged_cart");
  };

  const hasItem = (id: string) => items.some((item) => item.id === id);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        hasItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
