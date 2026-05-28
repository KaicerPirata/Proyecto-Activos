
"use client"

// import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
// import { AssetBinding } from "next/dist/build/webpack/loaders/get-module-build-info";

const chartConfig = {
  total: {
    label: "Activos",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

interface AssetsByArea {
  area: string;
  total: number;
}

interface AssetsChartProps {
    data: AssetsByArea[];
}

export default function AssetsChart({ data }: AssetsChartProps) {

  // const chartData = useMemo(() => {
  //   const departmentData: { [key: string]: number } = {};

  //   assets.forEach(asset => {
  //     const user = users.find(u => u.name === asset.responsable);
  //     // Fallback to 'Sin Asignar' if user not found or department not specified
  //     const department = user?.department || 'Sin Asignar';
  //     if (departmentData[department]) {
  //       departmentData[department]++;
  //     } else {
  //       departmentData[department] = 1;
  //     }
  //   });

  //   return Object.keys(departmentData).map(department => ({
  //     department,
  //     assets: departmentData[department]
  //   }));

  // }, [assets]);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Activos por Área</CardTitle>
        <CardDescription>Un resumen de la distribución de activos por área.</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="area"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" fill="var(--color-assets)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
