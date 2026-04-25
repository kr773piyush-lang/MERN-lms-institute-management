const ProgressBar = ({ value }) => {
  const safeValue = Math.min(100, Math.max(0, value || 0));

  return (
    <div className="space-y-1">
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${safeValue}%` }}
        />
      </div>
      <p className="text-xs font-medium text-slate-600">{safeValue}% completed</p>
    </div>
  );
};

export default ProgressBar;
