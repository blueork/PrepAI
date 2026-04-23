'use client'

import { useState, useEffect } from 'react'
import { auth, sessions as apiSessions } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Brain, LogOut, PlusCircle, Search, Calendar, Target, Award } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

export default function Dashboard() {
  const router = useRouter()
  const [role, setRole] = useState('')
  const [difficulty, setDifficulty] = useState('easy')
  const [sessionsData, setSessionsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const data = await apiSessions.getAll()
      setSessionsData(data)
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
        auth.logout()
        router.push('/login')
      } else {
        toast.error('Failed to load past sessions')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStart = async (e) => {
    e.preventDefault()
    if (!role.trim()) {
      toast.error('Please enter a role.')
      return
    }
    
    setIsStarting(true)
    try {
      const data = await apiSessions.create(role, difficulty)
      router.push(`/interview/${data.id}`)
    } catch (error) {
      toast.error('Failed to start interview')
    } finally {
      setIsStarting(false)
    }
  }

  const handleLogout = () => {
    auth.logout()
    router.push('/login')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  }

  return (
    <div className="bg-[#F8FAFC] font-sans text-gray-900 flex flex-col min-h-[calc(100vh-64px)]">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 md:px-12 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: New Practice Settings */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 lg:col-start-1"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-[#111827] mb-2 flex items-center">
              Welcome Back.
            </h1>
            <p className="text-gray-500 text-lg">Ready to crush your next interview?</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100">
            <h2 className="text-xl font-bold flex items-center text-gray-800 mb-6 pb-4 border-b border-gray-100">
              <span className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 text-indigo-600">
                <Rocket size={18} />
              </span>
              New Practice
            </h2>
            
            <form onSubmit={handleStart} className="space-y-6 flex flex-col h-full">
              
              {/* Role Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase ml-1 flex items-center">
                  <Target size={12} className="mr-1.5" /> Target Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-5 py-3.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400 hover:border-gray-300"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading || isStarting}
                  required
                />
              </div>

              {/* Difficulty Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 tracking-wider uppercase ml-1 flex items-center">
                  <Award size={12} className="mr-1.5" /> Difficulty
                </label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-3.5 bg-[#F8FAFC] border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium appearance-none cursor-pointer hover:border-gray-300"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={loading || isStarting}
                  >
                    <option value="easy">Easy (Entry Level)</option>
                    <option value="medium">Medium (Mid Level)</option>
                    <option value="hard">Hard (Senior Level)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || isStarting}
                className={`w-full flex items-center justify-center space-x-2 py-4 mt-4 rounded-xl font-bold text-[17px] transition-all shadow-lg hover:shadow-xl border border-transparent ${
                  isStarting || loading
                    ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40'
                }`}
              >
                <span>{isStarting ? 'Preparing...' : 'Start Interview'}</span>
                {!isStarting && <PlusCircle size={20} className="ml-1" />}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Right Column: History */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-8 lg:col-start-5 mt-12 lg:mt-0"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Interview History</h2>
            <div className="bg-white border border-gray-200 px-4 py-1.5 rounded-full flex items-center text-sm font-medium text-gray-500 shadow-sm">
              <Search size={14} className="mr-2" />
              {sessionsData.length} total session{sessionsData.length !== 1 && 's'}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-2 min-h-[400px]">
            {loading ? (
              <div className="h-full min-h-[300px] flex items-center justify-center text-gray-400">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <Brain size={32} className="text-indigo-200" />
                </motion.div>
              </div>
            ) : sessionsData.length === 0 ? (
              <div className="h-full min-h-[350px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                  <Target size={32} className="text-indigo-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No past sessions yet</h3>
                <p className="text-gray-500 max-w-sm">
                  Start your first practice interview using the panel on the left to see your history and scores here.
                </p>
              </div>
            ) : (
              <motion.div 
                variants={containerVariants} 
                initial="hidden" 
                animate="show"
                className="space-y-3 p-4"
              >
                {sessionsData.map((session) => (
                  <motion.div 
                    key={session.id} 
                    variants={itemVariants}
                    whileHover={{ y: -2, scale: 1.005 }}
                    className="p-5 rounded-xl border border-gray-100 hover:border-gray-200 bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] flex flex-col sm:flex-row sm:items-center justify-between group cursor-pointer"
                    onClick={() => router.push(`/interview/${session.id}`)}
                  >
                    <div className="flex flex-col mb-4 sm:mb-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {session.role}
                        </h4>
                        
                        {/* Difficulty Badge */}
                        {session.difficulty === 'easy' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Easy
                          </span>
                        )}
                        {session.difficulty === 'medium' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-50 text-amber-600 border border-amber-100">
                            Medium
                          </span>
                        )}
                        {session.difficulty === 'hard' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-600 border border-rose-100">
                            Hard
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-400 font-medium">
                        <Calendar size={14} className="mr-1.5" />
                        {new Date(session.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Score Badge */}
                      <div className={`px-4 py-1.5 rounded-full text-sm flex items-center font-bold ${
                        session.overall_score >= 80 ? 'bg-emerald-50 text-emerald-700' :
                        session.overall_score >= 60 ? 'bg-amber-50 text-amber-700' :
                        session.overall_score === null || session.overall_score === undefined ? 'bg-gray-50 text-gray-500' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {session.overall_score !== null && session.overall_score !== undefined ? (
                          <>
                            <span className="mr-1.5">{session.overall_score}%</span>
                            <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                              {session.overall_score >= 80 ? 'Great' : session.overall_score >= 60 ? 'Okay' : 'Needs Work'}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs uppercase tracking-wide">Incomplete</span>
                        )}
                      </div>
                      
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <svg className="w-4 h-4 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

      </main>
    </div>
  )
}