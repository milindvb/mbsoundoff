import express from 'express';
import bcrypt from 'bcrypt';
import config from '../../config.json'; 
import { User } from '../models/user.model';
import { queryContainer, upsertDocument } from '../services/cosmosDb.service'
import * as StringUtils from '../util/string.util';
import * as ExpressUtils from '../util/express.util';
import { Survey } from '../models/survey.model';

const surveyContainerID = "Surveys";

export const saveSurvey: express.RequestHandler = (req, res) => {
    console.log('controller returning token: ');

    console.log('survey data: ' + req.body);

    let s: Survey = new Survey()
    s.id = req.body.hash.toString();
    s.userId = '1';
    s.surveyId = '2';
    s.surveyDate = new Date();
    s.surveyData = req.body.questionResponses;

    upsertDocument(surveyContainerID, s, s.id)
            .then((result) => {
                console.debug("Saved user: ", JSON.stringify(result));
                res.send(result);      
            })
            .catch((error) => {
                logAndSendError(res, 'Could not save the survey to the database.', error);
            });
}

function logAndSendError(res, errorMsg, error?) {
    console.error(errorMsg, error);
    res.status(500).send(errorMsg);
}
