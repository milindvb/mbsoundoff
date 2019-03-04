import { jwt } from "twilio";
import config from '../../config.json';

const AccessToken = jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const chatGrant = new ChatGrant({
    serviceSid: config.TWILIO_CHAT_SERVICE_SID,
    pushCredentialSid: config.TWILIO_CHAT_PUSH_CREDENTIAL_SID.SANDBOX
});

export const generateTwilioJwt = (identity: string) => {
    const token = new AccessToken(
        config.TWILIO_ACCOUNT_SID,
        config.TWILIO_CHAT_API_KEY,
        config.TWILIO_CHAT_API_SECRET
    );

    // tslint:disable-next-line:no-any
    (token as any).identity = identity;
    token.addGrant(chatGrant);

    return token;
}

export const setupPushNotifications = () => {
    const client = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_KEY);

    client.chat.services(config.TWILIO_CHAT_SERVICE_SID)
        .update({
            'notifications.newMessage.enabled': true,
            'notifications.newMessage.sound': 'default',
            'notifications.newMessage.template': 'You have a new message from ${USER}',
            'notifications.newMessage.badgeCountEnabled': true,
        })
        .then(service => console.log(service.friendlyName))
        .done();
}