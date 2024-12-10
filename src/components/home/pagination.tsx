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
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center space-x-2">
      {currentPage > 1 && (
        <Button variant="outline" onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      {currentPage < totalPages && (
        <Button variant="outline" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      )}
    </div>
  );
}
