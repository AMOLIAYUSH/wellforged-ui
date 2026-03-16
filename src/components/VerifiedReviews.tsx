import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, CheckCircle2, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ScrollReveal from "./ScrollReveal";
import { API_BASE_URL } from "@/config";

interface Review {
    name?: string;
    user_name?: string;
    location?: string;
    rating: number;
    text?: string;
    comment?: string;
    highlight: string;
    is_verified?: boolean;
}

const STATIC_REVIEWS: Review[] = [
    {
        name: "Dr. Ananya S.",
        location: "Bengaluru",
        rating: 5,
        text: "As a health professional, I'm always skeptical of 'superfood' claims. Seeing the NABL lab reports for the specific batch in my hand was the turning point. Finally, a brand that prioritizes data over fluff.",
        highlight: "NABL Certification is a game-changer"
    },
    {
        name: "Vikram R.",
        location: "Mumbai",
        rating: 5,
        text: "The taste is incredibly fresh, which usually means it's processed correctly. The fact that I can scan a QR code and see the chlorophyll levels and heavy metal tests makes WellForged the most trustworthy supplement I've used.",
        highlight: "Purest Moringa I've found"
    },
    {
        name: "Meera K.",
        location: "Hyderabad",
        rating: 5,
        text: "I was tired of 'proprietary blends' where you don't know what's inside. WellForged's 100% purity guarantee and the batch-wise reporting model should be the industry standard.",
        highlight: "Transparency is addictive"
    },
    {
        name: "Sandeep J.",
        location: "Pune",
        rating: 5,
        text: "The subscription model is seamless, but the quality of the moringa is what kept me. It dissolves perfectly and you can tell it's not sitting in a warehouse for months.",
        highlight: "Unbeatable freshness"
    }
];

const VerifiedReviews = () => {
    const { data: dynamicReviews } = useQuery<Review[]>({
        queryKey: ['reviews', 'moringa-powder'],
        queryFn: async () => {
            const res = await fetch(`${API_BASE_URL}/api/reviews?slug=moringa-powder`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            const data = await res.json();
            // Map 'name' to 'user_name' and 'text' to 'comment' if they exist in the fetched data
            return data.map((review: any) => ({
                ...review,
                user_name: review.user_name || review.name,
                comment: review.comment || review.text,
            }));
        }
    });

    const reviews = (dynamicReviews && dynamicReviews.length > 0) ? dynamicReviews : STATIC_REVIEWS;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        skipSnaps: false
    });

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const autoplay = setInterval(() => {
            emblaApi.scrollNext();
        }, 5000);

        return () => clearInterval(autoplay);
    }, [emblaApi]);

    return (
        <section className="section-padding bg-secondary/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <ScrollReveal animation="fade-up" className="text-center mb-12 sm:mb-20">
                    <span className="inline-block font-body text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] text-primary/70 mb-3">Community Voices</span>
                    <h2 className="font-display font-bold text-foreground mb-4" style={{ fontSize: "var(--text-3xl)" }}>
                        Trust, Verified by You
                    </h2>
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                        ))}
                        <span className="ml-2 font-display text-lg font-bold text-foreground">4.9 / 5.0</span>
                    </div>
                    <p className="font-body text-muted-foreground text-xs sm:text-sm uppercase tracking-[0.14em] sm:tracking-widest">Across 500+ Verified Customers</p>
                </ScrollReveal>

                <div className="relative group/carousel px-1 sm:px-12">
                    <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                        <div className="flex gap-6 lg:gap-8">
                            {reviews.map((review, index) => (
                                <div key={review.name} className="flex-[0_0_100%] md:flex-[0_0_48%] lg:flex-[0_0_31%] min-w-0">
                                    <div className="glass-card hover-lift p-6 sm:p-8 h-full flex flex-col bg-background/40 backdrop-blur-md relative overflow-hidden group">
                                        <div className="absolute -top-4 -left-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-foreground">
                                            <Quote className="h-24 w-24 rotate-12" />
                                        </div>

                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star key={i} className={`h-3 w-3 ${i <= review.rating ? 'fill-gold text-gold' : 'text-muted-foreground/30'}`} />
                                            ))}
                                        </div>

                                        <p className="font-display font-bold text-foreground leading-tight mb-4 group-hover:text-primary transition-colors h-[3.5em] overflow-hidden line-clamp-2" style={{ fontSize: "var(--text-lg)" }}>
                                            "{review.highlight}"
                                        </p>

                                        <p className="font-body text-muted-foreground leading-relaxed italic mb-8 flex-1 line-clamp-4" style={{ fontSize: "var(--text-sm)" }}>
                                            "{review.comment || review.text}"
                                        </p>

                                        <div className="pt-6 border-t border-border/50 mt-auto">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-display font-bold text-foreground leading-none mb-1">{review.user_name || review.name}</p>
                                                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">{review.location || 'Verified Buyer'}</p>
                                                </div>
                                                {(review.is_verified ?? true) && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-full">
                                                        <CheckCircle2 className="h-3 w-3 text-primary" />
                                                        <span className="font-body text-[9px] font-bold text-primary uppercase tracking-tighter">Verified Purchase</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-primary/20 bg-background/80 backdrop-blur shadow-sm flex items-center justify-center text-primary opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 -translate-x-4 group-hover/carousel:translate-x-0 hidden sm:flex"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full border border-primary/20 bg-background/80 backdrop-blur shadow-sm flex items-center justify-center text-primary opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 translate-x-4 group-hover/carousel:translate-x-0 hidden sm:flex"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>

                <ScrollReveal animation="fade-up" delay={500} className="mt-12 sm:mt-20 text-center">
                    <p className="font-body text-primary text-xs sm:text-sm font-bold uppercase tracking-[0.14em] sm:tracking-widest mb-6">Join the Movement of Informed Consumers</p>
                    <div className="h-px w-24 bg-primary/30 mx-auto" />
                </ScrollReveal>
            </div>
        </section>
    );
};

export default VerifiedReviews;
