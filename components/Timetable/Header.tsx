import AlertInfo from "@/components/AlertInfo";
import { AlertMessage } from "@/lib/timetable/types";

export default function Header({
  formattedDate,
  alerts,
}: {
  formattedDate: string;
  alerts: AlertMessage[];
}) {
  return (
    <div className="text-center mb-6">
      <div className="text-lg lg:text-xl">{formattedDate}</div>
      {alerts.length > 0 && (
        <div className="space-y-2 mt-4">
          {alerts.map((alert, i) => (
            <AlertInfo key={i} message={alert.message} type={alert.type} />
          ))}
        </div>
      )}
    </div>
  );
}