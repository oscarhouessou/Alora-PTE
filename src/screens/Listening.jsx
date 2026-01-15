import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Headphones, ChevronRight, Music, FileAudio, ListMusic, Speaker } from 'lucide-react'
import BottomNav from '../components/common/BottomNav'

const exercises = [
    { id: 'summarize-spoken-text', title: 'Summarize Spoken Text', questions: 45, icon: <Music size={24} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'multiple-choice-single', title: 'Multiple Choice (Single)', questions: 120, icon: <Speaker size={24} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'fill-blanks-listening', title: 'Fill in the Blanks', questions: 180, icon: <FileAudio size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'highlight-correct-summary', title: 'Highlight Correct Summary', questions: 65, icon: <ListMusic size={24} />, color: 'text-orange-600', bg: 'bg-orange-50' },
]

export default function Listening() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            <header className="px-6 pt-12 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center hover:bg-slate-50 transition-colors border border-white/50"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Listening</h1>
                        <p className="text-sm text-slate-500 font-medium">Improve your audio comprehension</p>
                    </div>
                </div>

                <div className="glass-card p-6 border-none flex items-center gap-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl shadow-purple-100">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                        <Headphones size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Total Content</p>
                        <p className="text-xl font-bold">1,417 Questions</p>
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-4">
                {exercises.map((ex, i) => (
                    <motion.button
                        key={ex.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(`/questions/${ex.id}`)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full glass-card glass-card-hover p-4 flex items-center gap-4 text-left border-none"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${ex.bg} flex items-center justify-center font-bold text-lg ${ex.color} shadow-sm border border-white/50`}>
                            {ex.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-base mb-1 truncate">{ex.title}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ex.questions} Questions</p>
                        </div>

                        <ChevronRight className="text-slate-300" size={20} />
                    </motion.button>
                ))}
            </main>

            <BottomNav />
        </div>
    )
}
