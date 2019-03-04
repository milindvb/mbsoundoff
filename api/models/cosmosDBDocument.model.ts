
/*
 * Represents a document in CosmosDB.
 * Contains common fields used by all documents.
 */
export class CosmosDBDocument {
    readonly id: string;
    readonly _rid: string;
    readonly _self: string;
    readonly _etag: string;
    readonly _attachments: string;
    readonly _ts: Date;
}
