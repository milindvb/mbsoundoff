import express from 'express';
import { getRegistrationToken as getRegToken, verifyToken, markTokenUsed } from '../services/registrationToken.service';
import * as StringUtils from '../util/string.util';
import * as ExpressUtils from '../util/express.util';


export const getRegistrationToken: express.RequestHandler = (req, res) => {

    getRegToken().then((registrationToken) => {
        // console.log("controller returning token: ", registrationToken);
        res.send(registrationToken);
    });
}

export const verifyTokenRoute: express.RequestHandler = (req, res) => {
    if (StringUtils.isEmpty(req.body.registrationToken)) {
        return ExpressUtils.logAndSendError(res, 'Registration token is required.');
    }
    
    verifyToken(req.body.registrationToken, res).then((response) => {
        res.send(response);
    });
}
