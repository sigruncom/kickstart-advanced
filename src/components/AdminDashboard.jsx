import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BarChart3, Calendar, MessageSquare, Settings, LogOut,
    ChevronDown, Search, Filter, Check, Clock, TrendingUp,
    Play, Pause, RefreshCw, Sparkles, ChevronRight, X, Moon, Sun,
    User, Bell, HelpCircle, BookOpen, Lock
} from 'lucide-react';

const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'schedule', label: 'Content Schedule', icon: Calendar },
    { id: 'insights', label: 'AI Insights', icon: Sparkles }
];

export default function AdminDashboard() {
    const { user, logout, fetchWithAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [aggregatedInputs, setAggregatedInputs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, scheduleRes, inputsRes] = await Promise.all([
                fetchWithAuth('/users/stats/overview'),
                fetchWithAuth('/users'),
                fetchWithAuth('/content/schedule'),
                fetchWithAuth('/ai/inputs?limit=50')
            ]);
            setStats(statsRes.stats);
            setUsers(usersRes.users || []);
            setSchedule(scheduleRes.schedule || []);
            setAggregatedInputs(inputsRes.inputs || []);
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const releaseWeek = async (weekIndex) => {
        try {
            await fetchWithAuth(`/content/release/${weekIndex}`, { method: 'POST' });
            loadDashboardData();
        } catch (err) {
            console.error('Failed to release week:', err);
        }
    };

    const updateUserRole = async (userId, role) => {
        try {
            await fetchWithAuth(`/users/${userId}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role })
            });
            loadDashboardData();
        } catch (err) {
            console.error('Failed to update role:', err);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="sidebar">
                {/* Logo */}
                <div className="p-6 pb-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-glow-primary">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg text-text-main dark:text-white tracking-tight">
                            Kickstart AI
                        </span>
                    </div>
                </div>

                {/* Admin Badge */}
                <div className="p-6">
                    <div className="badge badge-primary w-full justify-center py-2">
                        <Settings className="w-4 h-4" />
                        Admin Dashboard
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-6 mb-3">
                    <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                        Navigation
                    </h3>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 space-y-1">
                    {TABS.map((tab, index) => {
                        const isCurrent = activeTab === tab.id;
                        return (
                            <motion.button
                                key={tab.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left relative module-item ${isCurrent ? 'active' : ''}`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCurrent ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                                    }`}>
                                    <tab.icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className={`font-semibold text-sm block truncate ${isCurrent ? 'text-primary' : 'text-text-main dark:text-gray-200'
                                        }`}>
                                        {tab.label}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </nav>

                {/* Refresh Button */}
                <div className="p-4">
                    <button
                        onClick={loadDashboardData}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-200 shadow-glow-primary hover:shadow-glow-primary-lg"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh Data</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm">
                        <span className="text-text-secondary hover:text-text-main cursor-pointer transition-colors">
                            Home
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                        <span className="text-text-secondary hover:text-text-main cursor-pointer transition-colors">
                            Admin
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                        <span className="font-medium text-text-main dark:text-white">
                            {TABS.find(t => t.id === activeTab)?.label}
                        </span>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center gap-1">
                        <button className="nav-tab">Dashboard</button>
                        <button className="nav-tab flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            Community
                        </button>
                        <button className="nav-tab flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4" />
                            Support
                        </button>

                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-3"></div>

                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-text-secondary" />}
                        </button>

                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                            <Bell className="w-5 h-5 text-text-secondary" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
                        </button>

                        <button
                            onClick={logout}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 text-text-secondary" />
                        </button>

                        <div className="user-profile ml-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-text-main dark:text-white">{user?.name}</p>
                                <p className="text-[11px] text-text-secondary">Administrator</p>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-dark shadow-soft">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <OverviewTab stats={stats} users={users} loading={loading} />
                        )}
                        {activeTab === 'users' && (
                            <UsersTab users={users} onUpdateRole={updateUserRole} loading={loading} />
                        )}
                        {activeTab === 'schedule' && (
                            <ScheduleTab schedule={schedule} onRelease={releaseWeek} loading={loading} />
                        )}
                        {activeTab === 'insights' && (
                            <InsightsTab inputs={aggregatedInputs} fetchWithAuth={fetchWithAuth} loading={loading} />
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

function OverviewTab({ stats, users, loading }) {
    if (loading) return <LoadingState />;

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-primary to-primary-light' },
        { label: 'Active Students', value: stats?.activeStudents || 0, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
        { label: 'Completed', value: stats?.completedStudents || 0, icon: Check, color: 'from-blue-500 to-cyan-500' },
        { label: 'Recent Logins (7d)', value: stats?.recentLogins || 0, icon: Clock, color: 'from-amber-500 to-orange-500' }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Hero Card */}
            <div className="hero-card p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <span className="badge badge-primary mb-3">
                            <BarChart3 className="w-3 h-3" />
                            Dashboard Overview
                        </span>
                        <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                            Welcome back, {stats?.totalUsers || 0} users active
                        </h1>
                        <p className="text-text-secondary">
                            Manage your SOMBA Kickstart program from this central dashboard.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card p-5"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-soft`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-text-main dark:text-white mb-1">{stat.value}</p>
                        <p className="text-text-secondary text-sm">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Recent Users */}
            <div className="card p-6">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Users</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-3 font-medium text-sm">Name</th>
                                <th className="pb-3 font-medium text-sm">Email</th>
                                <th className="pb-3 font-medium text-sm">Role</th>
                                <th className="pb-3 font-medium text-sm">Cohort</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 5).map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-b border-gray-50 dark:border-gray-800/50"
                                >
                                    <td className="py-4 text-text-main dark:text-white font-medium">{u.name}</td>
                                    <td className="py-4 text-text-secondary">{u.email}</td>
                                    <td className="py-4"><RoleBadge role={u.role} /></td>
                                    <td className="py-4 text-text-secondary">{u.cohort || '-'}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

function UsersTab({ users, onUpdateRole, loading }) {
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    if (loading) return <LoadingState />;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="input-field w-48"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="active_student">Active Student</option>
                    <option value="completed_student">Completed</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="card p-6">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">
                    All Users ({filteredUsers.length})
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-3 font-medium text-sm">Name</th>
                                <th className="pb-3 font-medium text-sm">Email</th>
                                <th className="pb-3 font-medium text-sm">Role</th>
                                <th className="pb-3 font-medium text-sm">Cohort</th>
                                <th className="pb-3 font-medium text-sm">Last Login</th>
                                <th className="pb-3 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u, i) => (
                                <motion.tr
                                    key={u.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                                >
                                    <td className="py-4 text-text-main dark:text-white font-medium">{u.name}</td>
                                    <td className="py-4 text-text-secondary">{u.email}</td>
                                    <td className="py-4"><RoleBadge role={u.role} /></td>
                                    <td className="py-4 text-text-secondary">{u.cohort || '-'}</td>
                                    <td className="py-4 text-text-secondary text-sm">
                                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="py-4">
                                        <select
                                            value={u.role}
                                            onChange={(e) => onUpdateRole(u.id, e.target.value)}
                                            className="px-3 py-1.5 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark focus:border-primary outline-none transition-colors"
                                        >
                                            <option value="active_student">Active Student</option>
                                            <option value="completed_student">Completed</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}

function ScheduleTab({ schedule, onRelease, loading }) {
    if (loading) return <LoadingState />;

    const weeks = Array.from({ length: 12 }, (_, i) => {
        const weekSchedule = schedule.find(s => s.week_index === i);
        return {
            index: i,
            released: weekSchedule?.is_released === 1,
            releaseDate: weekSchedule?.release_date
        };
    });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Hero Card */}
            <div className="hero-card p-6">
                <span className="badge badge-primary mb-3">
                    <Calendar className="w-3 h-3" />
                    Content Management
                </span>
                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    Content Release Schedule
                </h1>
                <p className="text-text-secondary">
                    Control when each week's content becomes available to students.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeks.map((week, i) => (
                    <motion.div
                        key={week.index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`card p-5 ${week.released ? 'border-2 border-green-200 dark:border-green-800' : ''}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${week.released
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                        : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                                    }`}>
                                    {week.released ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white">Week {week.index + 1}</h4>
                                    <p className="text-xs text-text-secondary">
                                        {week.releaseDate ? new Date(week.releaseDate).toLocaleDateString() : 'Not scheduled'}
                                    </p>
                                </div>
                            </div>
                            {week.released ? (
                                <span className="badge badge-success">Released</span>
                            ) : (
                                <span className="badge badge-warning">Pending</span>
                            )}
                        </div>
                        {!week.released && (
                            <button
                                onClick={() => onRelease(week.index)}
                                className="w-full btn-primary text-sm py-2"
                            >
                                <Play className="w-4 h-4 inline mr-2" />
                                Release Now
                            </button>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

function InsightsTab({ inputs, fetchWithAuth, loading }) {
    const [aggregating, setAggregating] = useState(false);
    const [result, setResult] = useState(null);

    const runAggregation = async (inputKey) => {
        setAggregating(true);
        try {
            const data = await fetchWithAuth('/ai/aggregate', {
                method: 'POST',
                body: JSON.stringify({ inputKey })
            });
            setResult(data);
        } catch (err) {
            console.error('Aggregation failed:', err);
        } finally {
            setAggregating(false);
        }
    };

    if (loading) return <LoadingState />;

    const inputsByKey = inputs.reduce((acc, input) => {
        acc[input.input_key] = (acc[input.input_key] || []);
        acc[input.input_key].push(input);
        return acc;
    }, {});

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Hero Card */}
            <div className="hero-card p-6">
                <span className="badge badge-primary mb-3">
                    <Sparkles className="w-3 h-3" />
                    AI Insights
                </span>
                <h1 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                    Participant Input Analysis
                </h1>
                <p className="text-text-secondary">
                    Aggregate and analyze responses from program participants.
                </p>
            </div>

            {/* Input Types */}
            <div className="card p-6">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Inputs by Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(inputsByKey).map(([key, items]) => (
                        <div key={key} className="feature-card flex-col">
                            <div className="flex items-center justify-between w-full mb-3">
                                <h4 className="font-semibold text-text-main dark:text-white">{key}</h4>
                                <span className="badge badge-muted">{items.length}</span>
                            </div>
                            <button
                                onClick={() => runAggregation(key)}
                                disabled={aggregating}
                                className="w-full btn-primary text-sm py-2 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4 inline mr-2" />
                                Analyze
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Result */}
            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-text-main dark:text-white">Analysis Result</h3>
                        <button onClick={() => setResult(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <X className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                    <p className="text-text-main dark:text-gray-200 mb-4">{result.summary}</p>
                    {result.topKeywords && (
                        <div className="mb-4">
                            <h4 className="font-semibold text-text-main dark:text-white mb-2">Top Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.topKeywords.slice(0, 10).map(k => (
                                    <span key={k.word} className="badge badge-primary">
                                        {k.word} ({k.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {result.sampleResponses && (
                        <div>
                            <h4 className="font-semibold text-text-main dark:text-white mb-2">Sample Responses</h4>
                            <div className="space-y-2">
                                {result.sampleResponses.map((r, i) => (
                                    <p key={i} className="text-text-secondary text-sm p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">{r}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Recent Inputs */}
            <div className="card p-6">
                <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Recent Participant Inputs</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {inputs.slice(0, 20).map((input, i) => (
                        <motion.div
                            key={input.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.02 }}
                            className="content-item"
                        >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-primary text-sm">{input.input_key}</span>
                                    <span className="text-text-tertiary text-xs">{input.user_name}</span>
                                </div>
                                <p className="text-text-main dark:text-gray-200 text-sm truncate">
                                    {input.input_value.slice(0, 100)}{input.input_value.length > 100 ? '...' : ''}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function RoleBadge({ role }) {
    const styles = {
        admin: 'badge-primary',
        active_student: 'badge-success',
        completed_student: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    };
    const labels = {
        admin: 'Admin',
        active_student: 'Active',
        completed_student: 'Completed'
    };
    return (
        <span className={`badge ${styles[role] || styles.active_student}`}>
            {labels[role] || role}
        </span>
    );
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center animate-pulse">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            </div>
        </div>
    );
}
