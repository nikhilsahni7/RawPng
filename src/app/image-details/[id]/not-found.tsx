import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Image Not Found</h2>
      <p className="text-muted-foreground">
        The image you&apos;re looking for doesn&apos;t exist or has been
        removed.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
