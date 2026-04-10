import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const ContactUs = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            toast.success("Message sent! We'll get back to you soon.");
            setIsSubmitting(false);
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <>
            <Helmet>
                <title>Contact Us | WellForged</title>
            </Helmet>
            <Navbar />
            <main className="pt-24 pb-16 min-h-screen bg-[#fcfdfc]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Get in Touch</h1>
                        <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
                            Have questions about our transparency, products, or your order? We're here to help you forge your path to wellness.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div className="space-y-8">
                                <h2 className="font-display font-semibold text-2xl text-foreground">Contact Information</h2>
                                <p className="font-body text-muted-foreground">
                                    Our dedicated support team is available Monday to Friday, 10 AM to 6 PM IST.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/5 p-3 rounded-full">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-display font-medium text-foreground">Email Us</p>
                                        <p className="font-body text-muted-foreground">hello@wellforged.in</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/5 p-3 rounded-full">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-display font-medium text-foreground">Call Us</p>
                                        <p className="font-body text-muted-foreground">+91 (Support Number Pending)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-primary/5 p-3 rounded-full">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-display font-medium text-foreground">Registered Office</p>
                                        <p className="font-body text-muted-foreground whitespace-pre-line">
                                            Wellforged Wellness Pvt Ltd
                                            (Address Pending)
                                            New Delhi, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Name</label>
                                        <Input placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <Input type="email" placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input placeholder="How can we help?" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="Tell us more about your inquiry..." className="min-h-[150px]" required />
                                </div>
                                <Button type="submit" className="w-full h-12 gap-2" disabled={isSubmitting}>
                                    <Send className="h-4 w-4" />
                                    {isSubmitting ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default ContactUs;
