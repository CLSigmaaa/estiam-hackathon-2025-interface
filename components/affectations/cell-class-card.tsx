import { Check, Edit, MapPin, Trash2, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

type AssignedClass = {
    id: number;
    name: string;
    teacher: string;
    room: string;
    students: number;
    status: "confirmed" | "pending";
}

type AssignedClasses = {
    [key: string]: AssignedClass;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-800 border-green-200"
        case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        default:
            return "bg-gray-100 text-gray-800 border-gray-200"
    }
}

interface CellClassCardProps {
    assignedClass: AssignedClass;
}

export default function CellClassCard({ assignedClass }: CellClassCardProps) {
    return (
        <Card className={`h-full ${getStatusColor(assignedClass.status)}`}>
            <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                    <h4 className="text-xs font-medium truncate">{assignedClass.name}</h4>
                    <div className="flex gap-1 ml-1">
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                            <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-5 w-5 p-0">
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                        <MapPin className="h-2.5 w-2.5" />
                        <span className="truncate">{assignedClass.room}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                        <Users className="h-2.5 w-2.5" />
                        <span>{assignedClass.students}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}