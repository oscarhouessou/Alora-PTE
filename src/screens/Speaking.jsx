import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic, ChevronRight, LayoutGrid } from 'lucide-react'
import { getSpeakingExercisesWithStats, getCategoryStats } from '../utils/dataHelpers'
import BottomNav from '../components/common/BottomNav'

export default function Speaking() {
    const navigate = useNavigate()

    const exercisesWithStats = getSpeakingExercisesWithStats()
    const stats = getCategoryStats('speaking')

    const exercises = exercisesWithStats.map((ex, i) => ({
        ...ex,
        color: [
            'from-[#FF6B35] to-[#FF8F66]',
            'from-[#4F7DF3] to-[#6B8FF5]',
            'from-[#00D9B5] to-[#00F5CC]',
            'from-[#9D4EDD] to-[#B366E6]',
            'from-[#FF6B9D] to-[#FF8FB3]',
            'from-slate-600 to-slate-800'
        ][i % 6],
        lightBg: [
            'bg-orange-50',
            'bg-blue-50',
            'bg-emerald-50',
            'bg-purple-50',
            'bg-pink-50',
            'bg-slate-50'
        ][i % 6],
        iconColor: [
            'text-orange-600',
            'text-blue-600',
            'text-emerald-600',
            'text-purple-600',
            'text-pink-600',
            'text-slate-600'
        ][i % 6]
    }))

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            {/* Header */}
            <header className="px-6 pt-12 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center hover:bg-slate-50 transition-colors border border-white/50"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Speaking</h1>
                        <p className="text-sm text-slate-500 font-medium">Practice your pronunciation</p>
                    </div>
                </div>

                {/* Category Stats Dashboard */}
                <div className="glass-card p-6 grid grid-cols-3 gap-8">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{stats.count.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Found</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <p className="text-2xl font-bold text-primary">147</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Practiced</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-500">72</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Avg Score</p>
                    </div>
                </div>
            </header>

            {/* Exercise List */}
            <main className="px-6 space-y-4">
                {exercises.map((ex, i) => (
                    <motion.button
                        key={ex.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => navigate(ex.path)}
                        whileTap={{ scale: 0.98 }}
                        className="w-full glass-card glass-card-hover p-4 flex items-center gap-4 text-left border-none"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${ex.lightBg} flex items-center justify-center font-bold text-lg ${ex.iconColor} shadow-sm border border-white/50`}>
                            {ex.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-base mb-1 truncate">{ex.title}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400">{ex.total} Qs</span>
                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                <span className={`text-xs font-bold ${ex.iconColor}`}>{ex.newCount} New</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="absolute inset-0 w-10 h-10 -rotate-90">
                                    <circle cx="20" cy="20" r="18" fill="none" stroke="#F1F5F9" strokeWidth="3" />
                                    <motion.circle
                                        cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="3"
                                        strokeDasharray="113"
                                        initial={{ strokeDashoffset: 113 }}
                                        animate={{ strokeDashoffset: 113 - (113 * ex.progress / 100) }}
                                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                        className={ex.iconColor}
                                    />
                                </svg>
                                <span className="text-[9px] font-bold text-slate-500">{ex.progress}%</span>
                            </div>
                            <ChevronRight className="text-slate-300" size={16} />
                        </div>
                    </motion.button>
                ))}
            </main>

            <BottomNav />
        </div>
    )
}
