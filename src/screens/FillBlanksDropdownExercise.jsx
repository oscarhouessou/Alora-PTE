import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Reading: Fill in the Blanks (Dropdown)
const readingFBQuestions = [
    {
        id: '3001001',
        title: 'Climate Change Impact',
        text: [
            'Climate change is already having a ',
            { options: ['negligible', 'significant', 'minor'], correct: 'significant' },
            ' impact on global biodiversity. Many species are being forced to ',
            { options: ['migrate', 'hibernate', 'evolve'], correct: 'migrate' },
            ' to new habitats as their original environments become inhabitable. Scientists have ',
            { options: ['predicted', 'ignored', 'disproved'], correct: 'predicted' },
            ' that if current trends continue, thousands of species could face extinction by the end of the century.'
        ],
        appeared: 42,
        difficulty: 'Hard'
    }
]

export default function FillBlanksDropdownExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [selections, setSelections] = useState({})
    const [isChecked, setIsChecked] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        const found = readingFBQuestions.find(q => q.id === id)
        setQuestion(found || readingFBQuestions[0])
    }, [id])

    const handleSelect = (index, value) => {
        if (isChecked) return
        setSelections(prev => ({ ...prev, [index]: value }))
    }

    const checkAnswers = () => {
        let correctCount = 0
        let totalBlanks = 0

        question.text.forEach((part, index) => {
            if (typeof part === 'object') {
                totalBlanks++
                if (selections[index] === part.correct) {
                    correctCount++
                }
            }
        })

        setScore({ correct: correctCount, total: totalBlanks })
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
                        <h1 className="text-lg font-bold text-slate-800">Reading: Fill in the Blanks</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-8">
                <div className="glass-card p-8 border-none bg-white min-h-[300px] shadow-xl shadow-slate-200/50">
                    <div className="flex flex-wrap items-baseline gap-y-6 leading-[2.2]">
                        {question.text.map((part, index) => {
                            if (typeof part === 'string') {
                                return <span key={index} className="text-slate-700 font-medium text-lg mr-1">{part}</span>
                            } else {
                                const isCorrect = selections[index] === part.correct
                                return (
                                    <div key={index} className="inline-block relative mx-1 top-2">
                                        <select
                                            value={selections[index] || ''}
                                            onChange={(e) => handleSelect(index, e.target.value)}
                                            disabled={isChecked}
                                            className={`appearance-none px-4 py-1.5 rounded-xl border-2 transition-all font-bold text-sm cursor-pointer focus:outline-none min-w-[120px] ${isChecked
                                                    ? (isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-rose-50 border-rose-500 text-rose-700')
                                                    : (selections[index] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400')
                                                }`}
                                        >
                                            <option value="" disabled>Select...</option>
                                            {part.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        {!isChecked && <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-300" />}
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    {!isChecked ? (
                        <button
                            onClick={checkAnswers}
                            disabled={Object.keys(selections).length < question.text.filter(p => typeof p === 'object').length}
                            className="btn-primary py-4 px-12 rounded-3xl disabled:opacity-50 flex items-center gap-2"
                        >
                            <CheckCircle2 size={20} />
                            Check Answers
                        </button>
                    ) : (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="glass-card p-6 border-none bg-slate-900 text-white flex items-center gap-6 mb-6"
                            >
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <Sparkles className="text-primary" size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{score.correct} / {score.total}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions Correct</p>
                                </div>
                                <button
                                    onClick={() => { setIsChecked(false); setSelections({}); }}
                                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </motion.div>
                            <button className="btn-primary py-4 px-12 rounded-3xl">
                                Next Question
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
