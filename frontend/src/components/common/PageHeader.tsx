interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white px-8 py-5">
      {eyebrow && (
        <p className="text-sm text-slate-500">
          {eyebrow}
        </p>
      )}

      <h1 className="mt-1 text-2xl font-bold text-slate-900">
        {title}
      </h1>

      {description && (
        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      )}
    </header>
  );
}