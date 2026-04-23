'use client'

import { useState } from 'react'
import { auth } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { ArrowRight, Brain } from 'lucide-react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await auth.login(email, password)
      if (data?.access_token) {
        toast.success('Welcome back!')
        router.push('/dashboard')
      } else {
        toast.error('Login failed')
      }
    } catch (error) {
      toast.error('Invalid credentials, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FAFAFA] font-sans">
      
      {/* Left Panel */}
      <div className="relative w-full lg:w-1/2 bg-[#0F172A] p-10 lg:p-20 text-white flex flex-col justify-center overflow-hidden">
        
        {/* Animated Background Mesh/Orbs */}
        <div className="absolute inset-0 z-0 opacity-40">
          <motion.div 
            animate={{ x: [0, 40, 0], y: [0, -40, 0] }} 
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-indigo-600/30 blur-[100px]"
          />
          <motion.div 
            animate={{ x: [0, -30, 0], y: [0, 50, 0] }} 
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] rounded-full bg-violet-600/30 blur-[100px]"
          />
        </div>

        <div className="relative z-10 lg:flex-grow flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl lg:text-6xl font-black leading-tight mb-2">Welcome Back.</h2>
            <h3 className="text-3xl lg:text-5xl font-semibold text-gray-300 mb-6">Resume Your Practice.</h3>
            <p className="text-lg lg:text-xl text-gray-400 max-w-md font-medium leading-relaxed mb-12">
              Top candidates use PrepAI to simulate difficult technical interviews and get instant feedback.
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 flex items-center space-x-4 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-max max-w-full"
        >
          <div className="flex -space-x-3 shrink-0">
            <div className="w-10 h-10 bg-indigo-300 rounded-full border-2 border-[#0F172A]"></div>
            <div className="w-10 h-10 bg-violet-300 rounded-full border-2 border-[#0F172A]"></div>
            <div className="w-10 h-10 bg-indigo-200 rounded-full border-2 border-[#0F172A]"></div>
          </div>
          <div>
            <p className="font-bold tracking-wide text-sm lg:text-base">Join 10,000+ Users</p>
            <p className="text-xs lg:text-sm font-medium text-gray-400">Securing jobs at top startups.</p>
          </div>
        </motion.div>

      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 bg-[#FAFAFA] relative">
        <div className="w-full max-w-md">
          
          <div className="mb-10 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-white flex justify-center items-center rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] border border-gray-100 mb-6">
               <Brain size={28} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Sign in</h2>
            <p className="text-gray-500 font-medium text-base">Enter your details to proceed.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <motion.div whileTap={{ scale: 0.995 }} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 tracking-wider uppercase ml-1">Email address</label>
              <input 
                type="email" 
                required
                autoComplete="email"
                placeholder="hello@example.com"
                className="w-full px-5 py-3.5 bg-white border border-[#E5E7EB] rounded-t-xl rounded-b-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium shadow-sm hover:border-gray-300 relative z-10 bg-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </motion.div>
            
            <motion.div whileTap={{ scale: 0.995 }} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 tracking-wider uppercase ml-1">Password</label>
              <input 
                type="password" 
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-white border border-[#E5E7EB] rounded-t-xl rounded-b-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-gray-900 font-medium shadow-sm hover:border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-lg transition-all border border-transparent mt-4 ${
                loading 
                  ? 'bg-indigo-300 text-white cursor-not-allowed opacity-80' 
                  : 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/30'
              }`}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={20} />}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium text-sm lg:text-base">
            Don't have an account? <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}