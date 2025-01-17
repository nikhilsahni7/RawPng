"use client";

import { useState } from "react";

export default function ExpandableDescription({
  description,
}: {
  description: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > 200;

  return (
    <div className="space-y-3">
      <p className="text-base leading-relaxed text-muted-foreground">
        {isExpanded
          ? description
          : shouldTruncate
            ? `${description.slice(0, 200)}...`
            : description}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}
