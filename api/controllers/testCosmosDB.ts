import express from 'express';
import config from '../../config.json';
const CosmosClient = require('@azure/cosmos').CosmosClient;

const endpoint = config.COSMOSDB_ENDPOINT;
const masterKey = config.COSMOSDB_PRIMARYKEY;
const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

const databaseId = "soundoffdb";

export const testCosmosDB: express.RequestHandler = (req, res) => {

    readDatabase();
    readContainer("BattleBuddy");
    queryContainer("BattleBuddy");

    res.send('This is the test Cosmos DB route.');
}

async function readDatabase() {
    const { body: databaseDefinition } = await client.database(databaseId).read();
    console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

 async function readContainer(containerId) {
    const { body: containerDefinition } = await client.database(databaseId).container(containerId).read();
    console.log(`Reading full container:\n`, containerDefinition);
    console.log(`Reading container:\n${containerDefinition.id}\n`);
}

async function queryContainer(containerId) {
    console.log(`Querying container:\n${containerId}`);

    // query to return all children in a family
    const querySpec = {
        // query: "SELECT * FROM root r WHERE r.isLegalBoxesChecked=@isLegalBoxesChecked",
        // parameters: [{
        //     name: "@isLegalBoxesChecked",
        //     value: "Y"
        // }]
        query: "SELECT * FROM root",
        parameters: []
    };

    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery: true}).toArray()
        .catch( (error) => {
            console.log("Error! ", error);
        });
    for (var queryResult of results) {
        let resultString = JSON.stringify(queryResult);
        console.log(`\tQuery returned ${resultString}\n`);
    }
};