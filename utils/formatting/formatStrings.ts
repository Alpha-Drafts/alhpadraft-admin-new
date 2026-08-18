// Turns  product-name and id into a URL-friendly slug, e.g., "Product Name" and "123" becomes "product-name-123"
export const formatProductUrl = (name: string, id: string): string => {
  const formattedName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
  return encodeURIComponent(`${formattedName}-${id}`);
};

// Converts a URL-friendly slug back to a product name and id, e.g., "product-name-123" becomes ["product name", "123"]
export const extractProductId = (slug: string): string => {
  const decodedSlug = decodeURIComponent(slug);
  const parts = decodedSlug.split("-");
  return parts[parts.length - 1];
};

// Strips HTML tags from a string and trims whitespace
export const stripHtmlTags = (input: string): string => {
  return input.replace(/<[^>]*>/g, "").trim();
};
