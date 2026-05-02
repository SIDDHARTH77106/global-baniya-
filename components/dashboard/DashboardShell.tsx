import { LucideIcon } from 'lucide-react';

type DashboardShellProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  eyebrow?: string;
  children?: React.ReactNode;
};

export default function DashboardShell({
  icon: Icon,
  title,
  description,
  eyebrow = 'Coming soon',
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">{eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{description}</p>
          </div>
          <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500">
            Scaffolded route
          </span>
        </div>
      </section>

      {children ?? (
        <section className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-black text-slate-950">No records to display yet.</p>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            This page is wired into the dashboard navigation and ready for the next functional module.
          </p>
        </section>
      )}
    </div>
  );
}
