import { Guid } from "guid-typescript";

export interface Revenue{
    revenueId:number;
    scenarioId:number;
    organisationId:Guid;
    revenueCategory:string;
    revenueName:string;
    startYear:number;
    startMonth:number;
    clientsInStartMonth:number;
    unitsSoldperclientpermonth:number;
    frequencyClientIncr:string;
    perClientIncr:number;
    daysPaid:number;
    pricePerUnit:number;
    assumptions:string;
}
export class ProductDetails{
    revenueId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    revenueCategory!: string;
    revenueName!: string;
    startYear!: number;
    startMonth!: number;
    clientsInStartMonth!: number;
    unitsSoldperclientpermonth!: number;
    frequencyClientIncr!: string;
    perClientIncr!: number;
    daysPaid!: number;
    pricePerUnit!: number;
    assumptions!: string;
    revenueValues!: any[];
    disable!:boolean;
}
export class ProductDetail{
    revenueId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    revenueCategory!: string;
    revenueName!: string;
    startYear!: number;
    startMonth!: number;
    clientsInStartMonth!: number;
    unitsSoldperclientpermonth!: number;
    frequencyClientIncr!: string;
    perClientIncr!: number;
    daysPaid!: number;
    pricePerUnit!: number;
    assumptions!: string;
    revenueValues!: any[];
    disable!:boolean;
}