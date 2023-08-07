import { Guid } from "guid-typescript";

export interface Organisation{
    organisationId :Guid;
    name:string;
    website:string;
    sector:string;
    subSector:string;
    description:string;
    country:string;
    currency: string;
    foundedYear:any;
}
