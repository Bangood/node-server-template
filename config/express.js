/**
 * Created by pure on 2017/8/30.
 */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';
import helmet from 'helmet';
const app = express();

// Parse HTTP request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Parse cookie header and populate req.cookies.
app.use(cookieParser());
// Compress HTTP responses.
app.use(compress());
// Override HTTP methods using header.
app.use(methodOverride());
// Enable cross-origin resource sharing (CORS) with various options.
app.use(cors());
// Helps secure your apps by setting various HTTP headers.
app.use(helmet());
export default app;