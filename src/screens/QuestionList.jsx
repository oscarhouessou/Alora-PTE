import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ChevronRight, Filter } from 'lucide-react'
import {
    readAloudQuestions,
    repeatSentenceQuestions,
    describeImageQuestions,
    reTellLectureQuestions
} from '../data/questions'
import BottomNav from '../components/common/BottomNav'

// Basic mock data for other sections if not yet in data/questions.js
const swtQuestions = [{ id: '2001001', title: 'The Great Barrier Reef', difficulty: 'Medium', appeared: 15, isNew: true }]
const essayQuestions = [{ id: '2002001', title: 'Technology & Human Connection', difficulty: 'Difficult', appeared: 28, isNew: true }]
const readingFBQuestions = [{ id: '3001001', title: 'Climate Change Impact', difficulty: 'Hard', appeared: 42, isNew: true }]
const reorderQuestions = [{ id: '3002001', title: 'Scientific Method', difficulty: 'Medium', appeared: 35, isNew: true }]
const sstQuestions = [{ id: '4001001', title: 'The Evolution of Languages', difficulty: 'Medium', appeared: 18, isNew: true }]
const listeningFBQuestions = [{ id: '4003001', title: 'Marine Biology Lecture', difficulty: 'Medium', appeared: 22, isNew: true }]
const hcsQuestions = [{ id: '4005001', title: 'Future of Urban Planning', difficulty: 'Medium', appeared: 12, isNew: true }]
const mcListeningQuestions = [{ id: '4002001', title: 'Space Exploration Funding', difficulty: 'Medium', appeared: 25, isNew: true }]

export default function QuestionList() {
    const { type } = useParams()
    const navigate = useNavigate()
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const getQuestions = () => {
        switch (type) {
            case 'read-aloud': return readAloudQuestions
            case 'repeat-sentence': return repeatSentenceQuestions
            case 'describe-image': return describeImageQuestions
            case 're-tell-lecture': return reTellLectureQuestions
            case 'summarize-written-text': return swtQuestions
            case 'write-essay': return essayQuestions
            case 'reading-fill-blanks': return readingFBQuestions
            case 'reorder-paragraphs': return reorderQuestions
            case 'summarize-spoken-text': return sstQuestions
            case 'fill-blanks-listening': return listeningFBQuestions
            case 'highlight-correct-summary': return hcsQuestions
            case 'multiple-choice-single': return mcListeningQuestions
            default: return []
        }
    }

    const questions = getQuestions()

    const getTitle = () => {
        const titles = {
            'read-aloud': 'Read Aloud',
            'repeat-sentence': 'Repeat Sentence',
            'describe-image': 'Describe Image',
            're-tell-lecture': 'Re-Tell Lecture',
            'summarize-written-text': 'Summarize Written Text',
            'write-essay': 'Write Essay',
            'reading-fill-blanks': 'Reading: Fill blanks',
            'reorder-paragraphs': 'Reorder Paragraphs',
            'summarize-spoken-text': 'Summarize Spoken Text',
            'fill-blanks-listening': 'Listening: Fill blanks',
            'highlight-correct-summary': 'Highlight Correct Summary',
            'multiple-choice-single': 'Multiple Choice'
        }
        return titles[type] || 'Questions'
    }

    const getActiveColorClass = () => {
        const colors = {
            'read-aloud': 'bg-orange-600',
            'repeat-sentence': 'bg-blue-600',
            'describe-image': 'bg-emerald-600',
            're-tell-lecture': 'bg-purple-600',
            'summarize-written-text': 'bg-emerald-600',
            'write-essay': 'bg-orange-600',
            'reading-fill-blanks': 'bg-blue-600',
            'reorder-paragraphs': 'bg-amber-600',
            'summarize-spoken-text': 'bg-purple-600',
            'fill-blanks-listening': 'bg-emerald-600',
            'highlight-correct-summary': 'bg-orange-600',
            'multiple-choice-single': 'bg-blue-600'
        }
        return `${colors[type] || 'bg-primary'} text-white shadow-lg shadow-black/10`
    }

    const handleQuestionClick = (questionId) => {
        navigate(`/exercise/${type}/${questionId}`)
    }

    const filteredQuestions = questions.filter(q => {
        if (filter === 'practiced' && q.practiced === 0) return false
        if (filter === 'not-practiced' && q.practiced > 0) return false
        if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="min-h-screen bg-bg-light pb-32 bg-mesh-primary">
            <header className="px-6 pt-12 pb-6">
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-xl bg-white shadow-premium flex items-center justify-center border border-white/50"
                    >
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{getTitle()}</h1>
                        <p className="text-sm text-slate-500 font-medium">{questions.length} questions available</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-slate-800 focus:outline-none shadow-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['all', 'not-practiced', 'practiced'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? getActiveColorClass() : 'bg-white text-slate-500 border border-slate-100'
                                    }`}
                            >
                                {f === 'all' ? 'All' : f === 'not-practiced' ? 'New' : 'Practiced'}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-3">
                {filteredQuestions.map((q, i) => (
                    <motion.button
                        key={q.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleQuestionClick(q.id)}
                        className="w-full glass-card p-4 text-left glass-card-hover group border-none"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">#{q.id}</span>
                            {q.isNew && <span className="tag tag-new">New</span>}
                        </div>

                        <h3 className="font-bold text-slate-800 text-base mb-3 group-hover:text-primary transition-colors">
                            {q.title}
                        </h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className={`tag ${q.difficulty === 'Easy' ? 'tag-easy' :
                                        q.difficulty === 'Medium' ? 'tag-medium' : 'tag-difficult'
                                    }`}>
                                    {q.difficulty}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {q.appeared} Appearances
                                </span>
                            </div>
                            <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-all" />
                        </div>
                    </motion.button>
                ))}
            </main>

            <BottomNav />
        </div>
    )
}
