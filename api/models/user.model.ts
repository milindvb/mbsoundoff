import { CosmosDBDocument } from './cosmosDBDocument.model';

/*
 * Represents a document in the Users collection in CosmosDB.
 */
export class User extends CosmosDBDocument {
    public userName: string;
    public password: string;
    public zipCode: string;
    public tokenId: string;
    public initialSystemRegistration: Date;
    public isLegalBoxesChecked: string;
    public initialOutreachBB: Date;
    public outreachResponseBB: Date;
    public initialOutreachClinician: string;
    public outreachResponseClinician: string;
    public callLogId: string;
    public textLogId: string;
    public scheduledAppointmentLogId: string;
    public scheduledCancelLogId: string;
    public surveyDataId: string;
    public dropProcessData: string;
}
