
import NewAdminDashboard from './NewAdminDashboard';

const EnhancedAdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  return <NewAdminDashboard onLogout={onLogout} />;
};

export default EnhancedAdminPanel;
