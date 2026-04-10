import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartDrawer from "@/components/CartDrawer";
import ProtectedRoute from "@/components/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

const Index = lazy(() => import("./pages/Index"));
const TransparencyPage = lazy(() => import("./pages/TransparencyPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const queryClient = new QueryClient();

const RouteFallback = () => (
    <div className="page-pt flex min-h-screen items-center justify-center bg-background">
        <div className="premium-panel flex min-w-[18rem] flex-col items-center gap-3 px-6 py-8 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
            <p className="eyebrow-label">Loading</p>
            <p className="font-body text-sm text-muted-foreground">Preparing the next WellForged experience.</p>
        </div>
    </div>
);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const App = () => (
    <HelmetProvider>
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <TooltipProvider>
                        <ErrorBoundary>
                            <Toaster />
                            <Sonner />
                            <BrowserRouter>
                                <ScrollToTop />
                                <CartDrawer />
                                <Suspense fallback={<RouteFallback />}>
                                    <Routes>
                                        <Route path="/" element={<Index />} />
                                        <Route path="/transparency" element={<TransparencyPage />} />
                                        <Route path="/product" element={<ProductPage />} />
                                        <Route path="/checkout" element={<CheckoutPage />} />
                                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                        <Route path="/terms-of-service" element={<TermsOfService />} />
                                        <Route path="/refund-policy" element={<RefundPolicy />} />
                                        <Route path="/shipping-policy" element={<ShippingPolicy />} />
                                        <Route path="/contact-us" element={<ContactUs />} />
                                        <Route path="/order-success" element={<OrderSuccessPage />} />
                                        <Route path="/admin" element={
                                            <ProtectedRoute requiredRole="admin">
                                                <AdminDashboard />
                                            </ProtectedRoute>
                                        } />
                                        <Route path="*" element={<NotFoundPage />} />
                                    </Routes>
                                </Suspense>
                            </BrowserRouter>
                        </ErrorBoundary>
                    </TooltipProvider>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    </HelmetProvider>
);

export default App;
