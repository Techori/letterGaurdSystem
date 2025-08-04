
import StaffDashboard from "@/components/staff/StaffDashboard";

export function StaffPanel({ onLogout }: { onLogout: () => void }) {
  return <StaffDashboard onLogout={onLogout} />;
}
