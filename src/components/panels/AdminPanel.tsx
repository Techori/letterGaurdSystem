
import { AuthenticatedAdminPanel } from "./AuthenticatedAdminPanel";

export function AdminPanel({ onLogout }: { onLogout: () => void }) {
  return <AuthenticatedAdminPanel onLogout={onLogout} />;
}
