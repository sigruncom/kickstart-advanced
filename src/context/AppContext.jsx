import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { curriculum } from '../data/curriculum';

const AppContext = createContext(null);

const STORAGE_KEY = 'somba-kickstart-progress';

// Initialize default state
const getInitialState = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse saved state:', e);
        }
    }

    return {
        currentWeek: 0,
        currentStep: 0,
        completedSteps: {},
        userInputs: {},
        checklistProgress: {},
        darkMode: false,
    };
};

export function AppProvider({ children }) {
    const [state, setState] = useState(getInitialState);
    const [aiCoachOpen, setAiCoachOpen] = useState(false);

    // Persist state to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    // Check if a specific step is complete
    const isStepComplete = useCallback((weekIndex, stepIndex) => {
        const stepId = `${weekIndex}-${stepIndex}`;
        return state.completedSteps[stepId] === true;
    }, [state.completedSteps]);

    // Check if a week is complete
    const isWeekComplete = useCallback((weekIndex) => {
        const week = curriculum[weekIndex];
        if (!week) return false;

        return week.steps.every((_, stepIndex) =>
            isStepComplete(weekIndex, stepIndex)
        );
    }, [isStepComplete]);

    // Check if a week is unlocked
    const isWeekUnlocked = useCallback((weekIndex) => {
        if (weekIndex === 0) return true;
        return isWeekComplete(weekIndex - 1);
    }, [isWeekComplete]);

    // Check if a step is unlocked
    const isStepUnlocked = useCallback((weekIndex, stepIndex) => {
        if (!isWeekUnlocked(weekIndex)) return false;
        if (stepIndex === 0) return true;
        return isStepComplete(weekIndex, stepIndex - 1);
    }, [isWeekUnlocked, isStepComplete]);

    // Get current step data
    const getCurrentStep = useCallback(() => {
        const week = curriculum[state.currentWeek];
        if (!week) return null;
        return week.steps[state.currentStep] || null;
    }, [state.currentWeek, state.currentStep]);

    // Get current week data
    const getCurrentWeek = useCallback(() => {
        return curriculum[state.currentWeek] || null;
    }, [state.currentWeek]);

    // Navigate to a specific week/step
    const navigateTo = useCallback((weekIndex, stepIndex = 0) => {
        if (!isWeekUnlocked(weekIndex)) return false;
        if (!isStepUnlocked(weekIndex, stepIndex)) return false;

        setState(prev => ({
            ...prev,
            currentWeek: weekIndex,
            currentStep: stepIndex,
        }));
        return true;
    }, [isWeekUnlocked, isStepUnlocked]);

    // Save user input
    const saveInput = useCallback((key, value) => {
        setState(prev => ({
            ...prev,
            userInputs: {
                ...prev.userInputs,
                [key]: value,
            },
        }));
    }, []);

    // Save checklist progress
    const saveChecklistItem = useCallback((stepId, itemKey, checked) => {
        setState(prev => {
            const stepProgress = prev.checklistProgress[stepId] || {};
            return {
                ...prev,
                checklistProgress: {
                    ...prev.checklistProgress,
                    [stepId]: {
                        ...stepProgress,
                        [itemKey]: checked,
                    },
                },
            };
        });
    }, []);

    // Get checklist progress for a step
    const getChecklistProgress = useCallback((stepId) => {
        return state.checklistProgress[stepId] || {};
    }, [state.checklistProgress]);

    // Check if current step requirements are met
    const canCompleteCurrentStep = useCallback(() => {
        const step = getCurrentStep();
        if (!step) return false;

        if (step.type === 'input') {
            // Check main input field
            const mainValue = state.userInputs[step.inputField?.key];
            if (step.inputField?.required && !mainValue?.trim()) return false;

            // Check additional fields
            if (step.additionalFields) {
                for (const field of step.additionalFields) {
                    const value = state.userInputs[field.key];
                    if (field.required && !value?.trim()) return false;
                }
            }
            return true;
        }

        if (step.type === 'checklist') {
            const progress = getChecklistProgress(step.id);
            const checkedCount = Object.values(progress).filter(Boolean).length;
            return checkedCount >= (step.requiredCount || step.checklist.length);
        }

        return true;
    }, [getCurrentStep, state.userInputs, getChecklistProgress]);

    // Complete current step and move to next
    const completeCurrentStep = useCallback(() => {
        if (!canCompleteCurrentStep()) return false;

        const stepId = `${state.currentWeek}-${state.currentStep}`;
        const week = curriculum[state.currentWeek];

        setState(prev => {
            const newState = {
                ...prev,
                completedSteps: {
                    ...prev.completedSteps,
                    [stepId]: true,
                },
            };

            // Auto-advance to next step or week
            if (state.currentStep < week.steps.length - 1) {
                newState.currentStep = state.currentStep + 1;
            } else if (state.currentWeek < curriculum.length - 1) {
                newState.currentWeek = state.currentWeek + 1;
                newState.currentStep = 0;
            }

            return newState;
        });

        return true;
    }, [canCompleteCurrentStep, state.currentWeek, state.currentStep]);

    // Calculate overall progress
    const getProgress = useCallback(() => {
        let totalSteps = 0;
        let completedCount = 0;

        curriculum.forEach((week, weekIndex) => {
            week.steps.forEach((_, stepIndex) => {
                totalSteps++;
                if (isStepComplete(weekIndex, stepIndex)) {
                    completedCount++;
                }
            });
        });

        return {
            completed: completedCount,
            total: totalSteps,
            percentage: totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0,
        };
    }, [isStepComplete]);

    // Get context data for AI prompts
    const getContextData = useCallback((contextKeys = []) => {
        const context = {};
        contextKeys.forEach(key => {
            if (state.userInputs[key]) {
                context[key] = state.userInputs[key];
            }
        });
        return context;
    }, [state.userInputs]);

    // Toggle dark mode
    const toggleDarkMode = useCallback(() => {
        setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (state.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.darkMode]);

    const value = {
        // State
        currentWeek: state.currentWeek,
        currentStep: state.currentStep,
        userInputs: state.userInputs,
        darkMode: state.darkMode,
        aiCoachOpen,

        // Getters
        getCurrentStep,
        getCurrentWeek,
        getProgress,
        getChecklistProgress,
        getContextData,

        // Checkers
        isStepComplete,
        isWeekComplete,
        isWeekUnlocked,
        isStepUnlocked,
        canCompleteCurrentStep,

        // Actions
        navigateTo,
        saveInput,
        saveChecklistItem,
        completeCurrentStep,
        toggleDarkMode,
        setAiCoachOpen,

        // Data
        curriculum,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
