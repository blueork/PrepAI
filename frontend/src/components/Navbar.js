'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { auth } from '@/lib/api'
import { useEffect, useState } from 'react'
import { Brain, LogOut } from 'lucide-react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [token, setToken] = useState(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Update token view whenever the route changes
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [pathname])

  const handleLogout = () => {
    auth.logout()
    setToken(null)
    router.push('/login')
  }

  if (!isClient) return null

  // Don't render global navbar on login/signup to keep split screen clean,
  // Or do render it! User asked to "only use the existing Navbar.js component at the top"
  // Let's render it everywhere as a dark navy bar.
  
  // Actually, wait: Login/Signup already have their own layout (split screen). 
  // Having a navbar might break the split screen design slightly since layout.js has pt-16.
  // We'll leave it as is unless it breaks.

  return (
    <nav className="bg-[#0F172A] text-white py-4 px-6 md:px-12 flex items-center justify-between shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Brain size={18} className="text-white" />
        </div>
        {token ? (
          <span className="text-xl font-bold tracking-tight text-white cursor-default">
            PrepAI
          </span>
        ) : (
          <Link href="/" className="text-xl font-bold tracking-tight text-white hover:text-indigo-200 transition-colors">
            PrepAI
          </Link>
        )}
      </div>
      
      <div className="flex items-center space-x-6 text-sm font-medium">
        {token ? (
          <>
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-md shadow-indigo-500/20"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
