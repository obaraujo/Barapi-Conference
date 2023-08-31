import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function SkeletonPopupProduct() {
  return (
    <main className="w-full overflow-y-auto">
      <Skeleton className="z-0 mb-4 mt-4 aspect-square rounded-xl" />
      <Skeleton className="h-5 w-2/5" />

      <Skeleton className="my-4 h-5" />
      <Skeleton className="h-6 w-10" />
      <Skeleton className="h-10 w-16" />
      <Skeleton className="mt-4 h-16 w-full" />
      <div className="mt-4">
        <Skeleton className="h-5" />
        <Skeleton className="h-5" />
      </div>
    </main>
  );
}
