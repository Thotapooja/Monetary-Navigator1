import { Guid } from "guid-typescript";
import { OtherRevenueValues } from "./otherRevenueValues.model";

export interface OtherRevenue{
    otherRevenueId:number;
    scenarioId:number;
    organisationId:Guid;
    revenueCategory:string;
    revenueName:string;
    startYear:number;
    startMonth:number;
    revenueinStartMonth:number;
    frequencyClientIncr:string;
    perClientIncr:number;
    daysPaid:number;
    assumptions:string;
}
export class OtherRevenueDetails{
    otherRevenueId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    revenueCategory!: string;
    revenueName!: string;
    startYear!: number;
    startMonth!: number;
    revenueinStartMonth!: number;
    frequencyClientIncr!: string;
    perClientIncr!: number;
    daysPaid!: number;
    assumptions!: string;
    disable!:boolean;
    otherRevenueValues!: OtherRevenueValues[];
}
export class OtherRevenueDetail{
    otherRevenueId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    revenueCategory!: string;
    revenueName!: string;
    startYear!: number;
    startMonth!: number;
    revenueinStartMonth!: number;
    frequencyClientIncr!: string;
    perClientIncr!: number;
    daysPaid!: number;
    assumptions!: string;
    otherRevenueValues!: OtherRevenueValues[];
    disable!: boolean;
}