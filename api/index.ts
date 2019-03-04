import express from "express";
import router from "./routes";
import { setupPushNotifications } from './services/twilio';

const enableCors: express.RequestHandler = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
};

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
    res.status(500);
    res.json({ error: err });
    // res.render("error", { error: err });
};

const app = express();

app.use(enableCors);
app.use(express.json());
app.use('/', router);
app.use(errorHandler);

// Set up Twilio push notifications
setupPushNotifications();

export default app;
