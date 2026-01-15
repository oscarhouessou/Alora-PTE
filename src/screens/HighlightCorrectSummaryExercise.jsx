import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Volume2, Play, Pause, ListMusic } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Highlight Correct Summary
const hcsQuestions = [
    {
        id: '4005001',
        title: 'Future of Urban Planning',
        options: [
            'Urban planning will shift towards autonomous vehicles, prioritizing car-centric designs to improve city-wide mobility.',
            'The core focus of future urban design will be sustainable living, integrating green spaces and walkable infrastructure to reduce environmental impact.',
            'Cities are predicted to expand horizontally, moving away from high-density living towards suburban sprawl to accommodate population growth.',
            'Future designers will abandon traditional planning in favor of purely digital city twins where inhabitants live in virtual reality.'
        ],
        correctIndex: 1,
        appeared: 12,
        difficulty: 'Medium'
    }
]

export default function HighlightCorrectSummaryExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playProgress, setPlayProgress] = useState(0)

    useEffect(() => {
        const found = hcsQuestions.find(q => q.id === id)
        setQuestion(found || hcsQuestions[0])
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
        }, 300)
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
                        <h1 className="text-lg font-bold text-slate-800">Highlight Correct Summary</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Audio Card */}
                <div className="glass-card p-6 mb-6 flex items-center gap-6 border-none bg-white">
                    <button
                        onClick={handlePlayAudio}
                        disabled={isPlaying}
                        className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20"
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Listen to the summary</p>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${playProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {question.options.map((option, index) => {
                        const isSelected = selectedIndex === index
                        const isCorrect = index === question.correctIndex

                        return (
                            <button
                                key={index}
                                onClick={() => !isChecked && setSelectedIndex(index)}
                                className={`w-full glass-card p-5 text-left transition-all border-none flex gap-4 ${isChecked
                                        ? (isCorrect ? 'bg-emerald-50 ring-2 ring-emerald-500' : (isSelected ? 'bg-rose-50 ring-2 ring-rose-500' : 'bg-white opacity-50'))
                                        : (isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-white hover:bg-slate-50')
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isChecked
                                        ? (isCorrect ? 'bg-emerald-500 text-white' : (isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'))
                                        : (isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500')
                                    }`}>
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{option}</p>
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
                            Verify Selection
                        </button>
                    ) : (
                        <button
                            onClick={() => { setIsChecked(false); setSelectedIndex(null); setPlayProgress(0); }}
                            className="bg-slate-900 text-white font-bold py-4 px-12 rounded-3xl flex items-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Try Again
                        </button>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
