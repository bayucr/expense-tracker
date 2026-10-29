export default function TransactionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-8 w-44 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>
      <div className="h-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="h-96 rounded-xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
