import { api } from "@/lib/api.client";
import { City } from "@/types/city.type";
import { DataResponse } from "@/types/paginate.type";

export const citiesService = {
    list: () => api.get<DataResponse<City>>('/cities')
};