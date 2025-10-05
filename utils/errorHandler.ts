import axios from 'axios';
import toast from 'react-hot-toast';

export interface ErrorHandlerOptions {
  onValidationError?: (errors: Record<string, string[]>) => void;
  onAuthFailure?: () => void;
  fallbackMessage?: string;
}

export interface ApiErrorMessage {
  message?: string;
  error?: string;
  details?: string;
  errors?: Record<string, string[]>;
  data?: {
    message?: string;
    error?: string;
  };
}

/**
 * Centralized error handler for API responses
 * Handles common error scenarios with meaningful user messages
 */
export const handleApiError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
) => {
  const {
    onValidationError,
    onAuthFailure,
    fallbackMessage = 'An unexpected error occurred. Please try again.'
  } = options;

  // Handle non-Axios errors
  if (!axios.isAxiosError(error)) {
    console.error('Non-Axios error:', error);
    toast.error(fallbackMessage);
    return;
  }

  const status = error.response?.status;
  const errorData: ApiErrorMessage = error.response?.data || {};
  const errorMessage = errorData.message || errorData.error || errorData.details || errorData.data?.message || errorData.data?.error;

  // Handle validation errors (400 with field-specific errors)
  if (status === 400 && errorData.errors) {
    if (onValidationError) {
      onValidationError(errorData.errors);
    } else {
      toast.error(errorMessage || 'Please check the form for errors');
    }
    return;
  }

  // Handle different status codes - prioritize backend messages
  const statusMessages: Record<number, string> = {
    400: errorMessage || 'Invalid request. Please check your input.',
    401: errorMessage || 'Authentication failed. Please log in again.',
    403: errorMessage || 'You do not have permission to perform this action.',
    404: errorMessage || 'The requested resource was not found.',
    409: errorMessage || 'A record with this information already exists.',
    422: errorMessage || 'Unable to process the request. Please check your input.',
    429: errorMessage || 'Too many requests. Please wait a moment and try again.',
    500: errorMessage || 'Server error. Please try again later.',
    503: errorMessage || 'Service temporarily unavailable. Please try again later.',
  };

  const message = status ? statusMessages[status] : undefined;
  
  if (message) {
    toast.error(message);
    
    // Handle authentication failure
    if (status === 401) {
      localStorage.removeItem('token');
      onAuthFailure?.();
    }
  } else {
    // Handle network errors or fallback
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      toast.error('Network error. Please check your connection and try again.');
    } else {
      toast.error(errorMessage || fallbackMessage);
    }
  }
};

/**
 * Handles form validation errors by setting them on the form
 */
export const setValidationErrors = <T extends Record<string, any>>(
  errors: Record<string, string[]>,
  setError: (field: keyof T, error: { type: 'server'; message: string }) => void
) => {
  Object.keys(errors).forEach(field => {
    setError(field as keyof T, {
      type: 'server',
      message: errors[field][0] || `Invalid ${field}`
    });
  });
  toast.error('Please check the form for errors');
};
