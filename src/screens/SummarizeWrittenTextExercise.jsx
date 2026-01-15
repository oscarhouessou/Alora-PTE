import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clock, FileText, Send, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Summarize Written Text
const swtQuestions = [
    {
        id: '2001001',
        title: 'The Great Barrier Reef',
        text: 'The Great Barrier Reef is the largest coral reef system in the world, composed of over 2,900 individual reefs and 900 islands stretching for over 2,300 kilometres over an area of approximately 344,400 square kilometres. The reef is located in the Coral Sea, off the coast of Queensland, Australia. The Great Barrier Reef can be seen from outer space and is the world\'s biggest single structure made by living organisms. This reef structure is composed of and built by billions of tiny organisms, known as coral polyps. It supports a wide diversity of life and was selected as a World Heritage Site in 1981. CNN labelled it one of the seven natural wonders of the world. The Queensland National Trust named it a state icon of Queensland.',
        appeared: 15,
        difficulty: 'Medium'
    }
]

export default function SummarizeWrittenTextExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [answer, setAnswer] = useState('')
    const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [wordCount, setWordCount] = useState(0)

    useEffect(() => {
        const found = swtQuestions.find(q => q.id === id)
        setQuestion(found || swtQuestions[0])
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
        if (wordCount < 5 || wordCount > 75) {
            alert('Your summary must be between 5 and 75 words.')
            return
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
                        <h1 className="text-lg font-bold text-slate-800">Summarize Written Text</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full shadow-lg">
                        <Clock size={14} className="text-primary" />
                        <span className="text-xs font-bold text-white font-display">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Passage Column */}
                <div className="glass-card p-6 mb-6 border-none bg-white/80">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reading Passage</span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-700 font-medium">
                        {question.text}
                    </p>
                </div>

                {/* Answer Area */}
                <div className="glass-card p-6 border-none bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Summary</span>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Words:</span>
                                <span className={`text-xs font-bold ${wordCount > 75 || (wordCount < 5 && answer.length > 20) ? 'text-rose-500' : 'text-emerald-600'}`}>
                                    {wordCount} / 75
                                </span>
                            </div>
                        </div>
                    </div>

                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Write your one-sentence summary here..."
                        className="w-full h-40 bg-slate-50 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all border border-slate-100 resize-none font-medium leading-relaxed"
                        disabled={isSubmitted}
                    />

                    {!isSubmitted && (
                        <button
                            onClick={handleSubmit}
                            className="w-full mt-4 btn-primary py-4 rounded-3xl flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Submit Summary
                        </button>
                    )}
                </div>

                {/* AI Score Feedback (Placeholder) */}
                <AnimatePresence>
                    {isSubmitted && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 glass-card p-6 border-none bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <Sparkles size={20} className="text-primary" />
                                </div>
                                <h3 className="font-bold text-lg">AI Feedback Received</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4">
                                    <p className="text-2xl font-bold text-white">79</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4">
                                    <p className="text-2xl font-bold text-white">90</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Grammar</p>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 leading-relaxed italic">
                                "The summary effectively captures the core idea of the reef's scale and its ecological significance in a single concise sentence."
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full mt-6 py-3 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors"
                            >
                                Try Another
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <BottomNav />
        </div>
    )
}
