export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

type ContributionHeatmapProps = {
  contributions?: ContributionDay[];
  weeks?: number;
};

const levelClasses: Record<ContributionLevel, string> = {
  0: "bg-emerald-100",
  1: "bg-emerald-200",
  2: "bg-emerald-400",
  3: "bg-emerald-600",
  4: "bg-emerald-800",
};

const weekdayLabels = ["Mon", "Wed", "Fri"];

function createDefaultContributions(weeks: number): ContributionDay[] {
  const today = new Date();
  const endDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const days = weeks * 7;

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(endDate);
    date.setUTCDate(endDate.getUTCDate() - (days - index - 1));
    const activity = (index * 17 + index ** 2) % 13;
    const level: ContributionLevel = activity === 0
      ? 0
      : activity < 4
        ? 1
        : activity < 7
          ? 2
          : activity < 10
            ? 3
            : 4;

    return {
      date: date.toISOString().slice(0, 10),
      count: level === 0 ? 0 : activity + level,
      level,
    };
  });
}

export default function ContributionHeatmap({
  contributions,
  weeks = 52,
}: ContributionHeatmapProps) {
  const safeWeeks = Math.max(1, Math.floor(weeks));
  const days = contributions ?? createDefaultContributions(safeWeeks);
  const cells = Array.from({ length: safeWeeks * 7 }, (_, index) => days[index]);

  return (
    <section aria-labelledby="contribution-heatmap-title" className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
            Activity
          </p>
          <h2 id="contribution-heatmap-title" className="mt-1 text-lg font-semibold text-zinc-950">
            Contribution history
          </h2>
        </div>
        <span className="text-sm text-zinc-500">Last {safeWeeks} weeks</span>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-155 gap-2">
          <div className="flex w-8 shrink-0 flex-col justify-around pt-5 text-[10px] text-zinc-400">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div
            aria-label={`${days.filter((day) => day?.count > 0).length} active days`}
            className="grid auto-cols-fr grid-flow-col grid-rows-7 gap-1"
          >
            {cells.map((day, index) => {
              const level = day?.level ?? 0;
              const label = day
                ? `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`
                : "No contribution data";

              return (
                <span
                  key={day?.date ?? `empty-${index}`}
                  title={label}
                  aria-label={label}
                  className={`aspect-square min-w-2.5 rounded-[3px] ${levelClasses[level]}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-zinc-500">
        <span>Less</span>
        <div className="flex gap-1" aria-label="Activity scale from none to high">
          {(Object.keys(levelClasses) as unknown as ContributionLevel[]).map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className={`size-3 rounded-[3px] ${levelClasses[level]}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </section>
  );
}