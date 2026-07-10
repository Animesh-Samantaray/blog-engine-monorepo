import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section-shell flex min-h-[70vh] items-center justify-center">
      <div className="card-panel max-w-lg p-12 text-center">
        <p className="badge">404</p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-primary">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to home
        </Link>
      </div>
    </section>
  )
}