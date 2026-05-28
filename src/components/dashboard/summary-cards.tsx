import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive, Users, ClipboardList } from "lucide-react"
import { DashboardResponse } from "@/types/dashboard.types";

export default function SummaryCards({ totals }: Partial<DashboardResponse>) {
  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Activos Totales
          </CardTitle>
          <Archive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals?.assets}</div>
          <p className="text-xs text-muted-foreground">
            Activos en la empresa seleccionada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Usuarios</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals?.users}</div>
          <p className="text-xs text-muted-foreground">
            Usuarios en la empresa seleccionada
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Mantenimientos
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals?.maintenances}</div>
          <p className="text-xs text-muted-foreground">
            Mantenimientos registrados
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tareas pendientes
          </CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totals?.nextMaintenances}</div>
          <p className="text-xs text-muted-foreground">
            Mantenimientos proximos
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
