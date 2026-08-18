/**
 * @description This file contains the CustomHead component for managing SEO and meta tags in a Next.js application.
 * It allows for dynamic updates of the page title, description, and other meta tags based on the current page's content.
 * The component also includes default values and handles indexing rules for search engines.
 */

import Head from "next/head";
import site from "@/site.metadata";

interface CustomHeadProps {
  title?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  imageAlt?: string;
  canonicalUrl?: string;
  keywords?: string;
  type?: "website" | "article";
  author?: string;
}

// CustomHead component for managing SEO and meta tags
const CustomHead = (props: CustomHeadProps) => {
  // Default values for SEO properties
  // If the properties are not provided, fallback to site metadata or default values
  const title = props.title || site.title || "Default Title";
  const description =
    props.description || site.description || "Default Description";
  const url = props.url || site.url || "";
  const imageUrl = props.imageUrl || site.cover_image || "/favicon.ico";
  const imageAlt = props.imageAlt || site.cover_image_alt || title;
  const keywords = props.keywords || site.keywords || "";
  const type = props.type || site.type || "website";
  const author = props.author || site.blog.author || "Site Author";
  const twitter = site.twitter_handle || "";

  return (
    <Head>
      {/* Language meta tag */}
      <meta httpEquiv="Content-Language" content="en" />

      {/* Favicon and app icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Indexing rules for search engines - Admin app should never be indexed */}
      <meta name="robots" content="noindex, nofollow" />

      {/* Page title */}
      <title>{title}</title>

      {/* SEO Meta Tags */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="type" content={type} />
      {type === "article" && <meta name="author" content={author} />}

      {/* Open Graph Meta Tags for Facebook sharing */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      {/* Twitter Card Meta Tags */}
      <meta
        name="twitter:card"
        content={imageUrl ? "summary_large_image" : "summary"}
      />
      <meta name="twitter:site" content={twitter} />
      <meta name="twitter:creator" content={twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      <meta property="twitter:image:alt" content={imageAlt} />

      {/* Canonical URL to prevent duplicate content */}
      {props.canonicalUrl && <link rel="canonical" href={props.canonicalUrl} />}
    </Head>
  );
};

export default CustomHead;
