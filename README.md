<div align="center">

# ⛔ API Rate Limiter — Inteligente por IP

**Middleware de rate limiting com bloqueio por IP, whitelist, headers HTTP e estatísticas em tempo real.**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Security](https://img.shields.io/badge/Security-Rate_Limiting-f43f5e?style=for-the-badge)]()

</div>

## ✨ Funcionalidades
- 🔢 Limite configurável de requests por janela de tempo
- 🚫 Bloqueio automático de IPs que excedem o limite
- ✅ Whitelist de IPs de confiança
- 📊 Headers HTTP padrão (X-RateLimit-*)
- 📈 Endpoint de estatísticas em tempo real
- 🔒 Limits diferentes por rota (global vs. auth)

## 🛠️ Setup
```bash
npm install && npm run dev
# GET / para ver o rate limit a funcionar
# GET /api/stats para ver estatísticas
```

---
<sub>Criado por <a href="https://github.com/ViniciusSilva18">ViniciusSilva18</a> — VibeCoder 🇵🇹</sub>
