import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { CreditCard, Smartphone, Building2, Truck, Shield, CheckCircle, MapPin, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE_URL, APP_CONFIG } from "@/config";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Calculate amounts
  const discount = appliedCoupon?.discount_amount || 0;
  const total = subtotal - discount;

  // Step management (1 = Details, 2 = Summary & Place Order)
  const [step, setStep] = useState(1);

  // Form data - completely empty/neutral
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: ""
  });

  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal })
      });

      const data = await response.json();

      if (!response.ok || !data.valid) {
        toast.error(data.message || "Invalid coupon code");
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
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
      // Ephemeral Guest Flow: Always send guest_details and items directly
      const payload: any = {
        coupon_id: appliedCoupon?.coupon_id || null,
        idempotency_key: idempotencyKey,
        guest_details: {
          full_name: formData.fullName,
          email: formData.email,
          mobile_number: formData.phone,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: items.map(item => ({ sku_id: item.id, quantity: item.quantity }))
      };

      // Create Order in Backend
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(orderData.message || "Failed to create order");

      // DIRECT SUCCESS: Skip payment gateways as per request
      toast.success("Order placed successfully!");
      clearCart();
      navigate("/order-success");

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | WellForged</title></Helmet>
      <Navbar />
      <main className="min-h-screen bg-background page-pt pb-[var(--space-xl)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <Button variant="hero" onClick={() => navigate("/product")}>Continue Shopping</Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
              <div className="lg:col-span-3 space-y-6">
                {/* Step 1: Shipping Details */}
                {step === 1 && (
                  <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-foreground uppercase tracking-wider" style={{ fontSize: "var(--text-base)" }}>Shipping Details</h2>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">Full Name *</label>
                        <Input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">Email Address *</label>
                        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="yourname@domain.com" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">Phone Number *</label>
                        <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="10-digit mobile number" className="h-[var(--space-xl)]" />
                      </div>
                      <div>
                        <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">Address *</label>
                        <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="House/Flat No., Street, Locality" className="h-[var(--space-xl)]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">Pincode *</label>
                          <Input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit pincode" className="h-[var(--space-xl)]" />
                        </div>
                        <div>
                          <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">City *</label>
                          <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="Enter city name" className="h-[var(--space-xl)]" />
                        </div>
                      </div>
                      <div>
                        <label className="font-body text-[var(--text-xs)] font-bold uppercase tracking-widest text-foreground mb-1.5 block">State *</label>
                        <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="Enter state name" className="h-[var(--space-xl)]" />
                      </div>
                    </div>

                    <Button variant="hero" size="xl" className="w-full h-[var(--space-xl)] mt-6 font-bold uppercase tracking-widest" onClick={handleContinue}>
                      Continue to Summary
                    </Button>
                  </div>
                )}

                {/* Step 2: Confirmation Summary */}
                {step === 2 && (
                  <>
                    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-foreground" style={{ fontSize: "var(--text-lg)" }}>Shipping Summary</h2>
                        <button onClick={() => setStep(1)} className="ml-auto text-xs text-primary hover:underline">Edit Details</button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="font-body text-foreground"><span className="font-semibold">{formData.fullName}</span></p>
                        <p className="font-body text-muted-foreground">{formData.address}</p>
                        <p className="font-body text-muted-foreground">{formData.city}, {formData.state} - {formData.pincode}</p>
                        <p className="font-body text-muted-foreground">Phone: {formData.phone} | Email: {formData.email}</p>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <h2 className="font-display font-semibold text-foreground" style={{ fontSize: "var(--text-lg)" }}>Order Confirmation</h2>
                      </div>
                      <p className="font-body text-sm text-balance text-muted-foreground leading-relaxed">
                        By clicking "Place Order", you agree to our Terms of Service. Your order will be processed immediately and you will receive a confirmation message shortly.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-border sticky top-20">
                  <h2 className="font-display font-semibold text-foreground mb-4" style={{ fontSize: "var(--text-lg)" }}>Order Summary</h2>
                  <div className="space-y-3 mb-4 pb-4 border-b border-border">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group">
                        <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0 border border-border group-hover:border-primary/30 transition-colors flex items-center justify-center p-2">
                          <img
                            src={item.image || "/Packaging_Updated.png"}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/Packaging_Updated.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-sm font-semibold text-foreground leading-tight mb-1">{item.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-md uppercase tracking-wider">Qty: {item.quantity}</span>
                            {item.size && <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">{item.size}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <p className="font-display text-sm font-bold text-foreground">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Section */}
                  <div className="mb-4 pb-4 border-b border-border">
                    {!appliedCoupon ? (
                      <div className="space-y-2">
                        <label className="font-body text-xs font-medium text-muted-foreground">Have a coupon code?</label>
                        <div className="flex gap-2">
                          <Input
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="h-10 text-sm"
                            disabled={isValidatingCoupon}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode.trim()}
                            className="h-10 gap-1.5 px-4"
                          >
                            <Tag className="h-3.5 w-3.5" />
                            {isValidatingCoupon ? "Checking..." : "Apply"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{appliedCoupon.code}</p>
                            <p className="font-body text-xs text-primary">-₹{appliedCoupon.discount_amount.toLocaleString()} off</p>
                          </div>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-foreground transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 bg-muted/30 p-4 rounded-xl">
                    <div className="flex justify-between items-center font-body text-sm">
                      <span className="text-muted-foreground font-medium">Subtotal</span>
                      <span className="text-foreground font-bold">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between items-center font-body text-sm">
                        <span className="text-muted-foreground font-medium">Discount ({appliedCoupon.code})</span>
                        <span className="text-primary font-bold">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-body text-sm">
                      <span className="text-muted-foreground font-medium">Delivery</span>
                      <span className="text-primary font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between items-center font-display text-lg font-bold pt-3 border-t border-border mt-1">
                      <span className="text-foreground uppercase tracking-wider">Total</span>
                      <span className="text-foreground">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  {step === 2 && (
                    <Button variant="hero" size="xl" className="w-full h-12 sm:h-14 mb-4" onClick={handlePlaceOrder} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : `Place Order - ₹${total.toLocaleString()}`}
                    </Button>
                  )}
                  <div className="flex flex-wrap justify-center gap-3 pt-3 border-t border-border mt-4">
                    <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-3 sm:p-4 mb-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-display text-xs font-bold text-foreground">Money-Back Transparency Guarantee</span>
                      </div>
                      <p className="font-body text-[10px] text-muted-foreground leading-snug text-balance">
                        If your specific batch lab report isn't available or shows any impurity, we'll refund your entire order immediately.
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
