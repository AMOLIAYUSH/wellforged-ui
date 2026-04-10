import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const RefundPolicy = () => {
    return (
        <>
            <Helmet>
                <title>Refund & Cancellation Policy | WellForged</title>
            </Helmet>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-[#fcfdfc]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">Refund & Cancellation Policy</h1>
                    <div className="prose prose-slate max-w-none font-body text-muted-foreground space-y-8">
                        <section className="space-y-4">
                            <p>Last Updated: April 10, 2026</p>
                            <p>At WellForged, we stand by the quality of our products. However, if you are not entirely satisfied with your purchase, we're here to help.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">1. Returns</h2>
                            <p>You have <strong>7 calendar days</strong> to return an item from the date you received it.</p>
                            <p>To be eligible for a return:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>The item must be unused and in the same condition that you received it.</li>
                                <li>The item must be in its original packaging (seal must be intact).</li>
                                <li>The item needs to have the receipt or proof of purchase.</li>
                            </ul>
                            <p>Due to the nature of health supplements, we cannot accept returns for products once the safety seal has been broken or tampered with.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">2. Refunds</h2>
                            <p>Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
                            <p>If your return is approved, we will initiate a refund to your original method of payment (via Razorpay). You will receive the credit within a certain amount of days, depending on your card issuer's policies (standard time is 5-7 business days).</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">3. Cancellations</h2>
                            <p>Orders can only be cancelled before they are dispatched. Typically, orders are dispatched within 24 hours. Once the order is shipped, it cannot be cancelled, and the return policy will apply.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">4. Damaged Items</h2>
                            <p>If you receive a damaged or defective product, please contact us immediately at hello@wellforged.in with photos of the damage. We will arrange for a replacement or a full refund at no extra cost to you.</p>
                        </section>

                        <p className="pt-8 italic text-foreground">To initiate a return or cancellation, please reach out to us at hello@wellforged.in</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default RefundPolicy;
