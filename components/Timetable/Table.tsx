import { getClassColor } from "@/lib/timetable/utils";

export default function TimetableTable({
  rooms,
  slots,
  schedule,
  theme,
}: {
  rooms: string[];
  slots: string[];
  schedule: any;
  theme: "light" | "dark";
}) {
  return (
    <div
      className={`grow flex flex-col overflow-hidden shadow-lg rounded-md ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="overflow-x-auto h-full">
        <table className="w-full table-fixed text-xs lg:text-sm h-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-2 py-2 text-left font-semibold w-[120px]">Heure</th>
              {rooms.map((room) => (
                <th
                  key={room}
                  className="px-2 py-2 text-center font-semibold"
                  style={{ width: `${Math.max(100 / rooms.length, 8)}%` }}
                >
                  {room}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, i) => (
              <tr
                key={slot}
                className={
                  theme === "dark"
                    ? i % 2 === 0
                      ? "bg-gray-700"
                      : "bg-gray-800"
                    : i % 2 === 0
                    ? "bg-gray-50"
                    : "bg-white"
                }
              >
                <td className="px-2 py-2 font-semibold border-r border-gray-300 align-middle">
                  {slot}
                </td>
                {rooms.map((room) => {
                  const className = schedule[slot]?.[room] || "/";
                  return (
                    <td key={room} className="px-1 py-1 text-center align-middle">
                      <div
                        className={`w-full h-full flex items-center justify-center px-1 py-1 border rounded text-xs ${getClassColor(
                          className,
                          theme
                        )} ${className === "/" ? "italic" : ""}`}
                      >
                        {className}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}