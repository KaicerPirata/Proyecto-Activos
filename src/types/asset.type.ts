import { License, Model, Component } from "./catalog.type";
import { Area } from "./area.type";
import { Company } from "./company.types";
import { RegistBy } from "./user.types";

export interface AssetList {
    assetId: number,
    internalId: string,
    model: string,
    category: string,
    company: string,
    status: string,
}

export interface RemovedList {
    assetId: number,
    internalId: string,
    model: string,
    category: string,
    removalDate: Date,
    reason: string
}

export type AssetCategory = | 'LAP'| 'SFF' | 'TORR' | 'MON' | 'UPS';

export interface DetailedAsset {
    assetId: number,
    id: string,
    model: Model,
    area: Area,
    categoryId: AssetCategory,
    category: string, 
    company: Company,
    status: string,
    serialNumber: string,
    responsable: RegistBy | null, 
    purchaseDate: Date,
    invoice: string,
    networkName?: string | null,
    processor?: {id: number, name: string} | null,
    details?: string,
    ram?: Component[] | [],
    storage?: Component[] | [],
    osLicense?: License,
    officeLicense?: License
}