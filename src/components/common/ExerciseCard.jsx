import { useNavigate } from 'react-router-dom'

export default function ExerciseCard({
    icon,
    title,
    progress,
    total,
    newCount,
    prediction,
    path,
    variant = 'orange'
}) {
    const navigate = useNavigate()

    const iconBgClasses = {
        orange: 'bg-primary',
        blue: 'bg-blue-dark',
        green: 'bg-green'
    }

    const textClasses = {
        orange: 'text-primary',
        blue: 'text-blue-dark',
        green: 'text-green'
    }

    const progressPercent = total > 0 ? (progress / total) * 100 : 0

    return (
        <button
            onClick={() => navigate(path)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
        >
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`${iconBgClasses[variant]} w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm">{title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-text-muted">Progress</span>
                        <span className={`text-xs ${textClasses[variant]}`}>{progress}/{total}</span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${iconBgClasses[variant]} rounded-full transition-all duration-300`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between mt-3 text-xs">
                        <div>
                            <span className={`font-bold ${textClasses[variant]}`}>{newCount}</span>
                            <span className="text-text-muted ml-1">New</span>
                        </div>
                        <div>
                            <span className="font-bold text-text-primary">{prediction}</span>
                            <span className="text-text-muted ml-1">Prediction</span>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    )
}
