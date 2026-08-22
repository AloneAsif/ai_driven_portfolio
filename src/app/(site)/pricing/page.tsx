import type { Metadata } from "next";
import { EmptyState } from "@/components/empty-state";
import { OfferCard } from "@/components/offer-card";
import { ScrollReveal } from "@/components/reactbits/scroll-reveal";
import { fetchSanity } from "@/sanity/lib/data";
import { OFFERS_QUERY } from "@/sanity/lib/queries";
import type { Offer } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Pricing & Offers",
  description: "Transparent pricing for full-stack development, AI chatbots, and Sanity CMS packages.",
};

export default async function PricingPage() {
  const offers = await fetchSanity<Offer[]>(OFFERS_QUERY, {}, ["offer"]);
  const allOffers = offers ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 relative">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.6), transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.5), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <ScrollReveal className="relative z-10">
        <header className="max-w-2xl text-center mx-auto">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-white via-cyan-300 to-white bg-clip-text text-transparent">
            Pricing & Offers
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground text-lg mx-auto">
            Choose the package that fits your needs. All prices are one-time unless noted.
            Need something custom?{" "}
            <a href="/contact" className="text-primary hover:underline font-medium">
              Get in touch
            </a>
            .
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal stagger={0.1} className="relative z-10 mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {allOffers.length > 0 ? (
          allOffers.map((offer, index) => (
            <OfferCard key={offer._id} offer={offer} index={index} />
          ))
        ) : (
          <EmptyState
            title="No offers available"
            description="Add offers in Sanity Studio to populate this page."
          />
        )}
      </ScrollReveal>

      {allOffers.length > 0 && (
        <ScrollReveal className="relative z-10 mt-20 text-center">
          <div className="max-w-2xl mx-auto p-6 rounded-2xl border border-white/10 bg-white/3 dark:bg-white/2 backdrop-blur-2xl">
            <p className="text-muted-foreground">
              All packages include a discovery call, responsive design, and 1 round of revisions.
              <br />
              <a
                href="/contact"
                className="text-primary hover:underline font-medium mt-4 inline-block"
              >
                Need a custom quote? &rarr;
              </a>
            </p>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}