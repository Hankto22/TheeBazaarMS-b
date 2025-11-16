import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import carwashRoutes from './routes/carwash';

const app = new Hono();

app.use('*', cors());

app.route('/carwash', carwashRoutes);

app.get('/', (c) => c.text('Thee Bazaar Carwash API'));

const port = process.env.PORT || 5000;

serve({
  fetch: app.fetch,
  port: Number(port),
});

console.log(`Server is running on http://localhost:${port}`);