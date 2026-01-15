import {
    readAloudQuestions,
    repeatSentenceQuestions,
    describeImageQuestions,
    reTellLectureQuestions,
    speakingExercises,
    listeningExercises,
    writingExercises,
    readingExercises
} from '../data/questions'

// Helper to calculate stats for a question array
const getStats = (questions) => {
    const total = questions?.length || 0;
    const practiced = questions?.filter(q => q.practiced > 0).length || 0;
    const percentage = total > 0 ? Math.round((practiced / total) * 100) : 0;
    return { total, practiced, percentage };
}

export const getSpeakingExercisesWithStats = () => {
    return speakingExercises.map(ex => {
        let stats = { total: 0, practiced: 0, percentage: 0 };

        switch (ex.id) {
            case 'read-aloud': stats = getStats(readAloudQuestions); break;
            case 'repeat-sentence': stats = getStats(repeatSentenceQuestions); break;
            case 'describe-image': stats = getStats(describeImageQuestions); break;
            case 're-tell-lecture': stats = getStats(reTellLectureQuestions); break;
            // For others we use existing placeholders for now
            default: stats = { total: ex.total, practiced: 0, percentage: 0 };
        }

        return {
            ...ex,
            total: stats.total || ex.total,
            progress: stats.percentage,
            newCount: (stats.total - stats.practiced) // Logic for "new"
        };
    });
}

export const getGlobalStats = () => {
    // Current implemented questions
    const implementedQuestions = [
        ...readAloudQuestions,
        ...repeatSentenceQuestions,
        ...describeImageQuestions,
        ...(reTellLectureQuestions || [])
    ];

    const implementedStats = getStats(implementedQuestions);

    // Add totals from configuration for not-yet-implemented sections
    // (Sum of totals from config arrays excluding the ones we just calculated)
    const otherSpeakingTotal = speakingExercises
        .filter(e => !['read-aloud', 'repeat-sentence', 'describe-image', 're-tell-lecture'].includes(e.id))
        .reduce((acc, curr) => acc + curr.total, 0);

    const listeningTotal = listeningExercises.reduce((acc, curr) => acc + curr.total, 0);
    const writingTotal = writingExercises.reduce((acc, curr) => acc + curr.total, 0);
    const readingTotal = readingExercises.reduce((acc, curr) => acc + curr.total, 0);

    const grandTotal = implementedStats.total + otherSpeakingTotal + listeningTotal + writingTotal + readingTotal;
    // Base practiced count (mock) + actual practiced
    const grandPracticed = 200 + implementedStats.practiced;

    return {
        totalQuestions: grandTotal,
        practicedCount: grandPracticed,
        avgScore: 68 // weighted average mock
    };
}

export const getCategoryStats = (categoryId) => {
    if (categoryId === 'speaking') {
        const questions = [
            ...readAloudQuestions,
            ...repeatSentenceQuestions,
            ...describeImageQuestions,
            ...(reTellLectureQuestions || [])
        ];
        // Add counts from un-implemented speaking types
        const othersTotal = speakingExercises
            .filter(e => !['read-aloud', 'repeat-sentence', 'describe-image', 're-tell-lecture'].includes(e.id))
            .reduce((acc, curr) => acc + curr.total, 0);

        const stats = getStats(questions);
        return {
            count: stats.total + othersTotal,
            progress: Math.round(((stats.practiced + 50) / (stats.total + othersTotal)) * 100) // +50 mock practiced for others
        };
    }
    // Return default/mock stats for other categories
    return { count: 0, progress: 0 };
}
