'use strict';
const express = require('express');
const cors = require('cors');
const { rateLimiter, getStats } = require('./middleware/rateLimiter');

const app = express();
app.use(cors()); app.use(express.json());

// Apply rate limiter globally
app.use(rateLimiter({ windowMs: 60000, max: 30, blockDuration: 300000, whitelist: ['127.0.0.1', '::1'], message: 'Demasiados pedidos. IP bloqueado por 5 minutos.' }));

// Strict limit for sensitive endpoints
const authLimiter = rateLimiter({ windowMs: 900000, max: 10, blockDuration: 3600000, message: 'Demasiadas tentativas. IP bloqueado por 1 hora.' });

app.get('/', (req, res) => res.json({ service: 'Rate Limiter API', ip: req.ip, headers: { limit: res.getHeader('X-RateLimit-Limit'), remaining: res.getHeader('X-RateLimit-Remaining') } }));

app.post('/api/login', authLimiter, (req, res) => res.json({ message: 'Login endpoint protegido por rate limit estrito (10 req/15min).' }));

app.get('/api/stats', (req, res) => res.json(getStats()));

app.get('/api/data', (req, res) => res.json({ data: 'Dados da API', timestamp: new Date().toISOString() }));

app.listen(3000, () => console.log('⛔ Rate Limiter API em http://localhost:3000'));
