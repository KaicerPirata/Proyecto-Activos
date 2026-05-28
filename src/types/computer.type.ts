import { RegistBy } from "./user.types"


export interface License {
    licenseId: number,
    licenseKey: string,
    softwareType: string,
}

export interface Component {
    id: number
}

export interface ComputerList {
    computerId: number,
    internalId: string,
    model: string,
    category: string,
    company: string,
    status: string,
    isActive: boolean
}

export interface ApiComputer {
    computerId: number,
    id: string,
    modelId: number,
    name: string,
    categoryId: string,
    category: string,
    companyId: string,
    company: string,
    status: string,
    serialNumber: string,
    responsable: RegistBy,
    brand: string,
    model: string,
    processor: string,
    purchaseDate: string,
    invoiceNumber: string,
    areaId: number,
    area: string,
    ram: { id: number, internalId: number }[],
    storage: { id: number, internalId: number }[],
    osLicense: License,
    officeLicense: License
}

export interface formComputer {
    serialNumber: string,
    networkName: string,
    companyId: number,
    assetType: string,
    invoice: string,
    purchaseDate: string,
    internalId: string,
    areaId: number,
    modelId: number,
    assignedUser: number,
    memories: { id: number}[],
    disks: { id: number}[],
    licenses: { licenseId: number, licenseKey: string}[]
}

export interface RemovedComputer {
    id: number,
    internalId: string,
    name: string,
    category: string,
    removalDate: string,
    removalReason: string
}