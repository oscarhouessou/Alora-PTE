import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Mic, RotateCcw, Play, Pause, Clock, Volume2 } from 'lucide-react'
import { motion } from 'framer-motion'
import useAudioRecorder from '../hooks/useAudioRecorder'
import { repeatSentenceQuestions } from '../data/questions'

export default function RepeatSentenceExercise() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [question, setQuestion] = useState(null)
    const [status, setStatus] = useState('idle') // idle, playing, recording, done
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
        const found = repeatSentenceQuestions.find(q => q.id === id)
        if (found) {
            setQuestion(found)
        } else if (repeatSentenceQuestions.length > 0) {
            setQuestion(repeatSentenceQuestions[0])
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

    const handlePlayAudio = () => {
        setIsPlaying(true)
        setStatus('playing')
        // Simulate audio play
        setTimeout(() => {
            setIsPlaying(false)
            setStatus('recording')
            startRecording()
        }, 3000)
    }

    const handleStopRecording = () => {
        setStatus('done')
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
                        <h1 className="text-lg font-bold text-slate-800">Repeat Sentence</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Question #{question.id}</p>
                    </div>
                    <div className="w-10 h-10" />
                </div>
            </header>

            <main className="px-6 mt-4">
                {/* Audio Playing Card */}
                <div className="glass-card p-12 mb-6 flex flex-col items-center justify-center border-none relative overflow-hidden">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'playing' ? 'bg-primary shadow-xl shadow-primary/20 scale-110' : 'bg-slate-100'
                        }`}>
                        <Volume2 size={40} className={status === 'playing' ? 'text-white animate-pulse' : 'text-slate-400'} />
                    </div>

                    <p className="mt-8 text-center font-bold text-slate-700">
                        {status === 'idle' ? 'Ready to listen?' :
                            status === 'playing' ? 'Listen carefully...' :
                                status === 'recording' ? 'Now repeat the sentence' : 'Recording finished'}
                    </p>

                    {status === 'idle' && (
                        <button onClick={handlePlayAudio} className="btn-primary mt-6">
                            Play Audio
                        </button>
                    )}

                    {status === 'playing' && (
                        <div className="mt-6 flex gap-1 h-3 items-center">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-primary/40 rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Status Row */}
                <div className="flex gap-4 mb-32">
                    <div className="flex-1 glass-card p-5 border-none text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center justify-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${status === 'recording' ? 'bg-red-500' : 'bg-slate-300'}`} />
                            <span className="font-bold text-slate-800 text-sm capitalize">{status}</span>
                        </div>
                    </div>
                    <div className="flex-1 glass-card p-5 border-none text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timer</p>
                        <p className="font-bold text-slate-800 text-sm">{formattedTime}</p>
                    </div>
                </div>
            </main>

            {/* Sticky Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-light via-bg-light/90 to-transparent">
                <div className="max-w-md mx-auto flex items-center justify-center gap-6">
                    {status === 'recording' ? (
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
                                    setStatus('idle')
                                }}
                                className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50 text-slate-400"
                            >
                                <RotateCcw size={24} />
                            </button>

                            <button
                                onClick={handlePlayAudio}
                                disabled={status === 'playing'}
                                className="flex-1 bg-primary text-white font-bold py-4 rounded-3xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {status === 'done' ? 'Retry' : 'Listen Again'}
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
