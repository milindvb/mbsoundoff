import express from 'express';
import {queryContainer} from '../services/cosmosDb.service'
import { Therapist } from '../models/therapist.model';

const containerID = "Clinician";

export const getTherapists: express.RequestHandler = (req, res) => {
    const querySpec = {
        query: "SELECT * FROM root",
        parameters: []
    };
    queryContainer(containerID, querySpec)
    .then((results) => {
        // console.log("Returning Therapists: ", results);
        let therapists = new Array<Therapist>();
        results.forEach(result => {
            let t: Therapist = new Therapist()
            t.firstName = result.firstName;
            t.lastName = result.lastName;
            t.suffix = result.suffix;
            t.freeText = result.freeText;
            therapists.push(t);
        });
        res.send(therapists);
    });
}