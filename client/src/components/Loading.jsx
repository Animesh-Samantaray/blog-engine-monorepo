export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-4 py-10">
      <div className="flex items-center gap-3 text-sm font-medium text-secondary">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-blue)]" />
        <span>{message}</span>
      </div>
    </div>
  )
}