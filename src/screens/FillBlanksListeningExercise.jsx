import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Volume2, Play, Pause } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Listening: Fill in the Blanks
const listeningFBQuestions = [
    {
        id: '4003001',
        title: 'Marine Biology Lecture',
        text: [
            'The ocean depths remain one of the most ',
            { answer: 'mysterious', user: '' },
            ' places on our planet. Exploration is difficult because of the intense ',
            { answer: 'pressure', user: '' },
            ' and extreme cold. However, new technologies are allowing us to ',
            { answer: 'discover', user: '' },
            ' species that have never been seen before.'
        ],
        appeared: 22,
        difficulty: 'Medium'
    }
]

export default function FillBlanksListeningExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [selections, setSelections] = useState({})
    const [isChecked, setIsChecked] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [playProgress, setPlayProgress] = useState(0)

    useEffect(() => {
        const found = listeningFBQuestions.find(q => q.id === id)
        setQuestion(found || listeningFBQuestions[0])
    }, [id])

    const handleInputChange = (index, value) => {
        if (isChecked) return
        setSelections(prev => ({ ...prev, [index]: value }))
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
            }
        }, 50)
    }

    const checkAnswers = () => {
        setIsChecked(true)
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
                        <h1 className="text-lg font-bold text-slate-800">Listening: Fill in the Blanks</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Audio Control Card */}
                <div className="glass-card p-6 mb-6 flex items-center gap-6 border-none bg-white">
                    <button
                        onClick={handlePlayAudio}
                        disabled={isPlaying}
                        className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100"
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>
                    <div className="flex-1">
                        <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audio Status</span>
                            <span className="text-[10px] font-bold text-emerald-500">{isPlaying ? 'Playing...' : 'Ready'}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${playProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Text Area */}
                <div className="glass-card p-8 border-none bg-white min-h-[250px] shadow-xl shadow-slate-100">
                    <div className="flex flex-wrap items-baseline gap-y-6 leading-[2.5]">
                        {question.text.map((part, index) => {
                            if (typeof part === 'string') {
                                return <span key={index} className="text-slate-700 font-medium text-lg mr-1">{part}</span>
                            } else {
                                const isCorrect = (selections[index] || '').toLowerCase() === part.answer.toLowerCase()
                                return (
                                    <input
                                        key={index}
                                        type="text"
                                        value={selections[index] || ''}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        disabled={isChecked}
                                        className={`mx-1 w-32 px-3 py-1 bg-slate-50 border-b-2 font-bold text-center transition-all focus:outline-none rounded-t-lg ${isChecked
                                                ? (isCorrect ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : 'border-rose-500 text-rose-600 bg-rose-50')
                                                : 'border-slate-200 focus:border-emerald-400'
                                            }`}
                                        placeholder="_____"
                                    />
                                )
                            }
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    {!isChecked ? (
                        <button
                            onClick={checkAnswers}
                            className="btn-primary py-4 px-12 rounded-3xl"
                        >
                            Submit Answers
                        </button>
                    ) : (
                        <button
                            onClick={() => { setIsChecked(false); setSelections({}); setPlayProgress(0); }}
                            className="bg-slate-900 text-white font-bold py-4 px-12 rounded-3xl flex items-center gap-2"
                        >
                            <RotateCcw size={18} />
                            Retry Question
                        </button>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
