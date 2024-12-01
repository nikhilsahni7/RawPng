"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeFilterProps {
  onPeriodChange: (period: string) => void;
}

export function TimeFilter({ onPeriodChange }: TimeFilterProps) {
  return (
    <Select defaultValue="lifetime" onValueChange={onPeriodChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select time period" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="lifetime">Lifetime</SelectItem>
        <SelectItem value="year">This Year</SelectItem>
        <SelectItem value="6months">Last 6 Months</SelectItem>
        <SelectItem value="3months">Last 3 Months</SelectItem>
        <SelectItem value="month">This Month</SelectItem>
        <SelectItem value="today">Today</SelectItem>
      </SelectContent>
    </Select>
  );
}
