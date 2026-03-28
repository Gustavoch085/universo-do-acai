/**
 * Security Middleware — Express/Node.js Reference Implementation
 *
 * This file documents enterprise-grade security patterns for the backend
 * API that would serve this application in production. Use with Express +
 * the listed packages: `npm i helmet express-rate-limit cors express-validator`
 *
 * NOT executed by the frontend bundle — for backend implementation reference.
 */

// ─── TYPE DEFINITIONS ─────────────────────────────────────────────────────────

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skipSuccessfulRequests?: boolean;
}

interface SecurityHeadersConfig {
  contentSecurityPolicy: boolean;
  crossOriginEmbedderPolicy: boolean;
  crossOriginOpenerPolicy: boolean;
  crossOriginResourcePolicy: boolean;
  dnsPrefetchControl: boolean;
  frameguard: boolean;
  hidePoweredBy: boolean;
  hsts: boolean;
  ieNoOpen: boolean;
  noSniff: boolean;
  originAgentCluster: boolean;
  permittedCrossDomainPolicies: boolean;
  referrerPolicy: boolean;
  xssFilter: boolean;
}

// ─── RATE LIMIT CONFIGURATIONS ────────────────────────────────────────────────

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  /** General API requests */
  api: {
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
  },

  /** Checkout endpoint — stricter to prevent order flooding */
  checkout: {
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: 'Limite de pedidos atingido. Aguarde 10 minutos.',
    skipSuccessfulRequests: false,
  },

  /** Coupon validation — prevents brute-force enumeration */
  coupon: {
    windowMs: 60 * 60 * 1000,
    max: 15,
    message: 'Limite de validação de cupons atingido.',
  },
};

// ─── EXPRESS MIDDLEWARE IMPLEMENTATIONS (Reference) ───────────────────────────

/**
 * @example
 * import express from 'express';
 * import helmet from 'helmet';
 * import rateLimit from 'express-rate-limit';
 * import cors from 'cors';
 *
 * const app = express();
 *
 * // 1. Secure HTTP headers (replaces ~20 manual header calls)
 * app.use(helmet(HELMET_CONFIG));
 *
 * // 2. General rate limiting
 * app.use('/api/', rateLimit(RATE_LIMITS.api));
 *
 * // 3. Strict rate limiting for checkout
 * app.use('/api/orders', rateLimit(RATE_LIMITS.checkout));
 *
 * // 4. CORS — restrict to known origins
 * app.use(cors(CORS_CONFIG));
 *
 * // 5. Body parsing with strict size limits (prevents large payload attacks)
 * app.use(express.json({ limit: '50kb' }));
 * app.use(express.urlencoded({ extended: true, limit: '50kb' }));
 */

export const HELMET_CONFIG: Partial<SecurityHeadersConfig> = {
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: true,
  xssFilter: true,
};

export const CORS_CONFIG = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    const ALLOWED_ORIGINS = new Set([
      'https://universodoacai.com.br',
      'https://www.universodoacai.com.br',
      ...(typeof window === 'undefined' ? ['http://localhost:5174'] : []),
    ]);

    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origem não permitida pela política CORS: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400,
};

// ─── ORDER VALIDATION SCHEMA (Reference — express-validator) ──────────────────

/**
 * @example
 * import { body, validationResult } from 'express-validator';
 *
 * export const validateOrderPayload = [
 *   ...ORDER_VALIDATION_RULES,
 *   (req, res, next) => {
 *     const errors = validationResult(req);
 *     if (!errors.isEmpty()) {
 *       return res.status(422).json({ errors: errors.array() });
 *     }
 *     next();
 *   },
 * ];
 */
export const ORDER_VALIDATION_RULES_REFERENCE = `
body('items').isArray({ min: 1, max: 20 }).withMessage('Items inválidos'),
body('items.*.productId').isString().trim().isLength({ min: 1, max: 50 }),
body('items.*.quantity').isInt({ min: 1, max: 50 }),
body('items.*.selectedToppingIds').isArray({ max: 10 }),
body('address.zipCode').matches(/^\\d{5}-?\\d{3}$/).withMessage('CEP inválido'),
body('address.state').isLength({ min: 2, max: 2 }).isAlpha(),
body('notes').optional().trim().isLength({ max: 300 }).escape(),
body('couponCode').optional().trim().toUpperCase().isAlphanumeric(),
`;

// ─── ANTI-TAMPERING: SERVER-SIDE PRICE VERIFICATION ──────────────────────────

/**
 * Critical: Never trust client-submitted prices.
 * Always recompute totals server-side from the canonical product catalog.
 *
 * @example
 * async function verifyOrderTotal(submittedItems, submittedTotal) {
 *   const serverTotal = await computeOrderTotal(submittedItems); // from DB
 *   const tolerance = 0.01; // floating point tolerance
 *   if (Math.abs(serverTotal - submittedTotal) > tolerance) {
 *     throw new PriceTamperingError('Preço inválido detectado.');
 *   }
 *   return serverTotal;
 * }
 */
export const SECURITY_NOTES = {
  priceTampering:
    'Frontend computes prices from immutable catalog (lib/catalog.ts). ' +
    'Backend MUST recompute independently and reject discrepancies.',
  jwtStrategy:
    'Use short-lived access tokens (15m) + refresh tokens (7d) stored in httpOnly cookies.',
  sqlInjection:
    'Use Prisma parameterized queries exclusively. Never build raw SQL with user input.',
  fileUploads:
    'Validate MIME type + magic bytes. Store in S3, never in process filesystem.',
} as const;
