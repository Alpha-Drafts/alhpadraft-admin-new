/**
 * @description Utility functions to validate if a file is of a valid format.
 */

// Checks if a file is a valid image format
export const validateImageInputType = (file: File) => {
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/heic"];

  if (!allowedFormats.includes(file.type)) {
    return "Only .png, .jpg, .jpeg and .heic formats are allowed.";
  }
  return null;
};

// Checks if a file is a valid PDF format
export const validatePDFInputType = (file: File) => {
  const allowedFormats = ["application/pdf"];

  if (!allowedFormats.includes(file.type)) {
    return "Only PDF files are allowed.";
  }
  return null;
};

// Checks if a file is a valid document format
export const validateDocInputType = (file: File) => {
  const allowedFormats = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
  ];

  if (!allowedFormats.includes(file.type)) {
    return "Only Word and PDF files are allowed.";
  }
  return null;
};
