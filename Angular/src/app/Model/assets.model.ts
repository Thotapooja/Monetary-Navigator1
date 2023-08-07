import { Guid } from "guid-typescript";

export interface Assets{
    assetId:number;
    scenarioId:number;
    organisationId:Guid;
    name:string;
    assetType:number;
    purchaseYear:number;
    purchaseMonth:number;
    noofUnits:number;
    costsperUnit:number;
    usefulLifetime:number;
    residualValue:number;
    daystoPay:number;
    assumptions:string;
}
export class AssetsDetails{
    assetId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    name!: string;
    assetType!: number;
    purchaseYear!: number;
    purchaseMonth!: number;
    noofUnits!: number;
    costsperUnit!: number;
    usefulLifetime!: number;
    residualValue!: number;
    daystoPay!: number;
    assumptions!: string;
    assetValues!: any[];
    disable!:boolean;
}
export enum AssetValueType
{
    NoofUnits = 1,

    CostsperUnit = 2,

    TotalCosts = 3,

    Depreciation = 4,

    NoofDaystoPay = 5,

    AccountsPayable = 6,

    PrepaidExpenses = 7,

    CarryingAmount = 8
}