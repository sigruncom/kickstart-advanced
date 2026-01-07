import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ email: '', password: '', name: '', cohort: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(form.email, form.password);
            } else {
                await register(form.email, form.password, form.name, form.cohort);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-glow-primary">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-text-main mb-1">Kickstart AI</h1>
                    <p className="text-text-secondary">SOMBA Kickstart Program</p>
                </div>

                {/* Card */}
                <div className="card p-8">
                    {/* Toggle */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isLogin
                                    ? 'bg-white text-text-main shadow-soft'
                                    : 'text-text-secondary hover:text-text-main'
                                }`}
                        >
                            <LogIn className="w-4 h-4" />Sign In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${!isLogin
                                    ? 'bg-white text-text-main shadow-soft'
                                    : 'text-text-secondary hover:text-text-main'
                                }`}
                        >
                            <UserPlus className="w-4 h-4" />Register
                        </button>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-4 p-3 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 text-sm font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-text-main text-sm font-medium mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Your full name"
                                        required={!isLogin}
                                        className="input-field pl-12"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-text-main text-sm font-medium mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-text-main text-sm font-medium mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="input-field pl-12"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-text-main text-sm font-medium mb-1.5">Cohort (Optional)</label>
                                <input
                                    type="text"
                                    value={form.cohort}
                                    onChange={(e) => setForm({ ...form, cohort: e.target.value })}
                                    placeholder="e.g., January 2026"
                                    className="input-field"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-text-tertiary text-xs font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Demo Accounts */}
                    <div className="space-y-2">
                        <p className="text-text-secondary text-xs text-center mb-3">Try with demo accounts</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, email: 'admin@sigrun.com', password: 'Admin123!' })}
                                className="btn-secondary text-xs py-2"
                            >
                                Admin Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, email: 'student1@example.com', password: 'Student123!' })}
                                className="btn-secondary text-xs py-2"
                            >
                                Student Demo
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-text-tertiary text-xs mt-6">
                    © 2026 Sigrun GmbH. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}
