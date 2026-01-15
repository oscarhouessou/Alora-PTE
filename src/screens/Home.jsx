import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mic, Pencil, BookOpen, Headphones, ChevronRight, Sparkles, Trophy, Target } from 'lucide-react'
import BottomNav from '../components/common/BottomNav'
import { getGlobalStats, getCategoryStats } from '../utils/dataHelpers'

export default function Home() {
    const navigate = useNavigate()

    const globalStats = getGlobalStats()
    const speakingStats = getCategoryStats('speaking')

    const categories = [
        {
            id: 'speaking',
            title: 'Speaking',
            count: speakingStats.count,
            progress: speakingStats.progress,
            icon: Mic,
            gradient: 'from-[#FF6B35] to-[#FF8F66]',
            bg: 'bg-orange-50/50',
            textColor: 'text-orange-600',
            path: '/speaking'
        },
        {
            id: 'writing',
            title: 'Writing',
            count: 557,
            progress: 5,
            icon: Pencil,
            gradient: 'from-[#00D9B5] to-[#00F5CC]',
            bg: 'bg-emerald-50/50',
            textColor: 'text-emerald-600',
            path: '/writing'
        },
        {
            id: 'reading',
            title: 'Reading',
            count: 1580,
            progress: 8,
            icon: BookOpen,
            gradient: 'from-[#4F7DF3] to-[#6B8FF5]',
            bg: 'bg-blue-50/50',
            textColor: 'text-blue-600',
            path: '/reading'
        },
        {
            id: 'listening',
            title: 'Listening',
            count: 1417,
            progress: 15,
            icon: Headphones,
            gradient: 'from-[#9D4EDD] to-[#B366E6]',
            bg: 'bg-purple-50/50',
            textColor: 'text-purple-600',
            path: '/listening'
        }
    ]

    const stats = [
        { label: 'Questions', value: globalStats.totalQuestions.toLocaleString(), icon: Target, color: 'text-blue-600' },
        { label: 'Practiced', value: globalStats.practicedCount.toLocaleString(), icon: Sparkles, color: 'text-orange-500' },
        { label: 'Best Score', value: globalStats.avgScore.toString(), icon: Trophy, color: 'text-emerald-500' }
    ]

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            {/* Header Section */}
            <header className="px-6 pt-12 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-1">Hi, Alex! 👋</h1>
                        <p className="text-slate-500 font-medium">Ready for your PTE goal?</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center border border-white/50">
                        <Trophy className="text-primary" size={24} />
                    </div>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-4 flex flex-col items-center justify-center text-center"
                        >
                            <div className={`mb-2 p-2 rounded-xl bg-white/50 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </header>

            {/* Main Grid */}
            <main className="px-6">
                <h2 className="text-xl font-bold text-slate-800 mb-5 px-1">Practice Areas</h2>
                <div className="grid grid-cols-2 gap-5">
                    {categories.map((cat, i) => (
                        <motion.button
                            key={cat.id}
                            onClick={() => navigate(cat.path)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            whileTap={{ scale: 0.95 }}
                            className="glass-card glass-card-hover group p-5 text-left border-none relative overflow-hidden"
                        >
                            {/* Decorative Gradient Blob */}
                            <div className={`absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br ${cat.gradient} opacity-5 blur-2xl group-hover:opacity-15 transition-opacity`} />

                            <div className={`w-12 h-12 rounded-2xl ${cat.bg} mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm`}>
                                <cat.icon className={cat.textColor} size={24} />
                            </div>

                            <h3 className="font-bold text-slate-800 mb-1 text-lg">{cat.title}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-4">{cat.count.toLocaleString()} Questions</p>

                            <div className="flex items-center justify-between">
                                <div className="flex-1 mr-4">
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.progress}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                            className={`h-full bg-gradient-to-r ${cat.gradient} rounded-full`}
                                        />
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-400">{cat.progress}%</span>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Promo/Tip Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 glass-card p-6 bg-gradient-to-r from-slate-900 to-slate-800 border-none shadow-xl shadow-slate-200"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full mb-3 uppercase tracking-widest">Premium Tip</span>
                            <h3 className="text-white font-bold text-lg mb-2">Ace the Speaking Section</h3>
                            <p className="text-slate-400 text-sm mb-4 leading-relaxed">Consistency is key. Practice 15 minutes daily to see a 40% improvement.</p>
                            <button className="px-6 py-2 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">Start Goal</button>
                        </div>
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
                            <Sparkles size={40} className="text-primary animate-pulse-soft" />
                        </div>
                    </div>
                </motion.div>
            </main>

            <BottomNav />
        </div>
    )
}
