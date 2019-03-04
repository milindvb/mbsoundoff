import { CosmosDBDocument } from './cosmosDBDocument.model';

/*
 * Represents a document in the Surveys collection in CosmosDB.
 */
export class Survey extends CosmosDBDocument {
    public id: string;
    public userId: string;
    public surveyId: string;
    public surveyData: string;
    public surveyDate: Date;
}
