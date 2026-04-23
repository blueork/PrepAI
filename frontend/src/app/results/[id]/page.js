'use client'

import { useEffect, useState } from 'react'
import { sessions } from '@/lib/api'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import React from 'react'
import { CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, XCircle } from 'lucide-react'

export default function Results() {
  const { id } = useParams()
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [id])

  const fetchResults = async () => {
    try {
      const data = await sessions.getResults(id)
      setResults(data)
    } catch (error) {
      toast.error('Results not found')
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-20 text-textMuted">Compiling results...</div>
  if (!results) return null

  const getScoreColor = (score) => {
    // Score is historically out of 100 for overall, and out of 10 per question
    if (score >= 70 || score >= 7) return 'text-success border-success bg-green-50'
    if (score >= 50 || score >= 5) return 'text-yellow-600 border-yellow-400 bg-yellow-50'
    return 'text-error border-error bg-red-50'
  }

  const getScoreIcon = (score) => {
    if (score >= 70 || score >= 7) return <CheckCircle2 className="text-success w-8 h-8"/>
    if (score >= 50 || score >= 5) return <AlertTriangle className="text-yellow-600 w-8 h-8"/>
    return <XCircle className="text-error w-8 h-8"/>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <Link href="/dashboard" className="text-textMuted hover:text-accent flex items-center gap-2 transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-accent font-semibold flex items-center gap-2">
          <RefreshCw size={20} /> Retake (New Session)
        </button>
      </div>

      {/* Overall Score Card */}
      <div className="bg-surface rounded-3xl p-10 text-center shadow-sm border border-orange-100 mb-12 flex flex-col justify-center items-center">
        <h2 className="text-3xl font-extrabold text-textPrimary mb-2">Interview Results</h2>
        <p className="text-textMuted font-medium mb-12 capitalize tracking-wider">Role: {results.role} <span className="opacity-50 mx-2">•</span> Difficulty: {results.difficulty}</p>
        
        <div className={`relative w-48 h-48 rounded-full border-8 flex items-center justify-center shadow-inner ${getScoreColor(results.overall_score).split(' ')[1]} bg-white mx-auto`}>
          <div className="text-center">
            <span className={`text-6xl font-black ${getScoreColor(results.overall_score).split(' ')[0]}`}>
              {results.overall_score}
            </span>
            <span className="block text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">/ 100</span>
          </div>
        </div>
        <p className="mt-8 text-xl font-medium text-textPrimary">Your overall performance</p>
      </div>

      {/* Questions Breakdown */}
      <h3 className="text-2xl font-bold text-textPrimary mb-8 flex items-center gap-3">
        Question Breakdown 
        <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{results.questions.length} items</span>
      </h3>
      
      <div className="space-y-8">
        {results.questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            
            {/* Question Header */}
            <div className="bg-gray-50 p-6 flex gap-4 items-start border-b border-gray-100">
              <div className="bg-white font-bold text-gray-500 w-10 h-10 flex items-center justify-center rounded-xl shadow-sm shrink-0">
                {idx + 1}
              </div>
              <p className="text-lg font-medium text-textPrimary leading-relaxed pt-1 w-full">{q.content}</p>
            </div>

            {/* Answer & Feedback Body */}
            <div className="p-6 md:p-8 space-y-6">
              
              {/* User Answer */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-textMuted font-bold mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent inline-block"></span> Your Answer
                </h4>
                <p className="text-textPrimary bg-surface p-5 rounded-xl border border-orange-50 leading-relaxed font-medium">
                  {q.answer ? q.answer.user_answer : <span className="text-gray-400 italic">No answer provided</span>}
                </p>
              </div>

              {/* AI Feedback */}
              {q.answer && (
                <div className={`p-6 rounded-xl border ${getScoreColor(q.answer.ai_score)} flex flex-col md:flex-row gap-6 items-start`}>
                  <div className="shrink-0 pt-1">
                    {getScoreIcon(q.answer.ai_score)}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-gray-900 tracking-wide">AI Evaluation</h4>
                      <span className="font-black text-xl">{q.answer.ai_score}/10</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-[15px]">
                      {q.answer.ai_feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
