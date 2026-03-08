# Lighthouse Reports

Всі Lighthouse-звіти зберігаємо тільки тут:

- `reports/lighthouse/mobile/<route>/`
- `reports/lighthouse/desktop/<route>/`

`<route>`:

- `home`
- `smm`
- `design`
- `web-develop`
- `thanks`
- `misc`

## Як запускати

1. Мобільний звіт:
```bash
npm run lh:mobile -- /smm
```

2. Десктопний звіт:
```bash
npm run lh:desktop -- /web-develop
```

За замовчуванням використовується:

- `LH_BASE_URL=http://127.0.0.1:4173`

Можна перевизначити:
```bash
LH_BASE_URL=http://127.0.0.1:5173 npm run lh:mobile -- /
```
