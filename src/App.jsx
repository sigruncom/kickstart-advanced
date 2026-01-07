import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import AICoach from './components/AICoach';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
    const { isAuthenticated, loading, isAdmin } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    // Show login if not authenticated
    if (!isAuthenticated) {
        return <LoginPage />;
    }

    // Show admin dashboard for admins
    if (isAdmin) {
        return <AdminDashboard />;
    }

    // Show main app for students
    return (
        <AppProvider>
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header */}
                    <Header />

                    {/* Content */}
                    <MainContent />
                </div>

                {/* AI Coach */}
                <AICoach />
            </div>
        </AppProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
