import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './screens/Home'
import Speaking from './screens/Speaking'
import Listening from './screens/Listening'
import Writing from './screens/Writing'
import Reading from './screens/Reading'
import QuestionList from './screens/QuestionList'
import ReadAloudExercise from './screens/ReadAloudExercise'
import RepeatSentenceExercise from './screens/RepeatSentenceExercise'
import DescribeImageExercise from './screens/DescribeImageExercise'
import RetellLectureExercise from './screens/RetellLectureExercise'
import SummarizeWrittenTextExercise from './screens/SummarizeWrittenTextExercise'
import EssayExercise from './screens/EssayExercise'
import FillBlanksDropdownExercise from './screens/FillBlanksDropdownExercise'
import ReorderParagraphsExercise from './screens/ReorderParagraphsExercise'
import SummarizeSpokenTextExercise from './screens/SummarizeSpokenTextExercise'
import FillBlanksListeningExercise from './screens/FillBlanksListeningExercise'
import HighlightCorrectSummaryExercise from './screens/HighlightCorrectSummaryExercise'
import MultipleChoiceListeningExercise from './screens/MultipleChoiceListeningExercise'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-light">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speaking" element={<Speaking />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/reading" element={<Reading />} />
          <Route path="/questions/:type" element={<QuestionList />} />
          <Route path="/exercise/read-aloud/:id" element={<ReadAloudExercise />} />
          <Route path="/exercise/repeat-sentence/:id" element={<RepeatSentenceExercise />} />
          <Route path="/exercise/describe-image/:id" element={<DescribeImageExercise />} />
          <Route path="/exercise/re-tell-lecture/:id" element={<RetellLectureExercise />} />
          <Route path="/exercise/summarize-written-text/:id" element={<SummarizeWrittenTextExercise />} />
          <Route path="/exercise/write-essay/:id" element={<EssayExercise />} />
          <Route path="/exercise/reading-fill-blanks/:id" element={<FillBlanksDropdownExercise />} />
          <Route path="/exercise/reorder-paragraphs/:id" element={<ReorderParagraphsExercise />} />
          <Route path="/exercise/summarize-spoken-text/:id" element={<SummarizeSpokenTextExercise />} />
          <Route path="/exercise/fill-blanks-listening/:id" element={<FillBlanksListeningExercise />} />
          <Route path="/exercise/highlight-correct-summary/:id" element={<HighlightCorrectSummaryExercise />} />
          <Route path="/exercise/multiple-choice-single/:id" element={<MultipleChoiceListeningExercise />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
