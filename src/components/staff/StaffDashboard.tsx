
import { AuthenticatedStaffDashboard } from './AuthenticatedStaffDashboard';

const StaffDashboard = ({ onLogout }: { onLogout: () => void }) => {
  return <AuthenticatedStaffDashboard />;
};

export default StaffDashboard;
