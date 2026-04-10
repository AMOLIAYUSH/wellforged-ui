import React, { useState, useEffect, useRef, useCallback } from "react";
import SEO from "@/components/SEO";
import { useNavigate } from "react-router-dom";
import { Check, Leaf, Shield, FlaskConical, QrCode, Globe, CheckCircle, ChevronLeft, ChevronRight, Sparkles, Clock3, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import ProductSelector from "@/components/ProductSelector";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { API_BASE_URL } from "@/config";
import type { HighlightPill, ProductData } from "@/types/store";
import productImage1 from "@/assets/product-carousel-1.jpg";
import productImage2 from "@/assets/product-carousel-2.jpg";
import productImage3 from "@/assets/product-carousel-3.jpg";
import productImage4 from "@/assets/product-carousel-4.jpg";
import productImage5 from "@/assets/product-carousel-5.jpg";
import { imageErrorFallback } from "@/utils/images";

interface TechnicalSpecDetail {
  label: string;
  value: string;
}

interface TechnicalSpecGroup {
  icon: typeof Globe;
  title: string;
  details: TechnicalSpecDetail[];
}

const ProductPage = () => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slug = "moringa-powder";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);
        if (response.ok) {
          const data = (await response.json()) as ProductData;
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleProcessTransition = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/transparency");
      window.scrollTo(0, 0);
    }, 800);
  };

  const carouselImages = [productImage1, productImage2, productImage3, productImage4, productImage5];
  const productImages = carouselImages;

  const startAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    if (productImages.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3200);
  }, [productImages.length]);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [startAutoPlay]);

  const goTo = (idx: number) => {
    setCurrentImageIndex(idx);
    startAutoPlay();
  };
  const nextImage = () => goTo((currentImageIndex + 1) % productImages.length);
  const prevImage = () => goTo((currentImageIndex - 1 + productImages.length) % productImages.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
  };

  const trustHighlights: HighlightPill[] =
    product?.metadata
      ?.filter((m) => m.category === "highlight")
      .map((m) => ({
        icon: m.icon_name === "Leaf" ? Leaf : m.icon_name === "Shield" ? Shield : m.icon_name === "FlaskConical" ? FlaskConical : CheckCircle,
        label: m.key,
      })) || [
      { icon: Leaf, label: "Single Ingredient" },
      { icon: Shield, label: "No Additives" },
      { icon: FlaskConical, label: "Lab Tested" },
      { icon: QrCode, label: "Batch Verified" },
    ];

  const ingredients =
    product?.metadata
      ?.filter((m) => m.category === "ingredient")
      .map((m) => ({
        icon: Leaf,
        name: m.key,
      })) || [{ icon: Leaf, name: "Moringa Oleifera" }];

  const specs = product?.metadata?.filter((m) => m.category === "spec") || [];
  const technicalSpecs: Record<string, TechnicalSpecGroup> = {
    overview: {
      icon: Globe,
      title: "Technical Overview",
      details: specs.map((s) => ({ label: s.key, value: s.value })),
    },
  };

  const faqs =
    product?.faqs?.length > 0
      ? product.faqs
      : [{ question: "Is this product lab tested?", answer: "Yes, every batch undergoes independent third-party laboratory testing." }];

  const useBlocks = [
    {
      icon: Sparkles,
      title: "How to Use",
      body: "Add one spoon to water, smoothies, or curd. Start with a simple daily serving and keep the ritual consistent for best results.",
    },
    {
      icon: HeartHandshake,
      title: "Who It Is For",
      body: "Ideal for customers who want an uncomplicated greens habit without sweeteners, flavors, sugar alcohols, or proprietary blends.",
    },
    {
      icon: Clock3,
      title: "Expected Experience",
      body: "Expect an earthy, natural taste, easy blending, and a routine that feels clean, minimal, and grounded rather than over-engineered.",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
      </div>
    );
  }

  const productName = product?.name || "Pure Moringa Leaf Powder";
  const productDescription = product?.base_description || "Wellforged Moringa Leaf Powder - Clean, single-ingredient moringa powder crafted with disciplined sourcing and verified lab quality.";
  const canonicalUrl = `https://wellforged.in/product/${slug}`;

  // SEO Rectification: Brand-First Title
  const seoTitle = `${productName} | Clean Single-Ingredient Wellness`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={productDescription}
        canonical={canonicalUrl}
        ogType="product"
        ogImage="https://wellforged.in/assets/Packaging_Updated.png"
        jsonLd={{
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": `Wellforged ${productName}`, // Explicit brand prefix in schema
          "image": [
            "https://wellforged.in/assets/product-carousel-1.jpg",
            "https://wellforged.in/assets/Packaging_Updated.png"
          ],
          "description": productDescription,
          "sku": slug,
          "mpn": "WF-MOR-01",
          "brand": {
            "@type": "Brand",
            "name": "Wellforged"
          },
          "offers": {
            "@type": "Offer",
            "url": canonicalUrl,
            "priceCurrency": "INR",
            "price": "499",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
          }
        }}
      />

      <Navbar />
      <main className="min-h-screen bg-background pb-20 pt-16 sm:pb-0 sm:pt-20">
        <section className="py-4 sm:py-6">
          <div className="mx-auto max-w-[1440px] px-[var(--space-sm)] lg:px-[var(--space-md)]">
            <div className="grid items-start gap-[var(--space-md)] lg:grid-cols-2 lg:gap-[var(--space-xl)]">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ScrollReveal animation="fade-right">
                  <div
                    className="group relative mx-auto w-full max-w-[400px] select-none sm:max-w-[500px] lg:max-w-[580px]"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    <div className="premium-panel relative aspect-square overflow-hidden bg-[#f6f8f5]">
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-background/85 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
                        View {currentImageIndex + 1} / {productImages.length}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
                      >
                        <ChevronLeft className="h-4 w-4 text-foreground" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
                      >
                        <ChevronRight className="h-4 w-4 text-foreground" />
                      </button>

                      <div
                        className="flex h-full transition-transform duration-500 ease-out"
                        style={{
                          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
                          transform: `translateX(-${currentImageIndex * (100 / productImages.length)}%)`,
                          width: `${productImages.length * 100}%`,
                        }}
                      >
                        {productImages.map((img, i) => (
                          <div key={i} className="h-full flex-shrink-0" style={{ width: `${100 / productImages.length}%` }}>
                            <img
                              src={img}
                              alt={`Wellforged ${product?.name || "Product"} - Detailed View ${i + 1}`}
                              loading={i === 0 ? "eager" : "lazy"}
                              className="h-full w-full object-contain p-6 sm:p-10"
                              onError={imageErrorFallback}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {productImages.length > 1 && (
                      <div className="mt-3 grid grid-cols-5 gap-2">
                        {productImages.slice(0, 5).map((img, i) => (
                          <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`Wellforged product thumbnail ${i + 1}`}
                            className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                              i === currentImageIndex ? "border-primary shadow-[0_12px_24px_-18px_hsl(var(--primary)/0.45)]" : "border-border/80 opacity-75 hover:opacity-100"
                            }`}
                          >
                            <div className="aspect-square bg-[#f6f8f5] p-1.5">
                              <img
                                src={img}
                                alt={`Wellforged ${product?.name || "Product"} Preview ${i + 1}`}
                                className="h-full w-full object-contain"
                                onError={imageErrorFallback}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>

              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <ScrollReveal animation="fade-left">
                  <div className="mb-2 space-y-3">
                    <span className="eyebrow-label text-primary font-bold">Wellforged Standard</span>
                    <h1 className="font-display text-foreground" style={{ fontSize: "clamp(1.9rem, 5vw, 2.9rem)", lineHeight: 1.05 }}>
                      {product?.name || "Pure Moringa Powder"}
                    </h1>
                    <p className="max-w-xl font-body text-muted-foreground" style={{ fontSize: "var(--text-base)", lineHeight: 1.72 }}>
                      {product?.base_description ||
                        "Pure, nutrient-rich moringa powder lab tested, free from fillers, and crafted to deliver clean daily nourishment."}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {trustHighlights.slice(0, 3).map(({ icon: Icon, label }) => (
                        <span key={label} className="premium-pill gap-2 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary sm:text-[0.72rem]">
                          <Icon className="h-3.5 w-3.5" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up">
                  <div className="premium-panel border-gold/20 bg-gradient-to-b from-card to-secondary/30 p-4 shadow-gold sm:p-5">
                    <ProductSelector product={product} />
                  </div>
                </ScrollReveal>
              </div>
            </div>

            <div className="mt-[var(--space-lg)] grid gap-4 sm:mt-[var(--space-xl)] lg:grid-cols-3">
              {useBlocks.map(({ icon: Icon, title, body }) => (
                <ScrollReveal key={title} animation="fade-up">
                  <div className="premium-panel h-full p-4 sm:p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-xl text-foreground">{title}</h3>
                    <p className="mt-2 font-body text-sm leading-7 text-muted-foreground">{body}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-6 sm:mt-8">
              <ScrollReveal animation="fade-up">
                <div className="space-y-[var(--space-sm)] sm:space-y-[var(--space-md)]">
                  <div className="space-y-2 text-center">
                    <p className="eyebrow-label">What Is Inside</p>
                    <h2 className="section-title" style={{ fontSize: "var(--text-2xl)" }}>Ingredient Profile</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-6">
                    {ingredients.map(({ icon: Icon, name }) => (
                      <div key={name} className="premium-panel flex h-full flex-col items-center gap-2 p-3 text-center transition-all duration-200 hover:bg-primary/5 sm:gap-3 sm:p-4">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-secondary sm:h-10 sm:w-10 sm:rounded-xl">
                          <Icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-body text-xs font-semibold leading-tight text-foreground sm:text-sm">{name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="bg-secondary/30 py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-3 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <div className="mb-[var(--space-lg)] text-center sm:mb-[var(--space-xl)]">
                <span className="eyebrow-label text-gold">Quality Reference</span>
                <h2 className="section-title mb-[var(--space-xs)] text-gold-gradient">Technical Specifications</h2>
                <p className="section-copy mx-auto max-w-xl px-2 sm:max-w-2xl">Complete transparency on our sourcing, testing protocols, and purity standards.</p>
              </div>
            </ScrollReveal>
            <div className="mx-auto max-w-4xl">
              <Accordion type="single" collapsible className="space-y-4">
                {Object.values(technicalSpecs).map((spec, index) => (
                  <AccordionItem key={spec.title} value={`spec-${index}`} className="premium-panel px-4 sm:px-6">
                    <AccordionTrigger className="group py-4 hover:no-underline sm:py-6">
                      <div className="flex items-center gap-3 text-left sm:gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20 sm:h-12 sm:w-12">
                          <spec.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-semibold text-foreground sm:text-lg lg:text-xl">{spec.title}</h3>
                          <p className="mt-0.5 font-body text-xs text-muted-foreground">Click to view detailed certifications and data</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <ul className="grid gap-x-8 gap-y-2 border-t border-border/50 pt-2 sm:grid-cols-2">
                        {spec.details.map((detail, i) => (
                          <li key={i} className="flex items-center justify-between border-b border-border/30 py-2 last:border-0 sm:last:border-b">
                            <span className="font-body text-xs text-muted-foreground sm:text-sm">{detail.label}</span>
                            <span className="text-right font-body text-xs font-semibold text-foreground sm:text-sm">{detail.value}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <p className="eyebrow-label text-center">Our Ingredient Philosophy</p>
              <h2 className="section-title mb-3 text-center sm:mb-5">Why We Chose Moringa</h2>
              <p className="section-copy px-2 text-center">
                Moringa has long been valued as a nutrient-dense plant ingredient. We chose moringa for its versatility, simplicity, and alignment with our clean nutrition philosophy.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-secondary/30 py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <p className="eyebrow-label text-center">Why Buy This</p>
              <h2 className="section-title mb-4 text-center sm:mb-6">What Makes This Product Different</h2>
              <div className="mx-auto max-w-2xl space-y-2 sm:space-y-3">
                {[
                  "Single-ingredient formulation with no hidden blends",
                  "Carefully sourced leaves processed under controlled conditions",
                  "Finely milled for smooth texture and easy mixing",
                  "Each batch independently lab tested",
                  "QR-based batch verification for complete transparency",
                ].map((item, index) => (
                  <div key={index} className="premium-panel group flex items-start gap-2.5 p-3.5 sm:gap-3 sm:p-4">
                    <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 sm:h-5 sm:w-5">
                      <Check className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
                    </div>
                    <span className="font-body text-sm text-foreground sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-secondary/30 py-10 sm:py-14 lg:py-20">
          <div className="mx-auto max-w-3xl px-3 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <p className="eyebrow-label text-center">Need Clarity</p>
              <h2 className="section-title mb-4 text-center sm:mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-2 sm:space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="premium-panel rounded-lg px-3 transition-shadow data-[state=open]:shadow-md sm:rounded-xl sm:px-5">
                    <AccordionTrigger className="py-3 text-left font-display text-sm text-foreground hover:no-underline sm:py-4 sm:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-3 font-body text-xs text-muted-foreground sm:pb-4 sm:text-sm">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-primary/5 pb-24 pt-10 sm:py-14 sm:pb-14 lg:py-20 lg:pb-20">
          <div className={`pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-primary transition-all duration-700 ${isTransitioning ? "scale-100 opacity-100" : "scale-110 opacity-0"}`}>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <Shield className="h-12 w-12 animate-shield-pulse text-primary-foreground sm:h-16 sm:w-16" />
              </div>
              <h2 className="mb-2 font-display text-2xl font-bold text-primary-foreground sm:text-3xl">Accessing Transparency Forge</h2>
              <div className="mx-auto h-1 w-48 overflow-hidden rounded-full bg-primary-foreground/20">
                <div className="h-full animate-shimmer-sweep bg-primary-foreground" />
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-4xl px-3 sm:px-6 lg:px-8">
            <ScrollReveal animation="scale">
              <div className="space-y-4 text-center sm:space-y-6">
                <p className="eyebrow-label text-center">Start Your Ritual</p>
                <h2 className="section-title">Ready to Experience Clean Nutrition?</h2>
                <p className="section-copy mx-auto max-w-2xl px-2">Join thousands who trust Wellforged for their daily wellness routine.</p>
                <div className="flex justify-center">
                  <button
                    onClick={handleProcessTransition}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-input bg-background px-5 py-2 text-sm font-medium ring-offset-background transition-colors hover:border-primary/30 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:w-auto"
                  >
                    Learn About Our Process
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default ProductPage;
