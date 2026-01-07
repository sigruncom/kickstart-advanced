import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, BarChart3, Calendar, MessageSquare, Settings, LogOut,
    ChevronDown, Search, Filter, Check, Clock, TrendingUp,
    Play, Pause, RefreshCw, Sparkles, ChevronRight, X
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

    useEffect(() => {
        loadDashboardData();
    }, []);

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">SOMBA Kickstart Admin</h1>
                        <p className="text-purple-300/70 text-sm">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={loadDashboardData} className="p-2 text-purple-300 hover:text-white transition-colors">
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl w-fit">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-purple-600 text-white'
                                    : 'text-purple-200 hover:bg-white/5'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
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
            </div>
        </div>
    );
}

function OverviewTab({ stats, users, loading }) {
    if (loading) return <LoadingState />;

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Students', value: stats?.activeStudents || 0, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
        { label: 'Completed', value: stats?.completedStudents || 0, icon: Check, color: 'from-purple-500 to-pink-500' },
        { label: 'Recent Logins (7d)', value: stats?.recentLogins || 0, icon: Clock, color: 'from-orange-500 to-amber-500' }
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-purple-300/70">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Users */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Users</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-purple-300/70 border-b border-white/10">
                                <th className="pb-3">Name</th>
                                <th className="pb-3">Email</th>
                                <th className="pb-3">Role</th>
                                <th className="pb-3">Cohort</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 5).map(u => (
                                <tr key={u.id} className="border-b border-white/5">
                                    <td className="py-3 text-white">{u.name}</td>
                                    <td className="py-3 text-purple-200">{u.email}</td>
                                    <td className="py-3"><RoleBadge role={u.role} /></td>
                                    <td className="py-3 text-purple-300/70">{u.cohort || '-'}</td>
                                </tr>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="active_student">Active Student</option>
                    <option value="completed_student">Completed</option>
                </select>
            </div>

            {/* Users Table */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-purple-300/70 border-b border-white/10">
                            <th className="pb-3">Name</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">Cohort</th>
                            <th className="pb-3">Last Login</th>
                            <th className="pb-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="py-4 text-white font-medium">{u.name}</td>
                                <td className="py-4 text-purple-200">{u.email}</td>
                                <td className="py-4"><RoleBadge role={u.role} /></td>
                                <td className="py-4 text-purple-300/70">{u.cohort || '-'}</td>
                                <td className="py-4 text-purple-300/70">{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}</td>
                                <td className="py-4">
                                    <select
                                        value={u.role}
                                        onChange={(e) => onUpdateRole(u.id, e.target.value)}
                                        className="px-3 py-1 bg-white/10 border border-white/10 rounded text-white text-sm focus:outline-none"
                                    >
                                        <option value="active_student">Active Student</option>
                                        <option value="completed_student">Completed</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-6">Content Release Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {weeks.map(week => (
                        <div key={week.index} className={`p-4 rounded-lg border ${week.released ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-white">Week {week.index + 1}</span>
                                {week.released ? (
                                    <span className="flex items-center gap-1 text-green-400 text-sm">
                                        <Check className="w-4 h-4" /> Released
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-amber-400 text-sm">
                                        <Clock className="w-4 h-4" /> Pending
                                    </span>
                                )}
                            </div>
                            <p className="text-purple-300/70 text-sm mb-3">
                                {week.releaseDate ? new Date(week.releaseDate).toLocaleDateString() : 'Not scheduled'}
                            </p>
                            {!week.released && (
                                <button
                                    onClick={() => onRelease(week.index)}
                                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4" /> Release Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
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

    // Group inputs by key
    const inputsByKey = inputs.reduce((acc, input) => {
        acc[input.input_key] = (acc[input.input_key] || []);
        acc[input.input_key].push(input);
        return acc;
    }, {});

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            {/* Input Types */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Participant Inputs by Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(inputsByKey).map(([key, items]) => (
                        <div key={key} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <h4 className="font-medium text-white mb-1">{key}</h4>
                            <p className="text-purple-300/70 text-sm mb-3">{items.length} responses</p>
                            <button
                                onClick={() => runAggregation(key)}
                                disabled={aggregating}
                                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4" /> Analyze
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Aggregation Result */}
            {result && (
                <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Analysis Result</h3>
                        <button onClick={() => setResult(null)} className="text-purple-300 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-purple-200 mb-4">{result.summary}</p>
                    {result.topKeywords && (
                        <div className="mb-4">
                            <h4 className="text-white font-medium mb-2">Top Keywords</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.topKeywords.slice(0, 10).map(k => (
                                    <span key={k.word} className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                                        {k.word} ({k.count})
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {result.sampleResponses && (
                        <div>
                            <h4 className="text-white font-medium mb-2">Sample Responses</h4>
                            <div className="space-y-2">
                                {result.sampleResponses.map((r, i) => (
                                    <p key={i} className="text-purple-300/70 text-sm p-3 bg-white/5 rounded-lg">{r}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Inputs */}
            <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Participant Inputs</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {inputs.slice(0, 20).map(input => (
                        <div key={input.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-purple-400">{input.input_key}</span>
                                <span className="text-purple-300/50 text-sm">{input.user_name}</span>
                            </div>
                            <p className="text-white text-sm">{input.input_value.slice(0, 200)}{input.input_value.length > 200 ? '...' : ''}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

function RoleBadge({ role }) {
    const styles = {
        admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        active_student: 'bg-green-500/20 text-green-300 border-green-500/30',
        completed_student: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    };
    const labels = {
        admin: 'Admin',
        active_student: 'Active',
        completed_student: 'Completed'
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[role] || styles.active_student}`}>
            {labels[role] || role}
        </span>
    );
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
        </div>
    );
}
