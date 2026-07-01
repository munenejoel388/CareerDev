import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="rounded-lg bg-white p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-950">Page not found</h1>
      <p className="mt-3 max-w-xl text-slate-600">
        The page you are looking for does not exist yet.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
      >
        Go home
      </Link>
    </section>
  )
}

export default NotFound
