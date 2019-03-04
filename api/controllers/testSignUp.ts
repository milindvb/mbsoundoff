import express from 'express';


export const testSignUp: express.RequestHandler = (req, res) => {
    res.send('This is the test sign up route.');
}
