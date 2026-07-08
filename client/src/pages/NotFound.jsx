import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[70vh] items-center justify-center">
      <div className="card-panel max-w-lg p-8 text-center">
        <p className="badge">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to Home
        </Link>
      </div>
    </section>
  )
}