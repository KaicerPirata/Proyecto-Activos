import { City } from "./city.type";

export interface Location {
    locationId: number,
    companyId: number,
    cityId: string,
    locationName: string,
    city: City
}