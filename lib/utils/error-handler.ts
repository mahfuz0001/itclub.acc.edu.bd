/**
 * Comprehensive error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
}

export class CustomError extends Error {
  code?: string;
  details?: any;
  timestamp: Date;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

/**
 * Safe error message extraction that doesn't expose sensitive information
 */
export function getSafeErrorMessage(error: unknown): string {
  if (error instanceof CustomError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    // Firebase auth errors
    if (error.message.includes('auth/')) {
      return getFirebaseErrorMessage(error.message);
    }
    
    // Network errors
    if (error.message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Generic error message without exposing stack traces
    return 'An unexpected error occurred. Please try again.';
  }
  
  return 'An unknown error occurred. Please try again.';
}

/**
 * Firebase-specific error message mapping
 */
function getFirebaseErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-api-key': 'Authentication service is temporarily unavailable.',
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'A resource with this identifier already exists.',
    'failed-precondition': 'The operation cannot be completed at this time.',
    'unavailable': 'The service is temporarily unavailable. Please try again later.',
  };

  for (const [code, message] of Object.entries(errorMessages)) {
    if (errorCode.includes(code)) {
      return message;
    }
  }

  return 'An authentication error occurred. Please try again.';
}

/**
 * Error logging utility that sanitizes sensitive data
 */
export function logError(error: unknown, context?: string, additionalData?: any): void {
  const sanitizedData = sanitizeErrorData(additionalData);
  
  console.error(`[ERROR] ${context || 'Unknown context'}:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    code: error instanceof CustomError ? error.code : undefined,
    timestamp: new Date().toISOString(),
    context,
    additionalData: sanitizedData,
  });
}

/**
 * Sanitize error data to remove sensitive information
 */
function sanitizeErrorData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'auth', 'key'];
  const sanitized = { ...data };

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Async operation wrapper with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    logError(error, context);
    return fallback || null;
  }
}

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  context?: string
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        logError(error, `${context} - Final attempt failed`);
        throw error;
      }
      
      logError(error, `${context} - Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}