import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
    return (
        <>
                <SEO title="Privacy Policy | Wellforged" canonical="https://www.wellforged.in/privacy-policy" />
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-[#fcfdfc]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-8">Privacy Policy</h1>
                    <div className="prose prose-slate max-w-none font-body text-muted-foreground space-y-8">
                        <section className="space-y-4">
                            <p>Last Updated: April 10, 2026</p>
                            <p>WellForged ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by WellForged.</p>
                            <p>By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy and our Terms of Service.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">1. What Information Do We Collect?</h2>
                            <p>We collect information from you when you visit our service, register, place an order, subscribe to our newsletter, respond to a survey or fill out a form.</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name / Username</li>
                                <li>Phone Numbers</li>
                                <li>Email Addresses</li>
                                <li>Mailing Addresses</li>
                                <li>Billing Addresses</li>
                                <li>Debit/credit card numbers (processed securely via our payment partners)</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">2. How Do We Use Your Information?</h2>
                            <p>Any of the information we collect from you may be used in one of the following ways:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To personalize your experience (your information helps us to better respond to your individual needs)</li>
                                <li>To improve our service (we continually strive to improve our offerings based on the information and feedback we receive from you)</li>
                                <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
                                <li>To process transactions</li>
                                <li>To send periodic emails and updates regarding your orders</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">3. Third-Party Sharing</h2>
                            <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
                            <p>We use **Razorpay** for processing payments. We/Razorpay do not store your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment.</p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-display font-semibold text-foreground">4. Security</h2>
                            <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
                        </section>

                        <p className="pt-8 italic text-foreground">If you have any questions about this Privacy Policy, please contact us at hello@wellforged.in</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPolicy;
