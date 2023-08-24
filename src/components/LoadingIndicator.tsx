export function LoadingIndicator() {
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute left-[50%] top-[50%] flex h-16  w-32 translate-x-[-50%] translate-y-[-50%] items-center justify-center gap-1 rounded-xl bg-white p-6 shadow-md focus:outline-none">
        <div className="h-4 w-4 animate-[bouncedelay_1.4s_infinite_ease-in-out_both_-320ms] rounded-full bg-orange-barapi" />
        <div className="h-4 w-4 animate-[bouncedelay_1.4s_infinite_ease-in-out_both_-160ms] rounded-full bg-orange-barapi" />
        <div className="h-4 w-4  animate-[bouncedelay_1.4s_infinite_ease-in-out_both] rounded-full bg-orange-barapi" />
      </div>
    </div>
  );
}
