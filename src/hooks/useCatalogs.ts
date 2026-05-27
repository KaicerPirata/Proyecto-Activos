import { useEffect, useState } from "react";
import { catalogService } from "@/services/catalog.service";
import { Component } from "@/types/catalog.type";

export function useCatalogs() {
  const [memories, setMemories] = useState<Component[]>([]);
  const [disks, setDisks] = useState<Component[]>([]);
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [memRes, diskRes, licRes] = await Promise.all([
          catalogService.getMemories(),
          catalogService.getDisks(),
          catalogService.getLicenses(),
        ]);

        setMemories(memRes.data);
        setDisks(diskRes.data);
        setLicenses(licRes);
      } catch (e) {
        console.error("Error loading catalogs", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  return { memories, disks, licenses, loading };
}