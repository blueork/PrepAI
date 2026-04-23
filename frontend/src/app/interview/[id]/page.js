'use client'

import { useEffect, useState } from 'react'
import { sessions, answers } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import React from 'react'

export default function InterviewSession() {
  const { id } = useParams()
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answerText, setAnswerText] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchSession()
  }, [id])

  const fetchSession = async () => {
    try {
      const data = await sessions.getOne(id)
      if (data.overall_score !== null) {
        router.replace(`/results/${id}`)
        return
      }
      setSession(data)
      setLoading(false)
    } catch (error) {
      toast.error('Session not found')
      router.push('/dashboard')
    }
  }

  const submitAnswer = async () => {
    if (!answerText.trim()) return toast.error('Please enter an answer')
    
    setSubmitting(true)
    const currentQ = session.questions[currentIdx]
    
    try {
      const res = await answers.submit(currentQ.id, answerText)
      setFeedback(res)
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit')
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (currentIdx < session.questions.length - 1) {
      setCurrentIdx(c => c + 1)
      setAnswerText('')
      setFeedback(null)
    } else {
      router.push(`/results/${id}`)
    }
  }

  if (loading) return <div className="text-center p-20 text-textMuted">Loading interview...</div>

  const currentQ = session.questions[currentIdx]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-textPrimary">{session.role}</h2>
          <span className="text-sm px-2 py-1 rounded bg-orange-100 text-accent font-semibold">{session.difficulty}</span>
        </div>
        <div className="text-textMuted font-medium">Question {currentIdx + 1} of {session.questions.length}</div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <div className="bg-accent h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / session.questions.length) * 100}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 mb-8">
        <h3 className="text-xl text-textPrimary leading-relaxed">{currentQ.content}</h3>
      </div>

      {/* Answer Area */}
      {!feedback ? (
        <div className="bg-surface p-6 rounded-2xl shadow-sm border border-orange-100">
          <textarea
            className="w-full p-4 border rounded-xl min-h-[200px] focus:ring-secondary focus:border-secondary transition-colors"
            placeholder="Type your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            disabled={submitting}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-textMuted">{answerText.length} characters</span>
            <button
              onClick={submitAnswer}
              disabled={submitting}
              className={`px-8 py-3 rounded-xl font-bold transition-colors ${submitting ? 'bg-secondary text-white opacity-70 cursor-not-allowed' : 'bg-secondary hover:bg-teal-700 text-white shadow-md'}`}
            >
              {submitting ? 'Evaluating...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      ) : (
        /* Feedback Card */
        <div className="bg-surface p-8 rounded-2xl shadow-sm border border-orange-100 mt-8 animate-fade-in-up">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h4 className="font-bold text-xl text-textPrimary">AI Feedback</h4>
            <div className="text-center bg-white px-6 py-3 rounded-full shadow-sm border border-orange-50">
              <span className="block text-xs uppercase tracking-widest text-textMuted font-bold mb-1">Score</span>
              <span className={`text-3xl font-extrabold ${
                feedback.ai_score >= 8 ? 'text-success' : 
                feedback.ai_score >= 5 ? 'text-accent' : 'text-error'
              }`}>{feedback.ai_score}/10</span>
            </div>
          </div>
          <p className="text-textMuted leading-relaxed text-lg mb-8">{feedback.ai_feedback}</p>
          
          <button
            onClick={nextQuestion}
            className="w-full bg-accent hover:bg-orange-600 text-white py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] shadow-md shadow-orange-200"
          >
            {currentIdx < session.questions.length - 1 ? 'Next Question' : 'View Final Results'}
          </button>
        </div>
      )}

    </div>
  )
}
