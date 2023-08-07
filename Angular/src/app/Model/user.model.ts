import { Guid } from "guid-typescript";

export interface User{
    userId :Guid;
    userRoleId:string;
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    organisationId:Guid;
    userStatus:any;
    dateofBirth:Date;
    confirmPassword:string;
}
export interface Users{
    userId :string;
    userRoleId:string;
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    organisationId:string;
    userStatus:any;
    dateofBirth:Date;
    confirmPassword:string;
}
    