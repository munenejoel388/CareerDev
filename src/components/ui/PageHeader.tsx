type PageHeaderProps = {
  eyebrow?: string
  title: string
  description: string
}

function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{eyebrow}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold text-slate-950 md:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">{description}</p>
    </div>
  )
}

export default PageHeader
