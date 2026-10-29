export default function CategoriesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-72 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
