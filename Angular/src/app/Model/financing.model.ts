import { Guid } from "guid-typescript";

export interface Financing{
    financingId:number;
    scenarioId:number;
    organisationId:Guid;
    name:string;
    financingType:number;
    startYear:number;
    startMonth:number;
    financingAmount:number;
    interestperYear:number;
    payback:number;
    residualValue:number;
    financingPeriodMonths:number;
    assumptions:string;
}
export class FinancingDetails{
    financingId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    name!: string;
    financingType!: number;
    startYear!: number;
    startMonth!: number;
    financingAmount!: number;
    interestperYear!: number;
    payback!: number;
    residualValue!: number;
    financingPeriodsMonths!: number;
    assumptions!: string;
    financingValues!: any[];
    disable!:boolean;
}
export enum Equity
{
    AmountRecieved = 1
}
export enum Subsidy
{
    AmountRecieved = 1
}
export enum Loan
{
    AmountRecieved = 1,
    PaybackAmount = 2,
    LoanOutstanding = 3,
    InterestRate = 4,
    InterestExpense = 5
}