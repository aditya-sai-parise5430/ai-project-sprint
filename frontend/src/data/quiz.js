// Readiness Check questions and scoring logic

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Have you written Python code before?',
    options: [
      { label: 'Yes, I\'m comfortable with Python', value: 3 },
      { label: 'I\'ve tried it a few times', value: 2 },
      { label: 'Not really, but I want to learn', value: 1 },
      { label: 'No, I haven\'t tried yet', value: 0 },
    ],
  },
  {
    id: 'q2',
    question: 'Which AI domain excites you most?',
    options: [
      { label: '🧠 Natural Language Processing (chatbots, text analysis)', value: 'NLP' },
      { label: '👁️ Computer Vision (image recognition, cameras)', value: 'CV' },
      { label: '📊 Machine Learning (predictions, data patterns)', value: 'ML' },
      { label: '🤖 Automation & AI Agents', value: 'Automation' },
      { label: '✨ Other / Not Sure Yet', value: 'Other' },
    ],
    isInterest: true,
  },
  {
    id: 'q3',
    question: 'What\'s your primary goal right now?',
    options: [
      { label: '🏢 Get a placement at a top company', value: 'Placement' },
      { label: '💼 Land a tech internship', value: 'Internship' },
      { label: '🚀 Build a startup / side project', value: 'Startup' },
      { label: '📚 Learn AI fundamentals properly', value: 'Learning' },
    ],
    isGoal: true,
  },
  {
    id: 'q4',
    question: 'Have you deployed any project online before?',
    options: [
      { label: 'Yes, I have live projects people can use', value: 3 },
      { label: 'I\'ve tried but it wasn\'t fully working', value: 2 },
      { label: 'No, but I know GitHub', value: 1 },
      { label: 'No, I haven\'t tried yet', value: 0 },
    ],
  },
  {
    id: 'q5',
    question: 'How would your friends describe your coding skills?',
    options: [
      { label: '"Go-to person for code help"', value: 3 },
      { label: '"Pretty decent, writes working code"', value: 2 },
      { label: '"Still learning, getting better"', value: 1 },
      { label: '"Just started, exploring"', value: 0 },
    ],
  },
]

/**
 * Compute readiness level from answers array.
 * Returns { score, maxScore, percentage, level, message }
 */
export function computeReadinessResult(answers) {
  const numericAnswers = answers.filter(a => typeof a === 'number')
  const score = numericAnswers.reduce((sum, a) => sum + a, 0)
  const maxScore = 3 * numericAnswers.length // 3 pts per numeric question

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  let level, message, color
  if (percentage >= 70) {
    level = 'AI Ready'
    message = "You're well-positioned to build your first AI project. Let's do this! 🚀"
    color = '#10b981'
  } else if (percentage >= 40) {
    level = 'Almost There'
    message = "A few building blocks away. This workshop is exactly what you need. ⚡"
    color = '#f59e0b'
  } else {
    level = 'Perfect Timing'
    message = "You're starting at the right moment. We'll take you from zero to deployed AI project. 🌱"
    color = '#6366f1'
  }

  return { score, maxScore, percentage, level, message, color }
}
