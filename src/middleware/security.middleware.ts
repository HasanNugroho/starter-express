import { Request, NextFunction, Response } from "express"

export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // -> Disable X-Powered-By
    req.app.disable('x-powered-by')

    // -> Disable Frame Embedding
    if (!process.env.IFRAME) {
        res.set('X-Frame-Options', 'deny')
    }

    // -> Re-enable XSS Fitler if disabled
    res.set('X-XSS-Protection', '1; mode=block')

    // -> Disable MIME-sniffing
    res.set('X-Content-Type-Options', 'nosniff')

    // -> Disable IE Compatibility Mode
    res.set('X-UA-Compatible', 'IE=edge')

    // -> Disables referrer header when navigating to a different origin
    if (!process.env.REFERRER_POLICY) {
        res.set('Referrer-Policy', 'same-origin')
    }

    return next()
}