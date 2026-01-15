import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Volume2, Play, Pause, Headphones } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Multiple Choice (Listening)
const mcListeningQuestions = [
    {
        id: '4002001',
        title: 'Space Exploration Funding',
        question: 'According to the speaker, what is the primary reason for the recent increase in space research funding?',
        options: [
            'Discovery of new habitable planets',
            'Potential for asteroid mining of rare minerals',
            'Geopolitical competition between major powers',
            'Drastic reduction in launch costs by private companies'
        ],
        correctIndex: 3,
        appeared: 25,
        difficulty: 'Medium'
    }
]

export default function MultipleChoiceListeningExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playProgress, setPlayProgress] = useState(0)

    useEffect(() => {
        const found = mcListeningQuestions.find(q => q.id === id)
        setQuestion(found || mcListeningQuestions[0])
    }, [id])

    const handlePlayAudio = () => {
        setIsPlaying(true)
        let progress = 0
        const interval = setInterval(() => {
            progress += 1
            setPlayProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setIsPlaying(false)
            }
        }, 200)
    }

    if (!question) return null

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            <header className="px-6 py-6 glass-header border-none bg-white/50">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center border border-white/50"
                    >
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold text-slate-800">Multiple Choice</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Audio Card */}
                <div className="glass-card p-6 mb-8 flex items-center gap-6 border-none bg-white shadow-xl shadow-blue-50">
                    <button
                        onClick={handlePlayAudio}
                        disabled={isPlaying}
                        className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Listen to the lecture</p>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: 0 }}
                                animate={{ width: `${playProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Question */}
                <div className="glass-card p-6 mb-8 border-none bg-white/80">
                    <h2 className="text-lg font-bold text-slate-800 leading-tight">{question.question}</h2>
                </div>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedIndex === index
                        const isCorrect = index === question.correctIndex

                        return (
                            <button
                                key={index}
                                onClick={() => !isChecked && setSelectedIndex(index)}
                                className={`w-full glass-card p-4 text-left transition-all border-none flex gap-4 items-center ${isChecked
                                        ? (isCorrect ? 'bg-emerald-50 ring-2 ring-emerald-500' : (isSelected ? 'bg-rose-50 ring-2 ring-rose-500' : 'bg-white opacity-50'))
                                        : (isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white hover:bg-slate-50')
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${isChecked
                                        ? (isCorrect ? 'bg-emerald-500 text-white' : (isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'))
                                        : (isSelected ? 'bg-blue-500 text-white' : 'bg-white border-2 border-slate-100 text-slate-400')
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <p className="text-sm font-bold text-slate-700">{option}</p>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    {!isChecked ? (
                        <button
                            onClick={() => setIsChecked(true)}
                            disabled={selectedIndex === null}
                            className="btn-primary py-4 px-12 rounded-3xl disabled:opacity-50"
                        >
                            Confirm Answer
                        </button>
                    ) : (
                        <button
                            onClick={() => { setIsChecked(false); setSelectedIndex(null); setPlayProgress(0); }}
                            className="bg-slate-900 text-white font-bold py-4 px-12 rounded-3xl flex items-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Retry
                        </button>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
