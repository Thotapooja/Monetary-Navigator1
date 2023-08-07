import { Guid } from "guid-typescript";

export interface RevenueValues{
    revenueValueId: number;
    revenueId: number;
    scenarioId: number;
    year: number;
    month: number;
    valueType: number;
    revenueValue: number;
    total: number;
}