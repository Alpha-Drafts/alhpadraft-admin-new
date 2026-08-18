/**
 * @description Utility functions for validating and sending formatted responses in API requests.
 */

import { ApiResponseProps } from "@/types";
import type { NextApiResponse } from "next";

// Sends a success response with status code 200.
export function send200Success<T>({
  res,
  message,
  data,
}: {
  res: NextApiResponse<ApiResponseProps<T>>;
  message: string;
  data: T;
}) {
  return res.status(200).json({
    code: 200,
    status: "success",
    message: message || "Request was successful",
    data,
  });
}

// Sends a success response with status code 201 (created).
export function send201Created<T>({
  res,
  message,
  data,
}: {
  res: NextApiResponse<ApiResponseProps<T>>;
  message: string;
  data: T;
}) {
  return res.status(201).json({
    code: 201,
    status: "success",
    message: message || "Resource created successfully",
    data,
  });
}

// Sends a response with status code 204 (no content).
export function send204NoContent<T>({
  res,
  message,
  data,
}: {
  res: NextApiResponse<ApiResponseProps<T>>;
  message: string;
  data: T;
}) {
  return res.status(204).json({
    code: 204,
    status: "success",
    message: message || "No content was returned",
    data,
  });
}

// Sends a validation error response with status code 400.
export function send400ValidationError({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error: unknown;
}) {
  return res.status(400).json({
    code: 400,
    status: "error",
    message: message || "Bad request was made",
    error: error,
  });
}

// Sends an unauthorised error response with status code 401.
export function send401Unauthorised({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error?: unknown;
}) {
  return res.status(401).json({
    code: 401,
    status: "error",
    message: message || "Unauthorised access was made",
    error: error || "Unauthorised access was made",
  });
}

// Sends a forbidden error response with status code 403.
export function send403Forbidden({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error?: unknown;
}) {
  return res.status(403).json({
    code: 403,
    status: "error",
    message: message || "Permission denied",
    error: error || "You do not have permission to access this resource",
  });
}

// Sends a not found error response with status code 404.
export function send404NotFound({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error?: unknown;
}) {
  return res.status(404).json({
    code: 404,
    status: "error",
    message: message || "Not found",
    error: error || "The resource was not found",
  });
}

// Sends a method not allowed error response with status code 405.
export function send405MethodNotAllowed({
  res,
  message,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
}) {
  return res.status(405).json({
    code: 405,
    status: "error",
    message: message || "The method is not allowed",
  });
}

// Sends a conflict error response with status code 409.
export function send409Conflict({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error: unknown;
}) {
  return res.status(409).json({
    code: 409,
    status: "error",
    message: message || "Conflict occurred",
    error: error || "Conflict occurred",
  });
}

// Sends a generic error response with the status code from the response object or 500.
// This function is useful for handling unexpected errors.
export function send500Error({
  res,
  message,
  error,
}: {
  res: NextApiResponse<ApiResponseProps>;
  message: string;
  error: unknown;
}) {
  const typedError = error as Error;

  return res.status(res.statusCode || 500).json({
    code: res.statusCode || 500,
    status: (typedError as { status?: string }).status || "error",
    message:
      typedError.message || message || "An internal server error occurred",
    error: process.env.NODE_ENV === "development" ? typedError : undefined,
  });
}
