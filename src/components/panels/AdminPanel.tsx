
import EnhancedAdminPanel from "@/components/admin/EnhancedAdminPanel";

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return <EnhancedAdminPanel onLogout={onLogout} />;
}
