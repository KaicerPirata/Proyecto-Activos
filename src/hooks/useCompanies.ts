import { useEffect, useState } from "react";
import { companiesService } from "@/services/companies.service";
import { Company } from "@/types/company.types";

export function useCompanies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [companiesLoading, setIsCompaniesLoading] = useState(true);

    const fetchCompanies = async () => {
            try {
                const compRes = await companiesService.list();
                setCompanies(compRes);
            }catch (e){
                console.error("Error loading companies: ", e);
            }finally{
                setIsCompaniesLoading(false);
            }
    };
    
    useEffect(() => {
        fetchCompanies();
    }, []);

    return {companies, companiesLoading};
}