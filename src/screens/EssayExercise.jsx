import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, PenTool, Send, Sparkles, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Essay
const essayQuestions = [
    {
        id: '2002001',
        title: 'Technology & Human Connection',
        prompt: 'In the modern world, technology has made it easier to connect with people globally. Does this increase in digital connection come at the cost of genuine human interaction? Discuss your opinion with relevant examples.',
        appeared: 28,
        difficulty: 'Difficult'
    }
]

export default function EssayExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [answer, setAnswer] = useState('')
    const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [wordCount, setWordCount] = useState(0)

    useEffect(() => {
        const found = essayQuestions.find(q => q.id === id)
        setQuestion(found || essayQuestions[0])
    }, [id])

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
            return () => clearInterval(timer)
        }
    }, [timeLeft, isSubmitted])

    useEffect(() => {
        const count = answer.trim() ? answer.trim().split(/\s+/).length : 0
        setWordCount(count)
    }, [answer])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleSubmit = () => {
        if (wordCount < 200 || wordCount > 300) {
            alert('Your essay should ideally be between 200 and 300 words.')
            // We allow submit but warn
        }
        setIsSubmitted(true)
    }

    if (!question) return null

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            {/* Header */}
            <header className="px-6 py-6 glass-header border-none bg-white/50">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center hover:bg-slate-50 transition-colors border border-white/50"
                    >
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-slate-800">Write Essay</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-lg">
                        <Clock size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white font-display">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Prompt Card */}
                <div className="glass-card p-6 mb-6 border-none bg-white/80">
                    <div className="flex items-center gap-2 mb-4">
                        <BookOpen size={16} className="text-orange-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Essay Prompt</span>
                    </div>
                    <h2 className="text-base font-bold text-slate-800 mb-3 leading-tight">{question.title}</h2>
                    <p className="text-sm leading-relaxed text-slate-600 font-medium">
                        {question.prompt}
                    </p>
                </div>

                {/* Editor Area */}
                <div className="glass-card p-6 border-none bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Response</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Words:</span>
                                <span className={`text-xs font-bold ${wordCount < 200 || wordCount > 300 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                    {wordCount} / 300
                                </span>
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Start typing your essay here..."
                        className="w-full h-80 bg-slate-50 rounded-2xl p-6 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all border border-slate-100 resize-none font-medium leading-relaxed"
                        disabled={isSubmitted}
                    />

                    {!isSubmitted && (
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 btn-primary py-4 rounded-3xl flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Submit Essay
                        </button>
                    )}
                </div>

                {/* Feedback Placeholder */}
                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 glass-card p-8 border-none bg-gradient-to-br from-primary to-primary-light text-white shadow-xl shadow-orange-100"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles size={24} className="text-white animate-pulse" />
                                <h3 className="font-bold text-xl">Scoring in Progress</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '85%' }}
                                        className="h-full bg-white"
                                        transition={{ duration: 2 }}
                                    />
                                </div>
                                <p className="text-sm font-medium opacity-90 leading-relaxed">
                                    Our AI is analyzing your response for structure, vocabulary range, and grammar accuracy. You'll receive a detailed report in a few moments.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <BottomNav />
        </div>
    )
}
