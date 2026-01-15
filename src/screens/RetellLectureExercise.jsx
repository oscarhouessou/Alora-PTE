import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Mic, RotateCcw, Play, Pause, Clock, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder'
import { reTellLectureQuestions } from '../data/questions'

export default function RetellLectureExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)

    const [phase, setPhase] = useState('listen') // 'listen', 'prep', 'recording', 'done'
    const [isPlaying, setIsPlaying] = useState(false)
    const [playProgress, setPlayProgress] = useState(0)

    useEffect(() => {
        const found = reTellLectureQuestions.find(q => q.id === id)
        if (found) {
            setQuestion(found)
        } else if (reTellLectureQuestions.length > 0) {
            setQuestion(reTellLectureQuestions[0])
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

    if (!question) return null

    const handlePlayLecture = () => {
        setIsPlaying(true)
        // Simulate lecture playing
        let progress = 0
        const interval = setInterval(() => {
            progress += 1
            setPlayProgress(progress)
            if (progress >= 100) {
                clearInterval(interval)
                setIsPlaying(false)
                setPhase('prep')
            }
        }, 300)
    }

    const handleStartRecording = () => {
        setPhase('recording')
        startRecording()
    }

    const handleStopRecording = () => {
        setPhase('done')
        stopRecording()
    }

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
                        <h1 className="text-lg font-bold text-slate-800">Re-Tell Lecture</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Question Info Card */}
                <div className="glass-card p-6 mb-6 border-none flex justify-between items-center bg-white/80">
                    <div>
                        <h2 className="font-bold text-slate-800">{question.title}</h2>
                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Duration: ~{question.duration}s</p>
                    </div>
                    <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                        APPEARED ({question.appeared})
                    </div>
                </div>

                {/* Player Card */}
                <div className="glass-card p-10 mb-6 flex flex-col items-center justify-center border-none relative overflow-hidden bg-white/40">
                    <div className="relative">
                        <motion.button
                            onClick={handlePlayLecture}
                            disabled={isPlaying || phase !== 'listen'}
                            whileTap={{ scale: 0.95 }}
                            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${phase === 'listen'
                                    ? 'bg-secondary hover:bg-secondary/80 text-white'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                }`}
                        >
                            {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                        </motion.button>

                        {/* Progress ring */}
                        {isPlaying && (
                            <svg className="absolute inset-[-8px] w-[96px] h-[96px] -rotate-90 pointer-events-none">
                                <circle cx="48" cy="48" r="44" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                                <motion.circle
                                    cx="48" cy="48" r="44" stroke="#4F7DF3" strokeWidth="4" fill="none"
                                    strokeDasharray="276"
                                    strokeDashoffset={276 - (276 * playProgress / 100)}
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                    </div>

                    <p className="text-center text-sm font-bold text-slate-600 mt-8">
                        {phase === 'listen' && !isPlaying ? 'Tap to listen to the lecture' :
                            isPlaying ? 'Listening in progress...' :
                                phase === 'prep' ? 'Lecture finished. Prepare your summary.' :
                                    phase === 'recording' ? 'Now summarize what you heard' : 'Recording complete'}
                    </p>
                </div>

                {/* Recording Progress */}
                {(phase === 'prep' || phase === 'recording' || phase === 'done') && (
                    <div className="glass-card p-6 border-none bg-white/80">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-secondary" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {phase === 'prep' ? 'Prep Time' : 'Recording Time'}
                                </span>
                            </div>
                            <span className="text-xl font-display font-bold text-slate-800">
                                {phase === 'recording' ? formattedTime : '00:40'}
                            </span>
                        </div>

                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-secondary"
                                initial={{ width: 0 }}
                                animate={{ width: phase === 'recording' ? '100%' : '0%' }}
                                transition={{ duration: 40, ease: "linear" }}
                            />
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent">
                <div className="max-w-md mx-auto flex items-center justify-center gap-6">
                    {phase === 'recording' ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                            <motion.button
                                onClick={handleStopRecording}
                                whileTap={{ scale: 0.9 }}
                                className="relative w-20 h-20 rounded-full bg-red-500 shadow-xl shadow-red-200 flex items-center justify-center"
                            >
                                <Mic size={32} className="text-white" />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 w-full">
                            <button
                                onClick={() => {
                                    resetRecording()
                                    setPhase('listen')
                                    setPlayProgress(0)
                                }}
                                className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50 text-slate-400"
                            >
                                <RotateCcw size={24} />
                            </button>

                            <button
                                onClick={phase === 'listen' ? handlePlayLecture : handleStartRecording}
                                disabled={isPlaying}
                                className="flex-1 bg-secondary text-white font-bold py-4 rounded-3xl shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {phase === 'listen' ? 'Start Lecture' : phase === 'prep' ? 'Start Recording' : 'Retell Again'}
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
