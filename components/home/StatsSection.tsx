const stats = [
  { value: "12.8k", label: "contributions tracked" },
  { value: "2,400+", label: "projects shared" },
  { value: "94%", label: "weekly consistency" },
  { value: "∞", label: "momentum to build" },
];

export default function StatsSection() {
  return (
    <section className="border-y border-white/8 bg-white/3" aria-label="DevPulse statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/8 px-5 sm:px-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-8 first:pl-0 last:pr-0 sm:px-8 lg:py-10">
            <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-zinc-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
