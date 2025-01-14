import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <span>←</span>
      </Button>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={currentPage}
          className="w-12 text-center border rounded-md p-1"
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value > 0 && value <= totalPages) {
              onPageChange(value);
            }
          }}
        />
        <span className="text-gray-600">of {totalPages} pages</span>
      </div>

      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <span>→</span>
      </Button>
    </div>
  );
}
