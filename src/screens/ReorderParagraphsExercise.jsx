import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, GripVertical, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/common/BottomNav'

// Mock data for Reorder Paragraphs
const reorderQuestions = [
    {
        id: '3002001',
        title: 'Scientific Method',
        paragraphs: [
            { id: 'p1', text: 'This initial research helps the scientist to form a hypothesis, which is a testable prediction.' },
            { id: 'p2', text: 'First, the scientist observes a phenomenon and gathers information about it through research.' },
            { id: 'p3', text: 'If the data supports the hypothesis, the scientist may develop a theory to explain the results.' },
            { id: 'p4', text: 'Next, an experiment is conducted to collect data and either support or refute the hypothesis.' }
        ],
        correctOrder: ['p2', 'p1', 'p4', 'p3'],
        appeared: 35,
        difficulty: 'Medium'
    }
]

export default function ReorderParagraphsExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [items, setItems] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [score, setScore] = useState(0)

    useEffect(() => {
        const found = reorderQuestions.find(q => q.id === id)
        const qData = found || reorderQuestions[0]
        setQuestion(qData)
        // Shuffle for initial state
        setItems([...qData.paragraphs].sort(() => Math.random() - 0.5))
    }, [id])

    const checkOrder = () => {
        let correctCount = 0
        items.forEach((item, index) => {
            if (item.id === question.correctOrder[index]) {
                correctCount++
            }
        })
        setScore(correctCount)
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
                        <h1 className="text-lg font-bold text-slate-800">Reorder Paragraphs</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-8">
                <div className="mb-6 bg-white/50 p-4 rounded-2xl border border-white/80">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Drag the boxes to put them in the correct order</p>
                </div>

                <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-4">
                    {items.map((item, index) => {
                        const isCorrectInSpot = isChecked && item.id === question.correctOrder[index]
                        return (
                            <Reorder.Item
                                key={item.id}
                                value={item}
                                dragListener={!isChecked}
                                className={`glass-card p-5 cursor-grab active:cursor-grabbing flex gap-4 items-center transition-all border-none ${isChecked
                                        ? (isCorrectInSpot ? 'bg-emerald-50 shadow-emerald-100 ring-2 ring-emerald-500' : 'bg-rose-50 shadow-rose-100 ring-2 ring-rose-500')
                                        : 'bg-white hover:bg-slate-50'
                                    }`}
                            >
                                <div className="text-slate-300">
                                    <GripVertical size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{item.text}</p>
                                </div>
                                {isChecked && (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCorrectInSpot ? 'bg-emerald-500' : 'bg-rose-500'} text-white text-[10px] font-bold`}>
                                        {index + 1}
                                    </div>
                                )}
                            </Reorder.Item>
                        )
                    })}
                </Reorder.Group>

                <div className="mt-12 flex justify-center">
                    {!isChecked ? (
                        <button
                            onClick={checkOrder}
                            className="btn-primary py-4 px-12 rounded-3xl flex items-center gap-2"
                        >
                            <CheckCircle2 size={20} />
                            Verify Order
                        </button>
                    ) : (
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="glass-card p-6 border-none bg-slate-900 text-white flex items-center gap-8 mb-6"
                            >
                                <div>
                                    <p className="text-2xl font-bold">{score} / {question.paragraphs.length}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correct Spots</p>
                                </div>
                                <div className="w-px h-10 bg-white/10" />
                                <button
                                    onClick={() => { setIsChecked(false); setItems([...items].sort(() => Math.random() - 0.5)); }}
                                    className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    <RotateCcw size={20} />
                                </button>
                            </motion.div>
                            <button className="btn-primary py-4 px-12 rounded-3xl">
                                Next Exercise
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <BottomNav />
        </div>
    )
}
