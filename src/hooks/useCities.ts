import { useEffect, useState } from "react";
import { citiesService } from "@/services/cities.service";
import { City } from "@/types/city.type";

export function useCities() {
    const [cities, setCities] = useState<City[]>([]);
    const [citiesLoading, setIsCitiesLoading] = useState(true);

    const fetchAreas = async () => {
        try {
            const area = await citiesService.list();
            setCities(area.data);
        } catch(e){
            console.error('error al cargar areas', e);
        }finally{
        setIsCitiesLoading(false);
            }
    };
    
    useEffect(() => {
        fetchAreas();
    }, []);

    return {cities, citiesLoading};
}