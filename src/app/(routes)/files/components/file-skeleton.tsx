import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export const FileSkeleton = () => {
  return (
    <div className="px-2 py-2 flex items-center gap-3 w-full">
      <div className="flex gap-4 items-center flex-1">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 w-[70%]" />
      </div>
      <div className="w-[200px] grid grid-cols-2 gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
};
