import { useEffect, useState } from "react";
import { areasService } from "@/services/areas.service";
import { Area } from "@/types/area.type";

export function useAreas() {
    const [areas, setAreas] = useState<Area[]>([]);
    const [areasLoading, setIsAreasLoading] = useState(true);

    const fetchAreas = async () => {
        try {
            const area = await areasService.list();
            setAreas(area.data);
        } catch(e){
            console.error('error al cargar areas', e);
        }finally{
        setIsAreasLoading(false);
            }
    };
    
    useEffect(() => {
        fetchAreas();
    }, []);

    return {areas, areasLoading};
}