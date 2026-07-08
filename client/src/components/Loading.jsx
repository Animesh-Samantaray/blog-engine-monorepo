export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="card-panel flex items-center gap-3 px-5 py-4 text-sm font-medium text-slate-700">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        <span>{message}</span>
      </div>
    </div>
  )
}