
'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MaintenanceTask {
  id: string;
  name: string;
  nextMaintenanceDate: Date;
  daysUntilMaintenance: number;
  isOverdue: boolean;
}

interface UpcomingMaintenanceProps {
    maintenanceList: MaintenanceTask[] | null;
}

export default function UpcomingMaintenance({ maintenanceList }: UpcomingMaintenanceProps) {
  
  const getStatusBadge = (days: number) => {
    if (days < 0) return <Badge variant="destructive">Vencido</Badge>;
    if (days <= 30) return <Badge variant="secondary" className="bg-yellow-500 text-black">Próximo</Badge>;
    return <Badge variant="default">Programado</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Próximos Mantenimientos</CardTitle>
        <CardDescription>Equipos que requieren mantenimiento preventivo.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TooltipProvider>
            {maintenanceList === null ? (
                <p className="text-sm text-muted-foreground text-center">Calculando...</p>
            ) : maintenanceList.length > 0 ? (
                maintenanceList.map((asset) => (
                <div className="flex items-center gap-4" key={asset.id}>
                    {asset.isOverdue && (
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mantenimiento Vencido</p>
                            </TooltipContent>
                        </Tooltip>
                    )}
                     {!asset.isOverdue && (
                        <div className="bg-primary rounded-full h-2 w-2 mt-1 shrink-0" />
                     )}
                    <div className="grid gap-1 flex-1">
                        <p className="text-sm font-medium leading-none truncate">
                            {asset.name} ({asset.id})
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Próximo Mant: {format(asset.nextMaintenanceDate, 'dd LLL, yyyy', { locale: es })}
                        </p>
                    </div>
                    <div className="ml-auto">
                        {getStatusBadge(asset.daysUntilMaintenance)}
                    </div>
                </div>
                ))
            ) : (
                <p className="text-sm text-muted-foreground text-center">No hay mantenimientos próximos.</p>
            )}
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
