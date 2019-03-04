import { queryContainer, upsertDocument } from '../services/cosmosDb.service';
import { getUser, upsertUser } from '../services/user.service';
import { RegistrationToken } from '../models/registrationToken.model';
import { User } from '../models/user.model';
import * as ExpressUtils from '../util/express.util';
import { Error } from '../models/error.model'

const containerId = "Tokens";

export async function getRegistrationToken() {

    var registrationToken = generateRegistrationToken();

    return queryRegistrationToken(registrationToken).then( (results) => {
        if(results.length === 0) {

            var regToken = new RegistrationToken();
            regToken.registrationToken = registrationToken;
            regToken.isUsed = false;
            // Save registration token to DB
            return upsertDocument(containerId, regToken, regToken.registrationToken).then((response) => {
                return registrationToken;
            })
        }
        else {
            return getRegistrationToken();
        }
    })
}

function generateRegistrationToken() {
    var tokenLength = 8;
    // JTR - Removed 0, 1, I, L, and O
    var chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    var registrationToken = "";

    for (let i = 0; i < tokenLength; i++) {
        registrationToken += chars[Math.floor(Math.random() * chars.length)]
    }

    return registrationToken;
};

async function queryRegistrationToken(registrationToken: string) {
    const querySpec = {
        query: "SELECT * FROM root r WHERE r.registrationToken=@registrationToken",
        parameters: [
            {name: "@registrationToken", value: registrationToken}
        ]
    };
    return queryContainer(containerId, querySpec);
}

export async function verifyToken(regToken, res) {
    return queryRegistrationToken(regToken)
    .then((result: Array<RegistrationToken>) => {
        console.debug("Got RegistrationToken array: ", JSON.stringify(result));

        if (!result || result.length === 0) {
            return ExpressUtils.logAndSendError(res, new Error('Could not retrieve RegistrationToken from the database.'));
        }

        if (result.length > 1) {
            return ExpressUtils.logAndSendError(res, new Error('Got multiple RegistrationTokens from the database.'));
        }
        
        var registrationToken = result[0];
        if (registrationToken.isUsed) {
            return ExpressUtils.logAndSendError(res, new Error('RegistrationToken has already been used.'));
        }

        return registrationToken;

        // JTR - Moving this logic, as we only want to mark the token used after the user is created
        // // update the Token document as used
        // registrationToken.isUsed = true;
        // upsertDocument(containerId, registrationToken, registrationToken.registrationToken)
        //     .then((result) => {
        //         console.debug("Saved registrationToken: ", JSON.stringify(result));

        //         res.send(result);
        //         // JTR - Removing this code for now as we don't want to associate a registration token with a user.
        //         // // get & update user with tokenId
        //         // getUser(req.body.userName)
        //         // .then((result: Array<User>) => {
        //         //     console.debug("Got User array: ", JSON.stringify(result));
    
        //         //     var user = new User();
        //         //     if (result && result.length === 1) {
        //         //         console.debug('Existing user found: ' + JSON.stringify(result[0]));
        //         //         user = result[0];
        //         //     } else {
        //         //         return ExpressUtils.logAndSendError(res, 'User could not be found.');
        //         //     }

        //         //     user.tokenId = registrationToken.id;
        //         //     upsertUser(res, user);
        //         // });
        //     })
        //     .catch((error) => {
        //         ExpressUtils.logAndSendError(res, new Error('Could not save the registrationToken to the database.'), error);
        //     });
    });  
}

export async function markTokenUsed(regToken, res) {

    return verifyToken(regToken, res).then((registrationToken: RegistrationToken) => {    
        // update the Token document as used
        console.log("regToken: ", registrationToken)
        if(registrationToken) {
            registrationToken.isUsed = true;
            return upsertDocument(containerId, registrationToken, registrationToken.registrationToken)
                .then((result) => {
                    console.debug("Saved registrationToken: ", JSON.stringify(result));
                    return result;
                })
                .catch((error) => {
                    return error;
                });
        }
    })
    
}