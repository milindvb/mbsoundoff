import express from 'express';
import {queryContainer} from '../services/cosmosDb.service'

const battleBuddyContainerID = "BattleBuddy";

export const getBattleBuddies: express.RequestHandler = (req, res) => {

    const querySpec = {
        query: "SELECT * FROM root",
        parameters: []
    };
    queryContainer(battleBuddyContainerID, querySpec)
    .then((result) => {
        console.log("Returning Battle Buddies: ", result);
        res.send(result);
    });
}