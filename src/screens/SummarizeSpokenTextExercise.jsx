import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, Volume2, Send, Sparkles, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Summarize Spoken Text
const sstQuestions = [
    {
        id: '4001001',
        title: 'The Evolution of Languages',
        duration: 120,
        appeared: 18,
        difficulty: 'Medium'
    }
]

export default function SummarizeSpokenTextExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [answer, setAnswer] = useState('')
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [wordCount, setWordCount] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playProgress, setPlayProgress] = useState(0)
    const [phase, setPhase] = useState('listen') // 'listen', 'writing', 'done'

    useEffect(() => {
        const found = sstQuestions.find(q => q.id === id)
        setQuestion(found || sstQuestions[0])
    }, [id])

    useEffect(() => {
        if (phase === 'writing' && timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
            return () => clearInterval(timer)
        }
    }, [phase, timeLeft, isSubmitted])

    useEffect(() => {
        const count = answer.trim() ? answer.trim().split(/\s+/).length : 0
        setWordCount(count)
    }, [answer])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handlePlayAudio = () => {
        setIsPlaying(true)
        let progress = 0
        const interval = setInterval(() => {
            progress += 1
            setPlayProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setIsPlaying(false)
                setPhase('writing')
            }
        }, 300)
    }

    const handleSubmit = () => {
        if (wordCount < 50 || wordCount > 70) {
            alert('Your summary should be between 50 and 70 words.')
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
                        <h1 className="text-lg font-bold text-slate-800">Summarize Spoken Text</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    {phase === 'writing' ? (
                        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-lg">
                            <Clock size={14} className="text-primary" />
                            <span className="text-xs font-bold text-white font-display">{formatTime(timeLeft)}</span>
                        </div>
                    ) : <div className="w-10 h-10" />}
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Audio Player Card */}
                <div className="glass-card p-10 mb-6 flex flex-col items-center justify-center border-none relative overflow-hidden bg-white">
                    <div className="relative mb-6">
                        <motion.button
                            onClick={handlePlayAudio}
                            disabled={isPlaying || phase !== 'listen'}
                            whileTap={{ scale: 0.95 }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${phase === 'listen'
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                }`}
                        >
                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </motion.button>

                        {isPlaying && (
                            <svg className="absolute inset-[-8px] w-[96px] h-[96px] -rotate-90 pointer-events-none">
                                <circle cx="48" cy="48" r="44" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                                <motion.circle
                                    cx="48" cy="48" r="44" stroke="#9333ea" strokeWidth="4" fill="none"
                                    strokeDasharray="276"
                                    strokeDashoffset={276 - (276 * playProgress / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-widest">
                        {phase === 'listen' ? 'Listen to the audio lecture' : 'Draft your summary below'}
                    </p>
                </div>

                {/* Editor Area */}
                <div className={`glass-card p-6 border-none transition-all duration-500 bg-white ${phase === 'listen' ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Summary (50-70 words)</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Words:</span>
                            <span className={`text-xs font-bold ${wordCount < 50 || wordCount > 70 ? 'text-orange-500' : 'text-emerald-600'}`}>
                                {wordCount} / 70
                            </span>
                        </div>
                    </div>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Start writing your summary..."
                        className="w-full h-48 bg-slate-50 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none transition-all border border-slate-100 resize-none font-medium leading-relaxed"
                        disabled={isSubmitted}
                    />

                    {!isSubmitted && phase === 'writing' && (
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 bg-purple-600 text-white font-bold py-4 rounded-3xl flex items-center justify-center gap-2 shadow-xl shadow-purple-100"
                        >
                            <Send size={18} />
                            Submit Summary
                        </button>
                    )}
                </div>

                {/* Scored Feedback Placeholder */}
                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 glass-card p-6 border-none bg-slate-900 text-white shadow-xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles size={20} className="text-purple-400" />
                                <h3 className="font-bold">AI Analysis Complete</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold">12/12</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">Content</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold">8/10</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">Grammar</p>
                                </div>
                                <div className="bg-white/5 rounded-xl p-3 text-center">
                                    <p className="text-lg font-bold">Excellent</p>
                                    <p className="text-[8px] font-bold text-slate-500 uppercase">Vocabulary</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <BottomNav />
        </div>
    )
}
