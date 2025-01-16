import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface FileGridItemProps {
  file: {
    _id: string;
    fileName: string;
    cloudFrontUrl: string;
    fileType: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const DeleteButton = ({ onDelete }: { onDelete: () => void }) => (
  <Button
    variant="destructive"
    size="icon"
    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
    onClick={(e) => {
      e.stopPropagation();
      onDelete();
    }}
  >
    <IconX className="h-4 w-4" />
  </Button>
);

export const FileGridItem = memo(
  ({ file, isSelected, onSelect, onDelete }: FileGridItemProps) => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "relative group cursor-pointer rounded-lg overflow-hidden border",
          isSelected ? "ring-2 ring-primary" : ""
        )}
        onClick={onSelect}
      >
        <div className="aspect-square relative">
          <Image
            src={file.cloudFrontUrl}
            alt={file.fileName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-2 bg-background">
          <p className="text-sm truncate">{file.fileName}</p>
          <p className="text-xs text-muted-foreground">{file.fileType}</p>
        </div>
        <DeleteButton onDelete={onDelete} />
      </motion.div>
    );
  }
);

FileGridItem.displayName = "FileGridItem";
