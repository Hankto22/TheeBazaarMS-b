import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import carwashRoutes from './routes/carwash';

const app = new Hono();

app.use('*', cors({
  origin: "https://thee-bazaar-ms.vercel.app",
  credentials: true
}));

app.route('/carwash', carwashRoutes);

app.get('/', (c) => c.text('Thee Bazaar Carwash API'));

const port = process.env.PORT || 8080;

serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`Server is running on http://localhost:${port}`);