import express from 'express'
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { validateRawCard } from './../validators/body';
import { signIn } from '../controllers/signIn';
import { signUp } from '../controllers/signUp';
import { getTwilioJwt } from '../controllers/getTwilioJwt';
import { getVirgilJwt } from '../controllers/getVirgilJwt';
import { testSignUp } from '../controllers/testSignUp';
import { testCosmosDB } from '../controllers/testCosmosDB';
import { getBattleBuddies } from '../controllers/battleBuddy.controller';
import { getTherapists } from '../controllers/therapists.controller';
import { getRegistrationToken, verifyTokenRoute } from '../controllers/registrationToken.controller';
import { validateAuth } from '../validators/auth';
import { validateIdentity } from '../validators/body';
import config from '../../config.json';
import { urlencoded } from 'body-parser';
import * as userRoutes from '../controllers/users.controller';
import { saveSurvey } from '../controllers/survey.controller';

// Twilio Voice integration
require('dotenv').load();

import { tokenGenerator as _tokenGenerator, makeCall as _makeCall, placeCall as _placeCall, incoming as _incoming, welcome as _welcome } from '../services/twilioVoice';
const tokenGenerator = _tokenGenerator;
const makeCall = _makeCall;
const placeCall = _placeCall;
const incoming = _incoming;
const welcome = _welcome;
// End Twilio Voice integration

// Set up Basic Auth
passport.use(new BasicStrategy(
    function(userId, password, done) {
        console.debug('in BasicStrategy middleware');
        if (userId === config.BASIC_AUTH_USER && password === config.BASIC_AUTH_PASSWORD) {
            console.debug('in BasicStrategy validated user password');
            // return user object
            return done(null, { userId: config.BASIC_AUTH_USER });
        } else {
            console.debug('in BasicStrategy got wrong user');
            return done(null, false);
        }
    }
));

const router = express.Router();

router.post('/signin', validateIdentity, signIn);
router.post('/signup', validateRawCard, signUp);
router.post('/get-virgil-jwt', validateAuth, validateIdentity, getVirgilJwt);
router.post('/get-twilio-jwt', validateAuth, validateIdentity, getTwilioJwt);
// Endpoint for testing Basic Auth
router.post('/test-sign-up', passport.authenticate('basic', { session: false }), testSignUp);

// Endpoint for testing Cosmos DB
router.post('/test-cosmos-db', passport.authenticate('basic', { session: false }), testCosmosDB)
router.post('/get-battle-buddies', passport.authenticate('basic', { session: false }), getBattleBuddies)
router.post('/get-therapists', passport.authenticate('basic', { session: false }), getTherapists)
router.post('/get-registration-token', passport.authenticate('basic', { session: false }), getRegistrationToken)
router.post('/get-new-username', passport.authenticate('basic', { session: false }), userRoutes.getNewUsername)
router.post('/save-survey', passport.authenticate('basic', { session: false }), saveSurvey);

// Twilio Voice integration
// parse application/x-www-form-urlencoded
router.use(urlencoded({ extended: false }))

router.get('/', function(request, response) {
    response.send(welcome());
});

router.post('/', function(request, response) {
    response.send(welcome());
});

router.get('/accessToken', function(request, response) {
    tokenGenerator(request, response);
});

router.post('/accessToken', function(request, response) {
    tokenGenerator(request, response);
});

router.get('/makeCall', function(request, response) {
    makeCall(request, response);
});

router.post('/makeCall', function(request, response) {
    makeCall(request, response);
});

router.get('/placeCall', placeCall);

router.post('/placeCall', placeCall);

router.get('/incoming', function(request, response) {
    response.send(incoming());
});

router.post('/incoming', function(request, response) {
    response.send(incoming());
});
// End Twilio Voice integration

// Endpoint for user creation with username and password
router.post('/user', passport.authenticate('basic', { session: false }), userRoutes.createUser);
router.post('/create-vsm-user', passport.authenticate('basic', { session: false }), userRoutes.createVSMUser);
// Endpoint for user login with username and password
router.post('/login', passport.authenticate('basic', { session: false }), userRoutes.loginUser);

router.post('/verify-registration-token', passport.authenticate('basic', { session: false }), verifyTokenRoute);


export default router;
