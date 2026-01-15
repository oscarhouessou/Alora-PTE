import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Mic, RotateCcw, Clock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder'
import { describeImageQuestions } from '../data/questions'

export default function DescribeImageExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)

    const [timeRemaining, setTimeRemaining] = useState(25)
    const [phase, setPhase] = useState('prep') // 'prep', 'recording', 'done'

    useEffect(() => {
        const found = describeImageQuestions.find(q => q.id === id)
        if (found) {
            setQuestion(found)
        } else if (describeImageQuestions.length > 0) {
            setQuestion(describeImageQuestions[0])
        }
    }, [id])

    const {
        isRecording,
        formattedTime,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
        resetRecording
    } = useAudioRecorder()

    useEffect(() => {
        let interval
        if (phase === 'prep' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1)
            }, 1000)
        } else if (phase === 'prep' && timeRemaining === 0) {
            handleStartRecording()
        }
        return () => clearInterval(interval)
    }, [phase, timeRemaining])

    const handleStartRecording = () => {
        setPhase('recording')
        startRecording()
    }

    const handleStopRecording = () => {
        setPhase('done')
        stopRecording()
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
                        <h1 className="text-lg font-bold text-slate-800">Describe Image</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Visual Card */}
                <div className="glass-card overflow-hidden border-none mb-6">
                    <div className="bg-slate-50/50 p-6 flex flex-col items-center">
                        <h2 className="text-slate-800 font-bold mb-4">{question.title}</h2>
                        <div className="w-full max-w-[400px] h-[250px] bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center border border-slate-100">
                            {/* Generic Chart Visual */}
                            <svg viewBox="0 0 400 250" className="w-full h-auto">
                                <line x1="50" y1="200" x2="380" y2="200" stroke="#E2E8F0" strokeWidth="2" />
                                <line x1="50" y1="20" x2="50" y2="200" stroke="#E2E8F0" strokeWidth="2" />
                                <rect x="80" y="140" width="40" height="60" fill="#FF6B35" rx="4" />
                                <rect x="140" y="100" width="40" height="100" fill="#FF8F66" rx="4" />
                                <rect x="200" y="80" width="40" height="120" fill="#4F7DF3" rx="4" />
                                <rect x="260" y="50" width="40" height="150" fill="#00D9B5" rx="4" />
                                <rect x="320" y="30" width="40" height="170" fill="#9D4EDD" rx="4" />
                                <text x="215" y="235" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 uppercase tracking-widest">Question Data Visualization</text>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Status Dashboard */}
                <div className="grid grid-cols-2 gap-4 mb-32">
                    <div className="glass-card p-5 border-none">
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="text-primary" size={16} />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {phase === 'prep' ? 'Preparation' : 'Recording'}
                            </span>
                        </div>
                        <p className="text-3xl font-display font-bold text-slate-900">
                            {phase === 'prep' ? `00:${timeRemaining.toString().padStart(2, '0')}` : formattedTime}
                        </p>
                    </div>
                    <div className="glass-card p-5 border-none flex flex-col justify-center">
                        <p className="text-xs font-bold text-slate-500 leading-tight">
                            {phase === 'prep'
                                ? 'Analyze the image and prepare your description.'
                                : phase === 'recording'
                                    ? 'Describe trends, high/low points, and conclusions.'
                                    : 'Recording complete. Review your answer.'}
                        </p>
                    </div>
                </div>
            </main>

            {/* Bottom Controls */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent">
                <div className="max-w-md mx-auto flex items-center justify-center gap-6">
                    {phase === 'recording' ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                            <motion.button
                                onClick={handleStopRecording}
                                whileTap={{ scale: 0.9 }}
                                className="relative w-24 h-24 rounded-full bg-red-500 shadow-xl shadow-red-200 flex items-center justify-center"
                            >
                                <div className="w-8 h-8 bg-white rounded-lg" />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            {phase === 'prep' ? (
                                <button
                                    onClick={handleStartRecording}
                                    className="flex-1 btn-primary py-4 rounded-3xl"
                                >
                                    Start Now
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            resetRecording()
                                            setPhase('prep')
                                            setTimeRemaining(25)
                                        }}
                                        className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50 text-slate-400"
                                    >
                                        <RotateCcw size={24} />
                                    </button>
                                    <div className="flex-1 glass-card bg-slate-100/50 p-2 flex items-center gap-3">
                                        <audio src={audioUrl} controls className="w-full h-10" />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
