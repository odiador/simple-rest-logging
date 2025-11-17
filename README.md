# simple-rest-logging
## API de logs

Esta aplicación incluye una pequeña API para registrar y consultar logs en MongoDB.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API de logs

Esta aplicación incluye una pequeña API para registrar y consultar logs en MongoDB.

Variables de entorno necesarias:

- `MONGODB_URI` - URI de conexión a MongoDB Atlas (p.ej. mongodb+srv://admin:<password>@cluster0...)
- `MONGODB_DB` - (opcional) nombre de la base de datos; por defecto `saclogs`

Rutas disponibles (App Router):

- POST /api/logs
	- Body JSON: { message: string, level?: string, meta?: object, timestamp?: string, usuario_accion?, tabla_afectada?, accion?, detalle?, ip_origen?, sesion_id? }
	- Retorna 201 { insertedId }

- GET /api/logs?start=<ISO>&end=<ISO>&level=<level>&limit=<n>
	- Devuelve { count, logs }

Ejemplos:

curl para crear un log con campos de auditoría:

```bash
curl -X POST http://localhost:3000/api/logs \
	-H "Content-Type: application/json" \
	-d '{
		"message":"Prueba",
		"level":"info",
		"meta":{"user":"alice"},
		"usuario_accion":"alice",
		"tabla_afectada":"orders",
		"accion":"CREATE",
		"detalle":"Creación de pedido 1234",
		"ip_origen":"192.0.2.1",
		"sesion_id":"abcd-1234"
	}'
```

curl para consultar por rango:

```bash
curl "http://localhost:3000/api/logs?start=2025-01-01T00:00:00Z&end=2025-12-31T23:59:59Z"
```
