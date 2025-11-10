"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const carwash_1 = __importDefault(require("./routes/carwash"));
const app = new hono_1.Hono();
app.route('/carwash', carwash_1.default);
app.get('/', (c) => c.text('Thee Bazaar Carwash API'));
exports.default = app;
