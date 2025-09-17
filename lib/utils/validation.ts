/**
 * Input validation and sanitization utilities
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Validate and sanitize email addresses
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeHtml(email.trim().toLowerCase());
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return {
    isValid: emailRegex.test(sanitized) && sanitized.length <= 254,
    sanitized,
  };
}

/**
 * Validate and sanitize phone numbers
 */
export function validatePhone(phone: string): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeHtml(phone.replace(/\D/g, ''));
  const phoneRegex = /^[\d\-\+\(\)\s]{10,15}$/;
  
  return {
    isValid: phoneRegex.test(phone) && sanitized.length >= 10 && sanitized.length <= 15,
    sanitized,
  };
}

/**
 * Validate and sanitize URLs
 */
export function validateUrl(url: string): { isValid: boolean; sanitized: string } {
  const sanitized = sanitizeHtml(url.trim());
  
  try {
    const urlObj = new URL(sanitized);
    const allowedProtocols = ['http:', 'https:'];
    
    return {
      isValid: allowedProtocols.includes(urlObj.protocol),
      sanitized,
    };
  } catch {
    return {
      isValid: false,
      sanitized: '',
    };
  }
}

/**
 * Validate and sanitize text input
 */
export function validateText(
  text: string,
  options: {
    minLength?: number;
    maxLength?: number;
    allowHtml?: boolean;
    required?: boolean;
  } = {}
): { isValid: boolean; sanitized: string; errors: string[] } {
  const { minLength = 0, maxLength = 1000, allowHtml = false, required = false } = options;
  const errors: string[] = [];
  
  if (typeof text !== 'string') {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Input must be a string'],
    };
  }

  let sanitized = allowHtml ? text.trim() : sanitizeHtml(text.trim());
  
  if (required && sanitized.length === 0) {
    errors.push('This field is required');
  }
  
  if (sanitized.length < minLength) {
    errors.push(`Must be at least ${minLength} characters long`);
  }
  
  if (sanitized.length > maxLength) {
    errors.push(`Must be no more than ${maxLength} characters long`);
    sanitized = sanitized.substring(0, maxLength);
  }

  return {
    isValid: errors.length === 0,
    sanitized,
    errors,
  };
}

/**
 * Validate file uploads
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}
): { isValid: boolean; errors: string[] } {
  const { 
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
  } = options;
  
  const errors: string[] = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    errors.push(`File extension ${extension} is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Rate limiting check (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);

  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: maxRequests - 1, resetTime };
  }

  if (existing.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime };
  }

  existing.count += 1;
  rateLimitMap.set(identifier, existing);

  return {
    allowed: true,
    remaining: maxRequests - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Sanitize object data recursively
 */
export function sanitizeObject(obj: any, allowHtml: boolean = false): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return allowHtml ? obj : sanitizeHtml(obj);
  }

  if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, allowHtml));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeHtml(key);
      sanitized[sanitizedKey] = sanitizeObject(value, allowHtml);
    }
    return sanitized;
  }

  return obj;
}