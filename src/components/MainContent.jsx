import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, ArrowRight, Play, Lock, Clock, Sparkles,
    Database, MessageSquare, Video, FileText, Wrench,
    BookOpen, Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// Icon mapping for step types
const getStepIcon = (step, isComplete, isActive) => {
    const baseClass = "w-5 h-5";

    if (isComplete) {
        return <Check className={`${baseClass} text-white`} strokeWidth={2.5} />;
    }

    if (isActive) {
        return <Play className={`${baseClass} text-white`} fill="white" />;
    }

    if (step.type === 'input') {
        return <FileText className={`${baseClass} text-text-secondary`} />;
    }

    if (step.type === 'checklist') {
        return <Wrench className={`${baseClass} text-text-secondary`} />;
    }

    return <BookOpen className={`${baseClass} text-text-secondary`} />;
};

const getStepTypeName = (step) => {
    if (step.type === 'input') return 'Interactive Guide';
    if (step.type === 'checklist') return 'Technical Workshop';
    return 'Video Lesson';
};

const getStepDuration = (step) => {
    if (step.type === 'input') return '25 min';
    if (step.type === 'checklist') return '45 min';
    return '15 min';
};

export default function MainContent() {
    const {
        getCurrentWeek,
        getCurrentStep,
        userInputs,
        saveInput,
        saveChecklistItem,
        getChecklistProgress,
        canCompleteCurrentStep,
        completeCurrentStep,
        isStepComplete,
        isStepUnlocked,
        currentWeek,
        currentStep,
        getContextData,
        setAiCoachOpen,
        navigateTo,
    } = useApp();

    const week = getCurrentWeek();
    const step = getCurrentStep();

    if (!week || !step) {
        return (
            <div className="flex-1 flex items-center justify-center bg-background dark:bg-background-dark">
                <p className="text-text-secondary">No content available</p>
            </div>
        );
    }

    const stepComplete = isStepComplete(currentWeek, currentStep);
    const completedStepsInWeek = week.steps.filter((_, idx) => isStepComplete(currentWeek, idx)).length;

    return (
        <main className="flex-1 overflow-y-auto bg-background dark:bg-background-dark">
            <div className="max-w-4xl mx-auto p-8">
                {/* Hero Card */}
                <motion.div
                    key={`${week.id}-hero`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hero-card p-8 mb-6"
                >
                    {/* Current Module Badge */}
                    <div className="flex items-center gap-2 mb-4">
                        <span className="live-indicator">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                                Current Module
                            </span>
                        </span>
                    </div>

                    {/* Title and Actions */}
                    <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-text-main dark:text-white mb-3 tracking-tight">
                                {week.title}
                            </h1>
                            <p className="text-text-secondary text-lg leading-relaxed mb-6">
                                {week.description}
                            </p>

                            {/* Learners & Progress */}
                            <div className="flex items-center gap-4">
                                <div className="avatar-stack">
                                    <div className="avatar bg-gradient-to-br from-blue-400 to-blue-600"></div>
                                    <div className="avatar bg-gradient-to-br from-purple-400 to-purple-600"></div>
                                    <div className="avatar bg-gradient-to-br from-pink-400 to-pink-600"></div>
                                </div>
                                <span className="text-sm text-text-secondary">
                                    <span className="font-medium text-text-main dark:text-white">128 others</span> learning this week
                                </span>
                            </div>
                        </div>

                        {/* Resume Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => setAiCoachOpen(false)}
                                className="flex items-center gap-3 py-4 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-2xl transition-all duration-200 shadow-glow-primary hover:shadow-glow-primary-lg group"
                            >
                                <Play className="w-5 h-5" fill="white" />
                                <span>Resume Lesson</span>
                            </button>
                            <p className="text-xs text-text-secondary mt-2 flex items-center justify-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                45 min remaining
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-3 gap-4 mb-8"
                >
                    <div className="feature-card">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-text-main dark:text-white">AI Coach Ready</h3>
                            <p className="text-xs text-text-secondary mt-0.5">Get personalized feedback on your prompts.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-text-main dark:text-white">Local Storage</h3>
                            <p className="text-xs text-text-secondary mt-0.5">Your outputs are saved securely on this device.</p>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-text-main dark:text-white">Discussion</h3>
                            <p className="text-xs text-text-secondary mt-0.5">3 new topics in Week {week.id} forum.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Week Content Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center justify-between mb-4"
                >
                    <h2 className="text-xl font-bold text-text-main dark:text-white">
                        Week {week.id} Content
                    </h2>
                    <span className="text-sm text-text-secondary">
                        {completedStepsInWeek} of {week.steps.length} Completed
                    </span>
                </motion.div>

                {/* Content List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    {week.steps.map((stepItem, stepIndex) => {
                        const isComplete = isStepComplete(currentWeek, stepIndex);
                        const isActive = stepIndex === currentStep;
                        const isLocked = !isStepUnlocked(currentWeek, stepIndex);

                        return (
                            <motion.div
                                key={stepItem.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + stepIndex * 0.05 }}
                                onClick={() => !isLocked && navigateTo(currentWeek, stepIndex)}
                                className={`content-item ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isComplete ? 'completed' : ''}`}
                            >
                                {/* Status Icon */}
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isComplete
                                            ? 'bg-success'
                                            : isActive
                                                ? 'bg-primary'
                                                : isLocked
                                                    ? 'bg-gray-100 dark:bg-gray-800'
                                                    : 'bg-gray-100 dark:bg-gray-800'
                                        }`}
                                >
                                    {isLocked ? (
                                        <Lock className="w-4 h-4 text-text-tertiary" />
                                    ) : (
                                        getStepIcon(stepItem, isComplete, isActive)
                                    )}
                                </div>

                                {/* Content Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold text-sm ${isActive
                                            ? 'text-text-main dark:text-white'
                                            : isComplete
                                                ? 'text-text-main dark:text-gray-200'
                                                : 'text-text-main dark:text-gray-200'
                                        }`}>
                                        {stepItem.title}
                                    </h3>
                                    <div className="lesson-type mt-1">
                                        <span>{getStepTypeName(stepItem)}</span>
                                        <span className="dot"></span>
                                        <span>{getStepDuration(stepItem)}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="flex-shrink-0">
                                    {isComplete ? (
                                        <button className="btn-secondary py-2 px-4 text-sm">
                                            Review
                                        </button>
                                    ) : isActive ? (
                                        <button className="btn-primary py-2 px-4 text-sm">
                                            Continue
                                        </button>
                                    ) : isLocked ? (
                                        <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wide">
                                            Locked
                                        </span>
                                    ) : null}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Current Step Content Card */}
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card p-8 mt-8"
                >
                    {/* Step Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="badge badge-primary">Step {currentStep + 1}</span>
                            {stepComplete && (
                                <span className="badge badge-success flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    Completed
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-2">
                            {step.title}
                        </h2>
                        <p className="text-text-secondary">{step.description}</p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step.type === 'input' ? (
                            <InputStep
                                step={step}
                                userInputs={userInputs}
                                saveInput={saveInput}
                                stepComplete={stepComplete}
                            />
                        ) : step.type === 'checklist' ? (
                            <ChecklistStep
                                step={step}
                                getChecklistProgress={getChecklistProgress}
                                saveChecklistItem={saveChecklistItem}
                                stepComplete={stepComplete}
                            />
                        ) : (
                            <div className="text-center py-8 text-text-secondary">
                                Unknown step type
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Complete Step Button */}
                    {!stepComplete && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <button
                                onClick={completeCurrentStep}
                                disabled={!canCompleteCurrentStep()}
                                className={`btn-primary flex items-center gap-2 ${!canCompleteCurrentStep() ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <span>Complete & Continue</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}

// Input Step Component
function InputStep({ step, userInputs, saveInput, stepComplete }) {
    const renderField = (field, index = 0) => (
        <div key={field.key} className={index > 0 ? 'mt-6' : ''}>
            <label
                htmlFor={field.key}
                className="block font-semibold text-text-main dark:text-white mb-2"
            >
                {field.label}
                {field.required && <span className="text-primary ml-1">*</span>}
            </label>

            {field.type === 'textarea' ? (
                <textarea
                    id={field.key}
                    value={userInputs[field.key] || ''}
                    onChange={(e) => saveInput(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={stepComplete}
                    rows={4}
                    className="input-field resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                />
            ) : (
                <input
                    type={field.type || 'text'}
                    id={field.key}
                    value={userInputs[field.key] || ''}
                    onChange={(e) => saveInput(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    disabled={stepComplete}
                    className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
                />
            )}
        </div>
    );

    return (
        <div>
            {renderField(step.inputField)}
            {step.additionalFields?.map((field, index) =>
                renderField(field, index + 1)
            )}
        </div>
    );
}

// Checklist Step Component
function ChecklistStep({ step, getChecklistProgress, saveChecklistItem, stepComplete }) {
    const progress = getChecklistProgress(step.id);
    const checkedCount = Object.values(progress).filter(Boolean).length;

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <span className="text-text-secondary text-sm">
                    Complete at least {step.requiredCount || step.checklist.length} items
                </span>
                <span className={`text-sm font-semibold ${checkedCount >= (step.requiredCount || step.checklist.length)
                        ? 'text-success'
                        : 'text-text-secondary'
                    }`}>
                    {checkedCount} / {step.checklist.length}
                </span>
            </div>

            <div className="space-y-3">
                {step.checklist.map((item) => {
                    const isChecked = progress[item.key] || false;

                    return (
                        <motion.label
                            key={item.key}
                            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${stepComplete
                                    ? 'cursor-not-allowed opacity-60'
                                    : isChecked
                                        ? 'border-success bg-success/5'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                }`}
                            whileHover={!stepComplete ? { scale: 1.005 } : {}}
                            whileTap={!stepComplete ? { scale: 0.995 } : {}}
                        >
                            <div
                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked
                                        ? 'bg-success border-success'
                                        : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                {isChecked && <Check className="w-4 h-4 text-white" strokeWidth={2.5} />}
                            </div>
                            <span
                                className={`flex-1 ${isChecked
                                        ? 'text-text-main dark:text-white'
                                        : 'text-text-secondary'
                                    }`}
                            >
                                {item.label}
                            </span>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) =>
                                    !stepComplete &&
                                    saveChecklistItem(step.id, item.key, e.target.checked)
                                }
                                disabled={stepComplete}
                                className="sr-only"
                            />
                        </motion.label>
                    );
                })}
            </div>
        </div>
    );
}
