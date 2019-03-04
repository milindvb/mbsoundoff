import bcrypt from 'bcrypt';
import config from '../../config.json'; 
import { queryContainer, upsertDocument } from './cosmosDb.service';
import { User } from '../models/user.model';
import * as ExpressUtils from '../util/express.util';
import { Error } from '../models/error.model'

const containerId = "Users";

export async function upsertUser(user: User, res): Promise<any> {
    return upsertDocument(containerId, user, user.userName)
        .then((result) => {
            console.debug("Saved user: ", JSON.stringify(result));
            // if (res) {
            //     res.send(result);
            // }
            return result;
        })
        .catch((error) => {
            // return error;
            ExpressUtils.logAndSendError(res, 'Could not save the user to the database.', error);
        });
}

export async function upsertUserWithPassword(userName, password, res): Promise<any> {
    return getUser(userName)
    .then((result: Array<User>) => {
        console.debug("Got User array: ", JSON.stringify(result));

        var user = new User();
        if (result && result.length === 1) {
            console.debug('Existing user found: ' + JSON.stringify(result[0]));
            user = result[0];
        } else {
            user.userName = userName;
        }

        console.log("returning hash")
        let hashCompletePromise: Promise<any> = new Promise((resolve, reject) => {
            bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS, function(err, hash) {
                if (err) {
                    return ExpressUtils.logAndSendError(res, 'Error while hashing user.', err);
                    // reject(err);
                }
                user.password = hash;

                console.log("returning upsertuser promise")
                upsertUser(user, res).then((userResult) => {
                    console.log("returning upsertuser promise result")
                    // return userResult;
                    resolve(userResult);
                });
            });
        });

        return hashCompletePromise;
    });
}

export function verifyUserPassword(req, res) {
    getUser(req.body.userName)
    .then((result: Array<User>) => {
        console.debug("Got User array: ", JSON.stringify(result));

        if (!result || result.length === 0) {
            return ExpressUtils.logAndSendError(res, new Error('Could not retrieve user from the database.'));
        }

        if (result.length > 1) {
            return ExpressUtils.logAndSendError(res, new Error('Got multiple users from the database.'));
        }
        
        bcrypt.compare(req.body.password, result[0].password, function(err, compareResult) {
            if (compareResult === true) {
                console.debug('matched password');
                res.send(result[0]);
            } else {
                ExpressUtils.logAndSendError(res, new Error('Did not match password.'));
            }
        });
    });  
}

export async function getUser(userName: string) {
    const querySpec = {
        query: "SELECT * FROM Users WHERE Users.userName = @userName",
        parameters: [{
            name: "@userName", value: userName
        }]
    };
    return queryContainer(containerId, querySpec);
}