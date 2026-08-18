/**
 * @description Configuration object containing global site metadata.
 * Includes information such as site title, description, social media links, contact details, and analytics IDs.
 * This data is typically used for SEO, social sharing, and general site setup.
 */

import icon from "@/public/icon.svg";
import iconWhite from "@/public/icon-white.svg";
import logo from "@/public/logo.svg";
import logoWhite from "@/public/logo-white.svg";

const site = {
  url: "https://admin.alphadrafts.com",
  title: "AlphaDrafts Admin Panel",
  description:
    "AlphaDrafts Admin Panel is a comprehensive platform for managing and overseeing all aspects of the AlphaDrafts service, including user accounts, content moderation, analytics, and system settings.",
  cover_image: "https://admin.alphadrafts.com/cover.jpg",
  cover_image_alt: "AlphaDrafts Cover Image",
  twitter_handle: "@alphadrafts",
  keywords: "alphadrafts, site",
  type: "website",
  icon: icon,
  whiteIcon: iconWhite,
  logo: logo,
  whiteLogo: logoWhite,

  /**
   * @description Google Analytics and other tracking/analytics service configurations.
   * Leave the value empty or undefined if not in use.
   */
  analytics: {
    google: "",
  },

  /**
   * @description Blog-related metadata including name, URL, and default author.
   * Used for identifying blog-specific content across the site.
   */
  blog: {
    name: "",
    url: "#",
    author: "",
  },

  /**
   * @description All contact-related information for the site.
   * Includes phone number, physical address, and relevant email addresses.
   * Useful for footers, contact pages, or metadata.
   */
  contact: {
    phone_number: "",
    address: "#",
    emails: {
      info: "#",
      sales: "#",
    },
  },

  /**
   * @description Links to the site's mobile applications on various platforms.
   */
  apps: {
    android: "#",
    ios: "#",
  },

  /**
   * @description Social media handles and profile links for the brand or site.
   * These are used for linking and sharing content on social platforms.
   */
  social_handles: {
    community: "#",
    facebook: "#",
    twitter: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#",
    github: "#",
  },
};

export default site;
