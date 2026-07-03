'use client'
 
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { LogOut, Shield, CheckCircle } from 'lucide-react'
 
export default function Logout() {
  const router = useRouter()
  const { logout } = useAuthStore()
 
  useEffect(() => {
    // Perform logout
    logout()
    
    // Redirect to sign-in page after a short delay
    const timer = setTimeout(() => {
      router.push('/auth/signin')
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [logout, router])
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {/* Logo */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
          <LogOut className="w-10 h-10 text-white" />
        </div>
 
        <h1 className="text-3xl font-bold text-white mb-2">Logging Out</h1>
        <p className="text-gray-400 mb-8">
          You've been securely logged out of Avni Studio.
        </p>
 
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-green-400" />
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Session Secure</h3>
          <p className="text-sm text-gray-400">
            All your data has been cleared and session tokens have been revoked.
          </p>
        </div>
 
        <div className="space-y-3">
          <p className="text-sm text-gray-500">You will be redirected to the sign-in page...</p>
          
          <Button
            onClick={() => router.push('/auth/signin')}
            className="w-full"
          >
            Go to Sign In
          </Button>
        </div>
 
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            © 2026 Avni Studio. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
