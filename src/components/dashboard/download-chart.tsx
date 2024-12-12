"use client";

import { useState, useEffect } from "react";
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

export function DownloadChart() {
  const [timeRange, setTimeRange] = useState("year");
  const [data, setData] = useState([]);
  const [totalDownloads, setTotalDownloads] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/downloads?timeRange=${timeRange}`);
        const result = await res.json();
        setData(result.data);
        setTotalDownloads(
          result.data.reduce(
            (sum: number, item: { downloads: number }) => sum + item.downloads,
            0
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [timeRange]);

  return (
    <div className="space-y-4">
      <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-2">
        <StatCard
          title="Total Downloads"
          value={totalDownloads.toLocaleString()}
          change=""
          trend="up"
        />
        <StatCard
          title="Active Users"
          value="10,283"
          change="+5.2%"
          trend="up"
        />
      </div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1 sm:space-y-0 pb-4">
          <div>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Download Analytics
            </CardTitle>
            <CardDescription className="text-xl font-bold">
              {totalDownloads.toLocaleString()} Downloads
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
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
        <CardContent className="pb-2">
          <div className="h-[200px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data}>
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
