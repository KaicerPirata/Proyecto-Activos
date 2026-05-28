export interface DashboardTotals {
    assets: number;
    users: number;
    maintenances: number;
    nextMaintenances: number;
}

export interface AssetByArea {
    area: string;
    total: number;
}

export interface UpcomingMaintenance {
    assetType: string,
    model: string,
    internalId: string,
    nextMaintenance: string; //string ISO
}

export interface DashboardResponse {
    totals: DashboardTotals;
    upcomingMaintenances: UpcomingMaintenance[];
    assetsByArea: AssetByArea[]; 
}

