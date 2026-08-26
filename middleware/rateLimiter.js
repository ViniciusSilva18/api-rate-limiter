'use strict';
const requests = new Map();
const blocked = new Map();

function rateLimiter({ windowMs = 60000, max = 100, blockDuration = 300000, whitelist = [], message = 'Demasiados pedidos. Tente novamente.' } = {}) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    if (whitelist.includes(ip)) return next();
    const now = Date.now();
    if (blocked.has(ip)) {
      const unblockAt = blocked.get(ip);
      if (now < unblockAt) {
        const remaining = Math.ceil((unblockAt - now) / 1000);
        return res.status(429).json({ error: `IP bloqueado por ${remaining} segundos.`, blockedUntil: new Date(unblockAt).toISOString() });
      }
      blocked.delete(ip);
    }
    if (!requests.has(ip)) requests.set(ip, []);
    const windowStart = now - windowMs;
    const reqs = requests.get(ip).filter(t => t > windowStart);
    reqs.push(now);
    requests.set(ip, reqs);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - reqs.length));
    res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
    if (reqs.length > max) {
      blocked.set(ip, now + blockDuration);
      return res.status(429).json({ error: message, retryAfter: Math.ceil(blockDuration / 1000) });
    }
    next();
  };
}

function getStats() {
  return { activeIps: requests.size, blockedIps: blocked.size, ips: [...requests.entries()].map(([ip, reqs]) => ({ ip, requests: reqs.length, blocked: blocked.has(ip) })) };
}

module.exports = { rateLimiter, getStats };
