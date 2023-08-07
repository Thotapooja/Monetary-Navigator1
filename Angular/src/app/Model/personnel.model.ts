import { Guid } from "guid-typescript";

export interface Personnel{
    personnelId: number;
    scenarioId: number;
    organisationId: Guid;
    position: string;
    personnelType: number;
    startYear: number;
    startMonth: number;
    noofFTEs: number;
    grossSalary: number;
    perSalaryIncrease: number;
    additionalEmployeeCosts: number;
    assumptions: string;
}
export class PersonnelDetails{
    personnelId!: number;
    scenarioId!: number;
    organisationId!: Guid;
    position!: string;
    personnelType!: number;
    startYear!: number;
    startMonth!: number;
    noofFTEs!: number;
    grossSalary!: number;
    perSalaryIncrease!: number;
    additionalEmployeeCosts!: number;
    assumptions!: string;
    personnelValues!: any[];
    disable!:boolean;
}
export enum PersonnelValueType{
    NoofFTEs = 1,
    SalaryperFTE = 2,
    AddCostperSalary = 3,
    AddCostperFTE = 4,
    TotalCosts = 5
}