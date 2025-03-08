import { Request, Response, NextFunction } from "express";

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // -> Disable X-Powered-By
    req.app.disable('x-powered-by');

    // -> Disable Frame Embedding
    const iframePolicy = process.env.IFRAME_POLICY || 'deny'; // default: deny
    res.set('X-Frame-Options', iframePolicy);

    // -> Re-enable XSS Filter if disabled
    res.set('X-XSS-Protection', '1; mode=block');

    // -> Disable MIME-sniffing
    res.set('X-Content-Type-Options', 'nosniff');

    // -> Disable IE Compatibility Mode
    res.set('X-UA-Compatible', 'IE=edge');

    // -> Referrer Policy
    const referrerPolicy = process.env.REFERRER_POLICY || 'strict-origin-when-cross-origin';
    res.set('Referrer-Policy', referrerPolicy);

    // -> Content Security Policy (CSP)
    const cspDirectives = process.env.CSP_DIRECTIVES || "default-src 'self'";
    res.set('Content-Security-Policy', cspDirectives);

    return next();
};
