const Loader = ({ fullScreen = false, text = "Loading..." }) => (
  <div
    className={`flex items-center justify-center ${
      fullScreen ? "min-h-screen" : "min-h-[140px]"
    }`}
  >
    <div className="flex items-center gap-3 text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  </div>
);

export default Loader;
