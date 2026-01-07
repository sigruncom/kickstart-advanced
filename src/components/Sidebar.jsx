import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
    const {
        curriculum,
        currentWeek,
        currentStep,
        isWeekUnlocked,
        isWeekComplete,
        navigateTo,
        getProgress,
        setAiCoachOpen,
    } = useApp();

    const progress = getProgress();
    const weeksCompleted = curriculum.filter((_, i) => isWeekComplete(i)).length;

    return (
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

            {/* Course Progress */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-main dark:text-white">Course Progress</span>
                    <span className="text-sm font-bold text-primary">{progress.percentage}%</span>
                </div>
                <div className="progress-bar mb-2">
                    <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
                <p className="text-xs text-text-secondary">
                    {weeksCompleted} of {curriculum.length} Weeks Completed
                </p>
            </div>

            {/* Modules Section */}
            <div className="px-6 mb-3">
                <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                    Modules
                </h3>
            </div>

            {/* Week Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 space-y-1">
                {curriculum.map((week, weekIndex) => {
                    const unlocked = isWeekUnlocked(weekIndex);
                    const complete = isWeekComplete(weekIndex);
                    const isCurrent = weekIndex === currentWeek;

                    return (
                        <motion.button
                            key={week.id}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: weekIndex * 0.03 }}
                            onClick={() => unlocked && navigateTo(weekIndex)}
                            disabled={!unlocked}
                            className={`w-full text-left relative module-item ${isCurrent ? 'active' : ''
                                } ${!unlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {/* Status Icon */}
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${complete
                                        ? 'bg-success text-white'
                                        : isCurrent
                                            ? 'bg-primary text-white'
                                            : unlocked
                                                ? 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                                                : 'bg-gray-100 dark:bg-gray-800 text-text-tertiary'
                                    }`}
                            >
                                {complete ? (
                                    <Check className="w-4 h-4" strokeWidth={2.5} />
                                ) : unlocked ? (
                                    <BookOpen className="w-3.5 h-3.5" />
                                ) : (
                                    <Lock className="w-3.5 h-3.5" />
                                )}
                            </div>

                            {/* Week Info */}
                            <div className="flex-1 min-w-0">
                                <span
                                    className={`font-semibold text-sm block truncate ${isCurrent
                                            ? 'text-primary'
                                            : complete
                                                ? 'text-text-main dark:text-white'
                                                : 'text-text-main dark:text-gray-200'
                                        }`}
                                >
                                    Week {week.id}: {week.title}
                                </span>
                                {isCurrent && (
                                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wide">
                                        In Progress
                                    </span>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </nav>

            {/* AI Coach Button */}
            <div className="p-4">
                <button
                    onClick={() => setAiCoachOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-200 shadow-glow-primary hover:shadow-glow-primary-lg"
                >
                    <Sparkles className="w-5 h-5" />
                    <span>Ask AI Coach</span>
                </button>
                <p className="text-[11px] text-center text-text-secondary mt-2 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                    Progress saved locally
                </p>
            </div>
        </aside>
    );
}
