"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ExpandableKeywords({
  keywords,
}: {
  keywords: string[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = keywords.length > 8;

  return (
    <div className="flex flex-wrap gap-2">
      {(isExpanded ? keywords : keywords.slice(0, 8)).map((keyword: string) => (
        <Badge
          key={keyword}
          variant="secondary"
          className="rounded-full px-3 py-1.5 text-sm hover:bg-secondary/80 transition-colors cursor-pointer"
        >
          {keyword}
        </Badge>
      ))}
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors mt-1"
        >
          {isExpanded ? "Show Less" : `+${keywords.length - 8} more`}
        </button>
      )}
    </div>
  );
}
