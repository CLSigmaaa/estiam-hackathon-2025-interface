export interface AssignedClass {
  id: number
  name: string
  teacher: string
  room: string
  students: number
  status: "confirmed" | "pending"
}