
import { AuthenticatedStaffPanel } from "./AuthenticatedStaffPanel";

export function StaffPanel({ onLogout }: { onLogout: () => void }) {
  return <AuthenticatedStaffPanel onLogout={onLogout} />;
}
