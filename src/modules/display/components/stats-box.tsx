export default function StatsBox({
  stats,
}: {
  stats: { [key: string]: string };
}) {
  return (
    <div className="p-2 flex flex-col gap-2">
      <div className="text-xl font-bold">Stats</div>
      <div className="flex flex-col">
        {stats &&
          Object.entries(stats).map(([key, value]) => (
            <p key={key}>
              {key}: <span className="font-bold">{value}</span>
            </p>
          ))}
      </div>
    </div>
  );
}
