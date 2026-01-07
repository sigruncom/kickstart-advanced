import { Moon, Sun, User, ChevronRight, Bell, HelpCircle, Users, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const { getCurrentWeek, darkMode, toggleDarkMode } = useApp();
    const { user, logout } = useAuth();

    const week = getCurrentWeek();

    // Get role display name
    const getRoleDisplay = (role) => {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'active_student': return 'Active Student';
            case 'completed_student': return 'Graduate';
            default: return 'Member';
        }
    };

    return (
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm">
                <span className="text-text-secondary hover:text-text-main cursor-pointer transition-colors">
                    Home
                </span>
                <ChevronRight className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary hover:text-text-main cursor-pointer transition-colors">
                    Kickstart Program
                </span>
                <ChevronRight className="w-4 h-4 text-text-tertiary" />
                <span className="font-medium text-text-main dark:text-white">
                    Week {week?.id}
                </span>
            </nav>

            {/* Right side navigation */}
            <div className="flex items-center gap-1">
                {/* Nav links */}
                <button className="nav-tab">Dashboard</button>
                <button className="nav-tab flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    Community
                </button>
                <button className="nav-tab flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    Support
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-3"></div>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                        <Moon className="w-5 h-5 text-text-secondary" />
                    )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                    <Bell className="w-5 h-5 text-text-secondary" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                </button>

                {/* Logout button */}
                <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Logout"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5 text-text-secondary" />
                </button>

                {/* User profile */}
                <div className="user-profile ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-text-main dark:text-white">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-[11px] text-text-secondary">
                            {getRoleDisplay(user?.role)}
                        </p>
                    </div>
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-dark shadow-soft">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-white" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
