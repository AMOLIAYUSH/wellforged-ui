import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Truck, Shield, CheckCircle, MapPin, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE_URL } from "@/config";
import type { CouponValidationResult } from "@/types/store";

const getSuggestedCoupon = (subtotal: number) => {
  if (subtotal >= 1500) return { code: "SAVE100", discount: 100, minSubtotal: 1500 };
  if (subtotal >= 890) return { code: "SAVE50", discount: 50, minSubtotal: 890 };
  if (subtotal >= 549) return { code: "SAVE30", discount: 30, minSubtotal: 549 };
  if (subtotal >= 349) return { code: "SAVE20", discount: 20, minSubtotal: 349 };
  return null;
};

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponHelper, setCouponHelper] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal - discount;
  const suggestedCoupon = getSuggestedCoupon(subtotal);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponHelper("Please enter a valid coupon code.");
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponHelper("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        setCouponHelper(data.message || "This code is invalid or no longer active.");
        toast.error(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        setCouponHelper("Best available savings applied to this order.");
        toast.success(data.message);
      }
    } catch (error) {
      setCouponHelper("We could not validate the code right now. Please try again.");
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponHelper("");
    toast.info("Coupon removed");
  };

  const handleContinue = () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.pincode || !formData.city || !formData.state) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        coupon_id: appliedCoupon?.coupon_id || null,
        idempotency_key: idempotencyKey,
        guest_details: {
          full_name: formData.fullName,
          email: formData.email,
          mobile_number: formData.phone,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        items: items.map((item) => ({ sku_id: item.id, quantity: item.quantity })),
      };

      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.message || "Failed to create order");

      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Checkout | WellForged</title>
      </Helmet>
      <Navbar />
      <main className="page-pt min-h-screen bg-background pb-[var(--space-xl)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="mb-4 font-body text-lg text-muted-foreground">Your cart is empty</p>
              <Button variant="hero" onClick={() => navigate("/product")}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
              <div className="space-y-6 lg:col-span-3">
                {step === 1 && (
                  <div className="premium-panel p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="eyebrow-label">Step 1</p>
                          <h2 className="font-display text-foreground" style={{ fontSize: "var(--text-lg)" }}>
                            Shipping Details
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                          Full Name *
                        </label>
                        <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                          Email Address *
                        </label>
                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="yourname@domain.com" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                          Phone Number *
                        </label>
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                          Address *
                        </label>
                        <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="House/Flat No., Street, Locality" className="h-[var(--space-xl)]" />
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                            Pincode *
                          </label>
                          <Input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit pincode" className="h-[var(--space-xl)]" />
                        </div>
                        <div>
                          <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                            City *
                          </label>
                          <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city name" className="h-[var(--space-xl)]" />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block font-body text-[var(--text-xs)] font-semibold uppercase tracking-[0.14em] text-foreground/80">
                          State *
                        </label>
                        <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state name" className="h-[var(--space-xl)]" />
                      </div>
                    </div>

                    <Button variant="hero" size="xl" className="mt-6 h-[var(--space-xl)] w-full font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em]" onClick={handleContinue}>
                      Continue to Summary
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <>
                    <div className="premium-panel p-4 sm:p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="eyebrow-label">Review</p>
                          <h2 className="font-display text-foreground" style={{ fontSize: "var(--text-lg)" }}>
                            Shipping Summary
                          </h2>
                        </div>
                        <button onClick={() => setStep(1)} className="ml-auto text-xs text-primary hover:underline">
                          Edit Details
                        </button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-body text-foreground">
                          <span className="font-semibold">{formData.fullName}</span>
                        </p>
                        <p className="font-body text-muted-foreground">{formData.address}</p>
                        <p className="font-body text-muted-foreground">
                          {formData.city}, {formData.state} - {formData.pincode}
                        </p>
                        <div className="space-y-1">
                          <p className="break-words font-body text-muted-foreground">Phone: {formData.phone}</p>
                          <p className="break-words font-body text-muted-foreground">Email: {formData.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="premium-panel p-4 sm:p-6">
                      <div className="mb-4 flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div>
                          <p className="eyebrow-label">Final Step</p>
                          <h2 className="font-display text-foreground" style={{ fontSize: "var(--text-lg)" }}>
                            Order Confirmation
                          </h2>
                        </div>
                      </div>
                      <p className="text-balance font-body text-sm leading-relaxed text-muted-foreground">
                        By clicking "Place Order", you agree to our Terms of Service. Your order will be processed immediately and you will receive a confirmation message shortly.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="lg:col-span-2">
                <div className="sticky top-20 border border-border bg-card p-4 sm:rounded-2xl sm:p-6 rounded-xl">
                  <p className="eyebrow-label mb-1">Your Order</p>
                  <h2 className="mb-4 font-display font-semibold text-foreground" style={{ fontSize: "var(--text-lg)" }}>
                    Order Summary
                  </h2>

                  <div className="mb-4 space-y-3 border-b border-border pb-4">
                    {items.map((item) => (
                      <div key={item.id} className="group flex items-center gap-4">
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted p-2 transition-colors group-hover:border-primary/30">
                          <img
                            src={item.image || "/Packaging_Updated.png"}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/Packaging_Updated.png";
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-1 font-body text-sm font-semibold leading-tight text-foreground">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground">
                              Qty: {item.quantity}
                            </span>
                            {item.size && (
                              <span className="rounded-md bg-primary/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                                {item.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 text-right">
                          <p className="font-display text-sm font-bold text-foreground">Rs {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-4 border-b border-border pb-4">
                    {!appliedCoupon ? (
                      <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="eyebrow-label">Offers & Savings</p>
                            <p className="mt-1 font-body text-sm text-muted-foreground">
                              Apply a valid code to unlock your best checkout price.
                            </p>
                          </div>
                          {suggestedCoupon && (
                            <span className="premium-pill px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary">
                              Best Match
                            </span>
                          )}
                        </div>

                        <div className="mb-2 flex flex-wrap gap-2">
                          {suggestedCoupon ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setCouponCode(suggestedCoupon.code)}
                                className="rounded-full border border-gold/25 bg-background px-3 py-1.5 font-body text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary transition-colors hover:border-primary/30 hover:bg-primary/5"
                              >
                                Use {suggestedCoupon.code}
                              </button>
                              <span className="rounded-full border border-border/70 bg-background px-3 py-1.5 font-body text-[0.68rem] text-muted-foreground">
                                Save Rs {suggestedCoupon.discount} on this cart
                              </span>
                            </>
                          ) : (
                            <span className="rounded-full border border-border/70 bg-background px-3 py-1.5 font-body text-[0.68rem] text-muted-foreground">
                              Add more items to unlock savings
                            </span>
                          )}
                        </div>

                        {suggestedCoupon && (
                          <p className="mb-2 font-body text-xs text-muted-foreground">
                            Eligible suggestion based on your subtotal of Rs {subtotal.toLocaleString()}.
                          </p>
                        )}

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="h-10 w-full bg-background text-base md:text-sm"
                            disabled={isValidatingCoupon}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode.trim()}
                            className="h-10 w-full gap-1.5 px-4 sm:w-auto"
                          >
                            <Tag className="h-3.5 w-3.5" />
                            {isValidatingCoupon ? "Checking..." : "Apply"}
                          </Button>
                        </div>

                        {couponHelper && (
                          <p className={`mt-2 font-body text-xs ${appliedCoupon ? "text-primary" : "text-muted-foreground"}`}>
                            {couponHelper}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 rounded-full bg-background p-2 text-primary">
                              <Tag className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-body text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary">Offer Applied</p>
                              <p className="mt-1 font-body text-sm font-medium text-foreground">{appliedCoupon.code}</p>
                              <p className="font-body text-xs text-primary">You saved Rs {appliedCoupon.discount_amount.toLocaleString()} on this order.</p>
                              <p className="mt-1 font-body text-xs text-muted-foreground">Best price applied.</p>
                            </div>
                          </div>
                          <button onClick={handleRemoveCoupon} className="text-muted-foreground transition-colors hover:text-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-6 space-y-3 rounded-xl bg-muted/30 p-4">
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="font-medium text-muted-foreground">Subtotal</span>
                      <span className="font-bold text-foreground">Rs {subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center justify-between font-body text-sm">
                        <span className="font-medium text-muted-foreground">Discount ({appliedCoupon.code})</span>
                        <span className="font-bold text-primary">-Rs {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between font-body text-sm">
                      <span className="font-medium text-muted-foreground">Delivery</span>
                      <span className="font-bold text-primary">FREE</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between border-t border-border pt-3 font-display text-lg font-bold">
                      <span className="uppercase tracking-wider text-foreground">Total</span>
                      <span className="text-foreground">Rs {total.toLocaleString()}</span>
                    </div>
                  </div>

                  {step === 2 && (
                    <Button variant="hero" size="xl" className="mb-4 h-12 w-full sm:h-14" onClick={handlePlaceOrder} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : `Place Order - Rs ${total.toLocaleString()}`}
                    </Button>
                  )}

                  <div className="mt-4 flex flex-wrap justify-center gap-3 border-t border-border pt-3">
                    <div className="mb-2 w-full rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-display text-xs font-bold text-foreground">Money-Back Transparency Guarantee</span>
                      </div>
                      <p className="text-balance font-body text-[10px] leading-snug text-muted-foreground">
                        If your specific batch lab report is not available or shows any impurity, we will refund your entire order immediately.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="font-body text-xs">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-body text-xs">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
