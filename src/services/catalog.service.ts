import { api } from "@/lib/api.client";
import { Component } from "@/types/catalog.type";
import { DataResponse } from "@/types/paginate.type";

export interface License {
  licenseId: number;
  providerId: number;
  softwareType: "OFFI" | "SO";
  software: string;
  sofVersion: string;
}

export const catalogService = {
 
    search: (search: string) =>
        api.get<any>('/assets/catalog/models', {search}),
    getLicenses: () =>
        api.get<License[]>('/assets/catalog/licenses'),
    getMemories: () =>
        api.get<DataResponse<Component>>('/assets/catalog/memories'),
    getDisks: () =>
        api.get<DataResponse<Component>>('/assets/catalog/disks'),
};