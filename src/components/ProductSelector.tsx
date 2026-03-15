import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ShoppingBag, Truck, Shield, FlaskConical, AlertCircle, Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";
import productImage from "@/assets/Packaging_Updated.png";

interface SKU {
  id: string;
  size: string;
  price: number;
  originalPrice?: number;
  label?: string;
  stock?: number;
}

const ProductSelector = ({ product }: { product: any }) => {
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedSku(product.variants[0]);
    }
    setQuantity(1);
  }, [product]);

  const { addItem, totalItems, setIsOpen } = useCart();
  const { isLoggedIn, setPendingCartAction, setRedirectUrl } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!selectedSku) return;

    if (selectedSku.stock !== undefined && selectedSku.stock <= 0) {
      toast.error("This size is currently out of stock");
      return;
    }

    await addItem({
      id: selectedSku.id.toString(),
      name: product.name,
      size: selectedSku.label.replace(/\s+(Pouch|Jar)$/i, ''),
      price: selectedSku.price,
      originalPrice: selectedSku.original_price,
      image: product.images?.[0]?.image_url || productImage
    }, 1);

    toast.success(`Added ${selectedSku.label.replace(/\s+(Pouch|Jar)$/i, '')} to cart`);
  };

  if (!product || !selectedSku) return null;

  return (
    <div className="space-y-[var(--space-sm)]">
      <div className="space-y-[var(--space-xs)]">
        <label className="font-body text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest">Select Size</label>
        <div className="grid grid-cols-2 gap-2">
          {product.variants.map((sku: any) => (
            <button
              key={sku.id}
              onClick={() => setSelectedSku(sku)}
              className={`relative p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-200 text-left h-full flex flex-col justify-between ${selectedSku.id === sku.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/50"
                } ${sku.stock === 0 ? "opacity-60 grayscale-[0.5]" : ""}`}
            >
              <div className="font-display font-semibold text-foreground text-sm flex items-center justify-between">{sku.label.replace(/\s+(Pouch|Jar)$/i, '')}</div>
              <div className="mt-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-bold text-primary text-base">₹{sku.price}</span>
                  {sku.original_price && <span className="font-body text-muted-foreground line-through text-[10px]">₹{sku.original_price}</span>}
                </div>

                {/* Stock Status */}
                <div className="mt-0.5">
                  {sku.stock === 0 ? (
                    <span className="text-[9px] font-bold text-destructive uppercase tracking-wider">Out of Stock</span>
                  ) : sku.stock < 20 ? (
                    <span className="text-[9px] font-bold text-gold uppercase tracking-wider">Only {sku.stock} left</span>
                  ) : (
                    <span className="text-[9px] font-medium text-primary uppercase tracking-wider">In Stock</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Add to Cart */}
      <div className="space-y-[var(--space-xs)] pt-1">
        <Button
          variant="hero"
          size="default"
          className="w-full h-11 sm:h-12 gap-2 font-bold uppercase tracking-widest text-primary-foreground text-xs sm:text-sm"
          onClick={handleAddToCart}
          disabled={selectedSku.stock === 0}
        >
          {selectedSku.stock === 0 ? (
            "Out of Stock"
          ) : (
            <><ShoppingCart className="h-4 w-4" /> Add to Cart</>
          )}
        </Button>
        {totalItems > 0 && (
          <Button variant="outline" size="default" className="w-full h-11 gap-2 text-xs font-bold uppercase tracking-widest hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all duration-300 shadow-sm" onClick={() => setIsOpen(true)}>
            <ShoppingBag className="h-4 w-4" /> Go to Cart ({totalItems})
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
