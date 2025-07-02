import AuthGuard from "@/components/AuthGuard"
import GroupManagement from "@/components/group-management"

export default function Page() {
  return (
    <AuthGuard>
      <GroupManagement />
    </AuthGuard>
  )
}
