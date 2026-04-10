import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { DEFAULT_PRODUCT_IMAGE, imageErrorFallback } from "@/utils/images";

const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const total = subtotal;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetHeader className="border-b border-border pb-[var(--space-sm)]">
          <SheetTitle className="flex items-center gap-2 font-display uppercase tracking-widest" style={{ fontSize: "var(--text-lg)" }}>
            <ShoppingBag className="h-5 w-5" />
            Your Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>

        {totalItems === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-[var(--space-md)] py-[var(--space-2xl)] text-center">
            <ShoppingBag className="mb-[var(--space-md)] h-[var(--space-3xl)] w-[var(--space-3xl)] text-muted-foreground/30" />
            <p className="mb-[var(--space-xs)] font-display text-[var(--text-2xl)] font-bold text-foreground">Your cart is empty</p>
            <p className="mb-[var(--space-xl)] font-body text-[var(--text-base)] text-muted-foreground">Add a verified WellForged pack to begin your daily ritual.</p>
            <Link to="/product" className="w-full" onClick={() => setIsOpen(false)}>
              <Button variant="hero" size="lg" className="h-[var(--space-xl)] w-full gap-2 font-bold uppercase tracking-widest">
                Shop Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto py-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-[0_14px_28px_-24px_hsl(var(--primary)/0.35)]">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                    <img
                      src={DEFAULT_PRODUCT_IMAGE}
                      alt={item.name}
                      className="h-full w-full object-contain"
                      onError={imageErrorFallback}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-start justify-between">
                      <div>
                        <h4 className="font-display text-sm font-semibold leading-tight text-foreground">{item.name}</h4>
                        <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">{item.size}</span>
                        <p className="mt-1 font-body text-[11px] text-muted-foreground">Clean single-ingredient nutrition, batch verified.</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="-mr-2.5 p-2.5 text-muted-foreground transition-colors hover:text-foreground">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 items-center gap-1.5 rounded-lg bg-muted">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-full min-w-[44px] items-center justify-center rounded-l-lg px-3 transition-colors hover:bg-muted-foreground/10">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-6 text-center font-body text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-full min-w-[44px] items-center justify-center rounded-r-lg px-3 transition-colors hover:bg-muted-foreground/10">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-foreground">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        {item.originalPrice && (
                          <p className="font-body text-xs text-muted-foreground line-through">Rs {(item.originalPrice * item.quantity).toLocaleString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-border pb-[var(--space-md)] pt-4">
              <div className="rounded-2xl border border-border/70 bg-secondary/20 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-body text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Total</span>
                  <span className="font-display text-lg font-semibold text-foreground">Rs {total.toLocaleString()}</span>
                </div>
                <p className="mt-1 font-body text-[11px] text-muted-foreground">Taxes included. Shipping remains complimentary.</p>
              </div>

              <Link to="/checkout" onClick={() => setIsOpen(false)}>
                <Button variant="hero" size="lg" className="h-12 w-full gap-2 font-bold uppercase tracking-[0.14em] sm:h-[var(--space-xl)]">
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full pt-1 text-center font-body text-[var(--text-sm)] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
