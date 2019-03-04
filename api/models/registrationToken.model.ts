import { CosmosDBDocument } from './cosmosDBDocument.model';

/*
 * Represents a document in the Users collection in CosmosDB.
 */
export class RegistrationToken extends CosmosDBDocument {
    public registrationToken: string;
    public isUsed: boolean;
}
