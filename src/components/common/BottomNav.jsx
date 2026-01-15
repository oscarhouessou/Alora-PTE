import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Mic, Pencil, BookOpen, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'

const navItems = [
    { id: 'home', icon: Home, path: '/', label: 'Home' },
    { id: 'speaking', icon: Mic, path: '/speaking', label: 'Speaking' },
    { id: 'writing', icon: Pencil, path: '/writing', label: 'Writing' },
    { id: 'reading', icon: BookOpen, path: '/reading', label: 'Reading' },
    { id: 'listening', icon: Headphones, path: '/listening', label: 'Listening' },
]

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="nav-blur flex justify-between items-center">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path))

                return (
                    <button
                        key={item.id}
                        onClick={() => navigate(item.path)}
                        className="relative p-2 flex flex-col items-center gap-1 group"
                    >
                        <item.icon
                            size={22}
                            className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-400 group-hover:text-slate-600'
                                }`}
                        />
                        {isActive && (
                            <motion.div
                                layoutId="nav-pill"
                                className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                )
            })}
        </nav>
    )
}
