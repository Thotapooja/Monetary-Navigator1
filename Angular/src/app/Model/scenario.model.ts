import { Guid } from "guid-typescript";

export interface Scenario{
    scenarioId:number;
    scenarioName:string;
    organisationId:Guid;
    tax:number;
    startYear:number;
    forecastPeriod:number;
    marketSize:number;
    sam:number;
    tam:number;
    som:number;
}