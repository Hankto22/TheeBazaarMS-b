"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const cors_1 = require("hono/cors");
const carwash_1 = __importDefault(require("./routes/carwash"));
const app = new hono_1.Hono();
app.use('*', (0, cors_1.cors)({
    origin: "https://thee-bazaar-ms.vercel.app",
    credentials: true
}));
app.route('/carwash', carwash_1.default);
app.get('/', (c) => c.text('Thee Bazaar Carwash API'));
const port = process.env.PORT || 8080;
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: Number(port),
});
console.log(`Server is running on http://localhost:${port}`);
