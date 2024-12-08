"use client";

import { useState } from "react";
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/stat-card";

const data = [
  { month: "Jan", downloads: 4000, trend: 3800 },
  { month: "Feb", downloads: 3000, trend: 3300 },
  { month: "Mar", downloads: 3500, trend: 3400 },
  { month: "Apr", downloads: 2800, trend: 3000 },
  { month: "May", downloads: 3800, trend: 3600 },
  { month: "Jun", downloads: 3600, trend: 3500 },
  { month: "Jul", downloads: 3200, trend: 3300 },
  { month: "Aug", downloads: 3400, trend: 3400 },
  { month: "Sep", downloads: 3300, trend: 3450 },
  { month: "Oct", downloads: 4200, trend: 3800 },
  { month: "Nov", downloads: 3600, trend: 3600 },
  { month: "Dec", downloads: 3400, trend: 3400 },
];

export function DownloadChart() {
  const [timeRange, setTimeRange] = useState("year");

  const filteredData = data.slice(
    0,
    timeRange === "year" ? 12 : timeRange === "6months" ? 6 : 3
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Total Downloads"
          value="25,450"
          change={"+12.5%"}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value="10,283"
          change={"+5.2%"}
          trend="up"
        />
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-6">
          <div>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Download Analytics
            </CardTitle>
            <CardDescription className="text-2xl font-bold">
              {filteredData
                .reduce((sum, item) => sum + item.downloads, 0)
                .toLocaleString()}{" "}
              Downloads
            </CardDescription>
          </div>
          <Select defaultValue={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px] sm:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar
                  dataKey="downloads"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  name="Downloads"
                />
                <Line
                  type="monotone"
                  dataKey="trend"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={false}
                  name="Trend"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
