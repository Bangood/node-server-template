/**
 * Created by pure on 2017/8/30.
 */
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
const app = express();

// Parse HTTP request body.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Parse cookie header and populate req.cookies.
app.use(cookieParser());
export default app;