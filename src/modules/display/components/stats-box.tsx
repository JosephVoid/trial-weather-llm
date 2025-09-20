export default function StatsBox({
  stats,
}: {
  stats: { [key: string]: string | number };
}) {
  return (
    <div
      className={`p-2 flex flex-col gap-2 ${
        Object.keys(stats).length === 0 ? "invisible" : ""
      }`}
    >
      <div className="text-xl font-bold">Request Stats</div>
      <div className="flex flex-col text-sm">
        {stats &&
          Object.entries(stats).map(([key, value]) => (
            <p key={key} className="flex">
              <span className="mr-1">{key}: </span>{" "}
              <span className="font-bold">{value}</span>
            </p>
          ))}
      </div>
    </div>
  );
}
