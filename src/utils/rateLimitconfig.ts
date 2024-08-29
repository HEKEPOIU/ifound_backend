import rateLimit from "express-rate-limit";

// 1000 request per 15 minutes.
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Reach the request limit."
})

export { limiter }
