import express from 'express';
import { getNewUsername as getNewUN } from '../services/username.service'
import { verifyUserPassword, upsertUserWithPassword } from '../services/user.service';
import { markTokenUsed } from '../services/registrationToken.service'
import * as StringUtils from '../util/string.util';
import * as ExpressUtils from '../util/express.util';
import { VeteranServiceMember } from '../models/veteranServiceMember.model';
import config from '../../config.json';

export const createVSMUser: express.RequestHandler = (req, res) => {

    getNewUN().then((newUsername) => {
        req.body.userName = newUsername;

        if (StringUtils.isEmpty(req.body.userName) || StringUtils.isEmpty(req.body.password)) {
            return ExpressUtils.logAndSendError(res, 'User name and password are required.');
        }
    
        upsertUserWithPassword(req.body.userName, req.body.password, res).then((createUserResult) => {
            console.log("User created, marking token")
            if(createUserResult.userName != null) {
                if(config.DEVELOPMENT_MODE && req.body.regTokenBypass) {
                    console.log("Bypassing marking registration token");
                    var newVSM = new VeteranServiceMember();
                    newVSM.username = createUserResult.userName;
                    res.send(newVSM);
                    return;
                }
                markTokenUsed(req.body.registrationToken, res).then((regTokenResult) => {
                    if(regTokenResult && regTokenResult.registrationToken) {
                        var newVSM = new VeteranServiceMember();
                        newVSM.username = createUserResult.userName;
                        res.send(newVSM);
                    }
                    else {
                        ExpressUtils.logAndSendError(res, new Error('Could not save the registrationToken to the database.'), regTokenResult);
                    }
                })
            }
            else {
                ExpressUtils.logAndSendError(res, new Error('Could create user in the database.'), createUserResult);
            }
            
        });
    });    
}

export const createUser: express.RequestHandler = (req, res) => {
    if (StringUtils.isEmpty(req.body.userName) || StringUtils.isEmpty(req.body.password)) {
        return ExpressUtils.logAndSendError(res, 'User name and password are required.');
    }

    upsertUserWithPassword(req.body.userName, req.body.password, res).then((result) => {
        console.log("createUser: ", result);
        res.send(result);
    });
}

export const loginUser: express.RequestHandler = (req, res) => {
    if (StringUtils.isEmpty(req.body.userName) || StringUtils.isEmpty(req.body.password)) {
        return ExpressUtils.logAndSendError(res, 'User name and password are required.');
    }
    
    verifyUserPassword(req, res);
}

export const getNewUsername: express.RequestHandler = (req, res) => {

    getNewUN().then((newUsername) => {
        res.send(newUsername);
    });
}

