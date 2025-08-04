
import NewStaffDashboard from './NewStaffDashboard';

const StaffDashboard = ({ onLogout }: { onLogout: () => void }) => {
  return <NewStaffDashboard onLogout={onLogout} />;
};

export default StaffDashboard;
