
import { AuthenticatedAdminDashboard } from './AuthenticatedAdminDashboard';

const EnhancedAdminPanel = ({ onLogout }: { onLogout: () => void }) => {
  return <AuthenticatedAdminDashboard />;
};

export default EnhancedAdminPanel;
