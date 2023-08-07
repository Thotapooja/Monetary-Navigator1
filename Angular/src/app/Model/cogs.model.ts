import { Guid } from "guid-typescript";

export interface Cogs{
    cogsId:number;
    revenueId:number;
    scenarioId:number;
    organisationId:Guid;
    name:string;
    startYear:number;
    startMonth:number;
    costsInStartMonth:number;
    monthlyCostChange:number;
    daystoPay:number;
    inventoryDays:number;
    assumptions:string;
}
export class CogsDetails{
    cogsId!:number;
    revenueId!: number;
    scenarioId!:number;
    organisationId!:Guid;
    name!:string;
    startYear!:number;
    startMonth!:number;
    costsInStartMonth!:number;
    monthlyCostChange!:number;
    daystoPay!:number;
    inventoryDays!:number;
    assumptions!:string;
    disable!:boolean;
    cogsValues!: any[];
}
export class CogsList{
    cogsId!:number;
    revenueId!: number;
    scenarioId!:number;
    organisationId!:Guid;
    name!:string;
    startYear!:number;
    startMonth!:number;
    costsInStartMonth!:number;
    monthlyCostChange!:number;
    daystoPay!:number;
    inventoryDays!:number;
    assumptions!:string;
    cogsValues!: any[];
    disable!:boolean;
}