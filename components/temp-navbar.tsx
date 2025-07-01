import { CalendarDays, Check } from "lucide-react";
import { Button } from "./ui/button";

export const TempNavbar = () => {
    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">MonitorControl</h1>
                    <p className="text-sm text-gray-600">Class Schedule Management</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        Export Schedule
                    </Button>
                    <Button size="sm">
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
};