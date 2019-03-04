import config from '../../config.json';
import { CosmosDBDocument } from '../models/cosmosDBDocument.model';

const CosmosClient = require('@azure/cosmos').CosmosClient;

const client = new CosmosClient({ endpoint: config.COSMOSDB_ENDPOINT, auth: { masterKey: config.COSMOSDB_PRIMARYKEY } });
const databaseId = config.COSMOSDB_DB_ID;

export async function queryContainer(containerId, querySpec) {
    const { result: results } = await client.database(databaseId).container(containerId).items.query(querySpec, {enableCrossPartitionQuery: true}).toArray()
        .catch( (error) => {
            console.log("Error! ", error);
        });
    // for (var queryResult of results) {
    //     let resultString = JSON.stringify(queryResult);
    //     console.log(`\tQuery returned ${resultString}\n`);
    // }
    return results;
};

export async function upsertDocument(containerId: string, document: CosmosDBDocument, partitionKey?: string) {
    const reqOptions = {
        partitionKey: partitionKey
    };
    const { body: upsertedDocument } = await client.database(databaseId).container(containerId).items.upsert(document, reqOptions);

    return upsertedDocument;
};