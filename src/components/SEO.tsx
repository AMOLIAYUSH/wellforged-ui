import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "product";
  twitterHandle?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  googleSiteVerification?: string;
}

const SEO = ({
  title = "Wellforged | The No Nonsense Supplement Brand",
  description = "Pure ingredients, zero fillers, and absolute clarity. Wellforged is the no nonsense supplement brand built on integrity and evidence.",
  canonical = "https://wellforged.in",
  ogImage = "https://wellforged.in/assets/Packaging_Updated.png",
  ogType = "website",
  twitterHandle = "@wellforged",
  jsonLd,
  googleSiteVerification = "uUXT8EOkidxG6y1nmQDFnmQYk6xex_vD_qgqY-AunuQ",
}: SEOProps) => {
  const siteName = "Wellforged";
  
  // BRAND-FIRST LOGIC: Ensure "Wellforged" is at the start of the title for brand queries
  const brandPrefixedTitle = title.startsWith(siteName) 
    ? title 
    : `${siteName} | ${title.replace(`${siteName} | `, "").replace(` | ${siteName}`, "")}`;

  // Organization Schema (Knowledge Graph support)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Wellforged",
    "url": "https://wellforged.in",
    "logo": "https://wellforged.in/assets/Transparent_logo.png",
    "sameAs": [
      "https://www.instagram.com/wellforged",
      "https://twitter.com/wellforged"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@wellforged.in",
      "contactType": "customer service"
    }
  };

  const finalJsonLd = jsonLd 
    ? (Array.isArray(jsonLd) ? [organizationSchema, ...jsonLd] : [organizationSchema, jsonLd])
    : [organizationSchema];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{brandPrefixedTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content={googleSiteVerification} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={brandPrefixedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={brandPrefixedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

      {/* Search Engine Directives */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />

      {/* Structured Data */}
      {finalJsonLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
