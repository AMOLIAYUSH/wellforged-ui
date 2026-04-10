import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Shipping & Delivery Policy | WellForged</title>
            </Helmet>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-[#fcfdfc]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">Shipping & Delivery Policy</h1>
                    <div className="prose prose-slate max-w-none font-body text-muted-foreground space-y-6">
                        <p>Last Updated: April 10, 2026</p>
                        
                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">1. Shipping Coverage</h2>
                            <p>WellForged offers PAN India shipping. We strive to provide the best possible coverage to all pin codes across the country through our network of reliable logistics partners.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">2. Delivery Timeline</h2>
                            <p>Our standard delivery timeline is <strong>3-5 business days from the date of dispatch</strong>.</p>
                            <p>Please note that orders are typically processed and dispatched within 24-48 hours of order confirmation. Delivery times may vary depending on your location, especially for remote areas or during peak seasons/public holidays.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">3. Shipping Charges</h2>
                            <p>Shipping charges, if applicable, will be displayed at the time of checkout. We may offer free shipping for orders above a certain value as part of our ongoing promotions.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">4. Order Tracking</h2>
                            <p>Once your order is dispatched, you will receive a confirmation email and/or SMS containing your tracking number and a link to track your shipment in real-time.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">5. Delayed or Lost Shipments</h2>
                            <p>While we aim for timely delivery, WellForged is not responsible for delays caused by logistics partners. In the rare event of a lost shipment, we will work with you to resolve the issue as quickly as possible.</p>
                        </section>

                        <p className="pt-8 italic">Questions about your shipment? Contact us at hello@wellforged.in</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ShippingPolicy;
