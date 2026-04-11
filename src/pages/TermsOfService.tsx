import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsOfService = () => {
    return (
        <>
            <SEO title="Terms of Service | WellForged" canonical="https://www.wellforged.in/terms-of-service" />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-[#fcfdfc]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">Terms of Service</h1>
                    <div className="prose prose-slate max-w-none font-body text-muted-foreground space-y-8">
                        <section className="space-y-4">
                            <p>Last Updated: April 10, 2026</p>
                            <p>By using the WellForged website and services, you agree to be bound by the following terms and conditions. Please read them carefully.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">1. Use of Website</h2>
                            <p>By accessing the website, you warrant and represent to WellForged that you are legally entitled to do so and to make use of information made available via the website. You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">2. Products and Pricing</h2>
                            <p>All products listed on the website, their descriptions, and their prices are each subject to change. WellForged reserves the right, at any time, to modify, suspend, or discontinue the sale of any product with or without notice.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">3. Orders and Payments</h2>
                            <p>A contract between the customer and WellForged for the purchase of our products will exist once an order has been accepted, processed, and dispatched. At any point up until then, we may decline to supply the goods to you without giving any reason.</p>
                            <p>Payments are processed securely via our payment gateway partners. You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">4. Intellectual Property</h2>
                            <p>The trademarks, names, logos and service marks (collectively "trademarks") displayed on this website are registered and unregistered trademarks of WellForged. Nothing contained on this website should be construed as granting any license or right to use any trademark without the prior written permission of WellForged.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">5. Limitation of Liability</h2>
                            <p>WellForged shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the services.</p>
                        </section>

                        <p className="pt-8 italic text-foreground">For any queries regarding our terms, please email us at hello@wellforged.in</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default TermsOfService;
