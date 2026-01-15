import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Mic, RotateCcw, Play, Pause, Clock, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder'
import { readAloudQuestions } from '../data/questions'
import { groqService } from '../services/groqService'

export default function ReadAloudExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [status, setStatus] = useState('idle') // idle, preparing, recording, scoring, done
    const [timer, setTimer] = useState(35)
    const [score, setScore] = useState(null)
    const [transcription, setTranscription] = useState('')
    const [activeTab, setActiveTab] = useState('text') // text, score, tips
    const [isPlayingSample, setIsPlayingSample] = useState(false)

    useEffect(() => {
        const found = readAloudQuestions.find(q => q.id === id)
        if (found) {
            setQuestion(found)
        } else if (readAloudQuestions.length > 0) {
            setQuestion(readAloudQuestions[0])
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

    // Status & Timer Logic
    useEffect(() => {
        let interval
        if (status === 'preparing' && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000)
        } else if (status === 'preparing' && timer === 0) {
            handleStartRecording()
        }
        return () => clearInterval(interval)
    }, [status, timer])

    const handleStartPreparing = () => {
        setStatus('preparing')
        setTimer(35)
    }

    const handleStartRecording = () => {
        setStatus('recording')
        startRecording()
    }

    const handleStopRecording = async () => {
        setStatus('scoring')
        const blob = await stopRecording()

        try {
            const result = await groqService.scoreReadAloud(question.text, blob)
            setScore(result)
            setTranscription(result.transcription)
            setStatus('done')
            setActiveTab('score')
        } catch (error) {
            console.error('Scoring error:', error)
            setStatus('done')
        }
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
                        <h1 className="text-lg font-bold text-slate-800">Read Aloud</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question #{question.id}</p>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center border border-white/50">
                        <Sparkles size={18} className="text-primary" />
                    </button>
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Status Card */}
                <div className="glass-card p-6 mb-6 text-center border-none">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${status === 'recording' ? 'bg-red-500 animate-pulse' :
                                status === 'preparing' ? 'bg-orange-500' : 'bg-slate-300'
                            }`} />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {status === 'idle' ? 'Ready to Start' :
                                status === 'preparing' ? `Preparing in ${timer}s` :
                                    status === 'recording' ? 'Recording Now' :
                                        status === 'scoring' ? 'AI Scoring...' : 'Exercise Complete'}
                        </span>
                    </div>

                    {status === 'idle' && (
                        <button onClick={handleStartPreparing} className="btn-primary mt-2">
                            Start Practice
                        </button>
                    )}

                    {status === 'recording' && (
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-display font-bold text-slate-800 mb-2">{formattedTime}</span>
                            <div className="flex gap-1 h-8 items-center">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, Math.random() * 32, 10] }}
                                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                        className="w-1 bg-primary/40 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    {['text', 'score', 'tips'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all capitalize ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-400 border border-slate-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'text' && (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-card p-8 min-h-[250px] border-none"
                        >
                            <p className="text-lg leading-relaxed text-slate-700 font-medium italic">
                                "{question.text}"
                            </p>
                        </motion.div>
                    )}

                    {activeTab === 'score' && (
                        <motion.div
                            key="score"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {score ? (
                                <>
                                    <div className="glass-card p-6 border-none text-center">
                                        <div className="relative w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                <circle cx="64" cy="64" r="60" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                                                <motion.circle
                                                    cx="64" cy="64" r="60" fill="none" stroke="#FF6B35" strokeWidth="8"
                                                    strokeDasharray="377"
                                                    initial={{ strokeDashoffset: 377 }}
                                                    animate={{ strokeDashoffset: 377 - (377 * (score.totalScore || 0) / 90) }}
                                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <span className="text-4xl font-display font-bold text-slate-800">{score.totalScore || 0}</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Overall Score</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="glass-card p-4 border-none">
                                            <p className="text-xl font-bold text-slate-800">{score.pronunciation || 0}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pronunciation</p>
                                        </div>
                                        <div className="glass-card p-4 border-none">
                                            <p className="text-xl font-bold text-slate-800">{score.fluency || 0}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Oral Fluency</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="glass-card p-12 border-none text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Clock className="text-slate-300" size={32} />
                                    </div>
                                    <p className="text-slate-500 font-medium">Complete the exercise to see your AI score.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent">
                <div className="max-w-md mx-auto flex items-center justify-center gap-6">
                    {status === 'recording' ? (
                        <motion.button
                            onClick={handleStopRecording}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 rounded-full bg-red-500 shadow-xl shadow-red-200 flex items-center justify-center animate-pulse-soft"
                        >
                            <div className="w-8 h-8 bg-white rounded-lg" />
                        </motion.button>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50 text-slate-400"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={handleStartPreparing}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Try Again
                            </button>

                            <button className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50 text-slate-400">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
