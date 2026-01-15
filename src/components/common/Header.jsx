import { ArrowLeft, Camera, Video, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Header({
    title,
    variant = 'orange',
    showBack = true,
    showIcons = true
}) {
    const navigate = useNavigate()

    const variantClasses = {
        orange: 'bg-primary',
        blue: 'bg-blue-dark',
        green: 'bg-green',
        teal: 'bg-teal'
    }

    return (
        <header className={`${variantClasses[variant]} text-white px-4 py-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                {showBack && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                )}
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>

            {showIcons && (
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Camera size={20} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Video size={20} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Bell size={20} />
                    </button>
                </div>
            )}
        </header>
    )
}
