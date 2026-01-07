import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, Zap, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

// Mock AI responses based on context
const generateMockResponse = (prompt, context, step) => {
    const { surveySentence, courseName, bigPromise, interviewFindings } = context;

    // Week 1 - Survey Sentence help
    if (step?.id?.startsWith('1-1')) {
        return `Here's a template for your Survey Sentence:

"I help [specific type of professional/person] overcome [their biggest challenge] so they can [achieve desired transformation]."

**Examples:**
• "I help busy moms overcome exhaustion and overwhelm so they can reclaim their energy and be present with their families."
• "I help corporate professionals overcome imposter syndrome so they can confidently pursue leadership roles."

Try filling in the blanks with YOUR ideal client's situation. What specific problem keeps them up at night?`;
    }

    // Week 2 - Course naming
    if (step?.id?.startsWith('2-2') && surveySentence) {
        return `Based on your survey focus: "${surveySentence?.slice(0, 100)}..."

Here are some course name ideas:

1. **The [Transformation] Blueprint** - Clear, results-focused
2. **[Ideal Client] Accelerator** - Action-oriented
3. **From [Problem] to [Result]** - Journey-based

Your Big Promise should follow this format:
"In [timeframe], you will [specific, measurable result] even if [common objection]."

What transformation do your ideal clients want most?`;
    }

    // Week 4 - Social media content
    if (step?.id?.startsWith('4-1') && courseName) {
        return `Here are 3 Facebook posts for "${courseName || 'your course'}":

**Post 1 - Problem Awareness**
"Are you tired of [problem from survey]? You're not alone. I just spoke with 50+ [ideal clients] who all said the same thing... [insight from interviews]. Drop a 🙋 if you can relate!"

**Post 2 - Solution Teaser**
"What if I told you there's a way to [big promise]? I've been working on something special for [ideal clients] and I can't wait to share it with you. Stay tuned! 👀"

**Post 3 - Value Post**
"Here's my #1 tip for [topic]: [actionable advice]. Most [ideal clients] skip this step - but it's a game-changer! Save this post for later 📌"

Want me to customize these further?`;
    }

    // Generic helpful response
    return `Great question! Here's how I can help you with "${step?.title || 'this step'}":

${step?.description ? `**What you're working on:** ${step.description}\n` : ''}
${surveySentence ? `**Your survey focus:** ${surveySentence.slice(0, 80)}...\n` : ''}
${courseName ? `**Your course:** ${courseName}\n` : ''}

**Tips for success:**
1. Be specific about your ideal client
2. Focus on the transformation, not just the process
3. Use your clients' actual words when possible

What specific aspect would you like help with?`;
};

export default function AICoach() {
    const { aiCoachOpen, setAiCoachOpen, getCurrentStep, userInputs, getContextData } = useApp();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const step = getCurrentStep();
    const contextData = getContextData([
        'surveySentence',
        'courseName',
        'bigPromise',
        'interviewFindings',
        'contentPlan',
    ]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (aiCoachOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [aiCoachOpen]);

    // Add welcome message when opened
    useEffect(() => {
        if (aiCoachOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    role: 'assistant',
                    content: `Hi! 👋 I'm your AI Kickstart Coach. I can see you're working on "${step?.title || 'your program'}". 

${step?.aiPrompt ? `**Suggested question:** "${step.aiPrompt}"` : 'How can I help you today?'}`,
                },
            ]);
        }
    }, [aiCoachOpen, step]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            role: 'user',
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const response = generateMockResponse(input, contextData, step);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    role: 'assistant',
                    content: response,
                },
            ]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1000);
    };

    const quickPrompts = [
        "Help me refine this",
        "Give me examples",
        "What's next?",
    ];

    return (
        <AnimatePresence>
            {aiCoachOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setAiCoachOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 400, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 400, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-4 right-4 bottom-4 w-[420px] bg-white dark:bg-surface-dark shadow-elevated z-50 flex flex-col rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-glow-primary">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-text-main dark:text-white">
                                            AI Kickstart Coach
                                        </h2>
                                        <p className="text-xs text-text-secondary flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                                            Online • Ready to help
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setAiCoachOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-text-secondary" />
                                </button>
                            </div>
                        </div>

                        {/* Context Badge */}
                        {step && (
                            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <p className="text-xs text-text-secondary">
                                    Context: <span className="font-medium text-text-main dark:text-white">{step.title}</span>
                                </p>
                            </div>
                        )}

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                ? 'bg-gray-100 dark:bg-gray-800'
                                                : 'bg-gradient-to-br from-primary to-primary-light'
                                            }`}
                                    >
                                        {message.role === 'user' ? (
                                            <User className="w-4 h-4 text-text-secondary" />
                                        ) : (
                                            <Bot className="w-4 h-4 text-white" />
                                        )}
                                    </div>
                                    <div
                                        className={`flex-1 p-4 rounded-2xl text-sm leading-relaxed ${message.role === 'user'
                                                ? 'bg-primary text-white rounded-tr-md'
                                                : 'bg-gray-100 dark:bg-gray-800 text-text-main dark:text-gray-200 rounded-tl-md'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{message.content}</div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-md">
                                        <div className="flex gap-1.5">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Prompts */}
                        <div className="px-5 pb-3 flex gap-2">
                            {quickPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setInput(prompt)}
                                    className="px-3 py-1.5 text-xs font-medium text-text-secondary bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <form
                            onSubmit={handleSubmit}
                            className="p-4 border-t border-gray-100 dark:border-gray-800"
                        >
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="flex-1 input-field py-3 px-4"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isTyping}
                                    className="p-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors shadow-glow-primary hover:shadow-glow-primary-lg disabled:shadow-none"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
