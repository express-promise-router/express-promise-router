---
"express-promise-router": patch
---

Fixes a bug introduced when setting the handler context on nested routes in which New Relic would incorrectly log API transaction names
