import { Area } from "./area.type";
import { Role } from "./auth.types";
import { Location } from "./location.type";
import { Company } from "./company.types";

export interface Rol {
    rolId: Role,
    rol: string
}

export interface RegistBy {
    userId: number,
    name: string
}

export interface ListUser {
    initials: string,
    userId: number,
    name: string,
    email: string,
    company: string,
    rol: string,
    status: string
}

export interface DetailedUser {
    //userId: number,
    cedula: number,
    rolId: string,
    firstname: string,
    middlename: string,
    lastname: string,
    secondLastname: string,   
    email: string,
    registDate: Date,
    companyId: number,
    cityId: string,
    areaId: number,
    locationId: number,
    status: string
  };

  export interface FormUser {
    userId: number,
    firstname: string,
    middlename: string,
    lastname: string,
    s_lastname: string
  }

