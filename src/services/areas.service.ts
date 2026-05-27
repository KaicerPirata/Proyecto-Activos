import { api } from "@/lib/api.client";
import { Area } from "@/types/area.type"; 
import { DataResponse } from "@/types/paginate.type";

export const areasService = {
    list: () => api.get<DataResponse<Area>>('/areas')
};