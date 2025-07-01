"use client";
import { TempNavbar } from "@/components/temp-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PopoverContent } from "@/components/ui/popover";
import { CalendarDays, Check, Edit, MapPin, Trash2, Users, X } from "lucide-react";
import { useState } from "react";
import CellClassCard from "@/components/affectations/cell-class-card";

// Sample data
const rooms = ["Room A101", "Room B202", "Room C303", "Lab D404", "Auditorium"]
const teachers = ["Dr. Smith", "Prof. Johnson", "Ms. Davis", "Mr. Wilson", "Dr. Brown"]
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

const unassignedClasses = [
    { id: 1, name: "Advanced Mathematics", teacher: "Dr. Smith", students: 25, duration: 2 },
    { id: 2, name: "Physics Lab", teacher: "Prof. Johnson", students: 18, duration: 1 },
    { id: 3, name: "Chemistry", teacher: "Ms. Davis", students: 22, duration: 1 },
    { id: 4, name: "Biology", teacher: "Mr. Wilson", students: 20, duration: 2 },
    { id: 5, name: "Computer Science", teacher: "Dr. Brown", students: 30, duration: 1 },
]

const assignedClasses = {
    "Monday-09:00": {
        id: 6,
        name: "Linear Algebra",
        teacher: "Dr. Smith",
        room: "Room A101",
        students: 28,
        status: "confirmed",
    },
    "Tuesday-10:00": {
        id: 7,
        name: "Organic Chemistry",
        teacher: "Ms. Davis",
        room: "Lab D404",
        students: 15,
        status: "pending",
    },
    "Wednesday-14:00": {
        id: 8,
        name: "Data Structures",
        teacher: "Dr. Brown",
        room: "Room C303",
        students: 32,
        status: "confirmed",
    },
}

export default function AffectationsPage() {
    const [selectedRoom, setSelectedRoom] = useState<string>("all")
    const [selectedTeacher, setSelectedTeacher] = useState<string>("all")
    const [selectedClass, setSelectedClass] = useState<string>("all")
    const [draggedClass, setDraggedClass] = useState<any>(null)
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null)
    const [newLesson, setNewLesson] = useState({
        name: "",
        room: "",
        teacher: "",
        students: "",
        period: 1,
    })

    const handleDragStart = (e: React.DragEvent, classItem: any) => {
        setDraggedClass(classItem)
        e.dataTransfer.effectAllowed = "move"
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const handleDrop = (e: React.DragEvent, day: string, time: string) => {
        e.preventDefault()
        if (draggedClass) {
            console.log(`Assigning ${draggedClass.name} to ${day} at ${time}`)
            setDraggedClass(null)
        }
    }

    const handleCellClick = (day: string, time: string) => {
        setSelectedCell({ day, time })
        setPopoverOpen(true)
    }

    const handleAddLesson = () => {
        if (selectedCell && newLesson.name && newLesson.room && newLesson.teacher) {
            console.log(`Adding lesson: ${newLesson.name} to ${selectedCell.day} at ${selectedCell.time}`)
            // Here you would typically update your state or make an API call
            setPopoverOpen(false)
            setNewLesson({ name: "", room: "", teacher: "", students: "", period: 1 })
            setSelectedCell(null)
        }
    }

    const resetPopover = () => {
        setPopoverOpen(false)
        setNewLesson({ name: "", room: "", teacher: "", students: "", period: 1 })
        setSelectedCell(null)
    }


    return (
        <div>
            <TempNavbar />

            {/* Filter Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Room" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Rooms</SelectItem>
                                {rooms.map((room) => (
                                    <SelectItem key={room} value={room}>
                                        {room}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher} value={teacher}>
                                        {teacher}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-500" />
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Classes</SelectItem>
                                <SelectItem value="math">Mathematics</SelectItem>
                                <SelectItem value="physics">Physics</SelectItem>
                                <SelectItem value="chemistry">Chemistry</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(selectedRoom !== "all" || selectedTeacher !== "all" || selectedClass !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedRoom("all")
                                setSelectedTeacher("all")
                                setSelectedClass("all")
                            }}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>
            <div className="flex">
                {/* Main Calendar Area */}
                <div className="flex-1 p-6">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Calendar Header */}
                        <div className="grid grid-cols-6 border-b border-gray-200">
                            <div className="p-3 bg-gray-50 border-r border-gray-200">
                                <span className="text-sm font-medium text-gray-700">Time</span>
                            </div>
                            {weekdays.map((day) => (
                                <div key={day} className="p-3 bg-gray-50 border-r border-gray-200 last:border-r-0">
                                    <span className="text-sm font-medium text-gray-700">{day}</span>
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                            {timeSlots.map((time) => (
                                <div key={time} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0">
                                    <div className="p-3 bg-gray-50 border-r border-gray-200 flex items-center">
                                        <span className="text-sm text-gray-600">{time}</span>
                                    </div>
                                    {weekdays.map((day) => {
                                        const cellKey = `${day}-${time}`
                                        const assignedClass = assignedClasses[cellKey]

                                        return (
                                            <Popover
                                                key={cellKey}
                                                open={popoverOpen && selectedCell?.day === day && selectedCell?.time === time}
                                                onOpenChange={(open) => !open && resetPopover()}
                                            >
                                                <PopoverTrigger asChild>
                                                    <div
                                                        className="p-2 border-r border-gray-200 last:border-r-0 min-h-[80px] hover:bg-gray-50 transition-colors cursor-pointer"
                                                        onDragOver={handleDragOver}
                                                        onDrop={(e) => handleDrop(e, day, time)}
                                                        onClick={() => !assignedClass && handleCellClick(day, time)}
                                                    >
                                                        {assignedClass ? (
                                                            <CellClassCard assignedClass={assignedClass} />
                                                        ) : (
                                                            <div className="h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                                                                <span className="text-xs text-gray-400">Click to add lesson</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80" side="right">
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium leading-none">Add New Lesson</h4>
                                                            <p className="text-sm text-muted-foreground">
                                                                {selectedCell && `${selectedCell.day} at ${selectedCell.time}`}
                                                            </p>
                                                        </div>
                                                        <div className="grid gap-3">
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="lesson-name">Class Name</Label>
                                                                <Input
                                                                    id="lesson-name"
                                                                    placeholder="e.g. Advanced Mathematics"
                                                                    value={newLesson.name}
                                                                    onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="lesson-room">Room</Label>
                                                                <Select
                                                                    value={newLesson.room}
                                                                    onValueChange={(value) => setNewLesson({ ...newLesson, room: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select room" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {rooms.map((room) => (
                                                                            <SelectItem key={room} value={room}>
                                                                                {room}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="lesson-teacher">Teacher</Label>
                                                                <Select
                                                                    value={newLesson.teacher}
                                                                    onValueChange={(value) => setNewLesson({ ...newLesson, teacher: value })}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select teacher" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {teachers.map((teacher) => (
                                                                            <SelectItem key={teacher} value={teacher}>
                                                                                {teacher}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="lesson-students">Number of Students</Label>
                                                                <Input
                                                                    id="lesson-students"
                                                                    type="number"
                                                                    placeholder="25"
                                                                    value={newLesson.students}
                                                                    onChange={(e) => setNewLesson({ ...newLesson, students: e.target.value })}
                                                                />
                                                            </div>
                                                            <div className="grid gap-2">
                                                                <Label htmlFor="lesson-period">Period (hours)</Label>
                                                                <Select
                                                                    value={newLesson.period.toString()}
                                                                    onValueChange={(value) =>
                                                                        setNewLesson({ ...newLesson, period: Number.parseInt(value) })
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="1">1 hour</SelectItem>
                                                                        <SelectItem value="2">2 hours</SelectItem>
                                                                        <SelectItem value="3">3 hours</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button onClick={handleAddLesson} className="flex-1">
                                                                Add Lesson
                                                            </Button>
                                                            <Button variant="outline" onClick={resetPopover}>
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}