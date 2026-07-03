'use client'
 
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Shield, Fingerprint } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
 
export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [requireTwoFactor, setRequireTwoFactor] = useState(false)
  
  const router = useRouter()
  const { signIn, user } = useAuthStore()
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
 
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if 2FA is required
      if (email === 'admin@avnistudio.com' && password === 'admin123') {
        setRequireTwoFactor(true)
        return
      }
 
      const success = await signIn(email, password, rememberMe)
      if (success) {
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }
 
  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
 
    try {
      // Simulate 2FA verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (twoFactorCode === '123456') {
        const success = await signIn(email, password, rememberMe, twoFactorCode)
        if (success) {
          router.push('/dashboard')
        }
      } else {
        setError('Invalid 2FA code')
      }
    } catch (err) {
      setError('2FA verification failed')
    } finally {
      setIsLoading(false)
    }
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Fingerprint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Avni Studio</h1>
          <p className="text-gray-400">Enterprise AI Image Platform</p>
        </div>
 
        {/* Security Notice */}
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-cyan-400">Enterprise Security</h3>
              <p className="text-xs text-gray-400 mt-1">
                Your data is protected with end-to-end encryption and multi-factor authentication.
              </p>
            </div>
          </div>
        </div>
 
        {/* Sign In Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          {requireTwoFactor ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Two-Factor Authentication</h2>
                <p className="text-gray-400">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              
              <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    2FA Code
                  </label>
                  <Input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                  />
                </div>
 
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
 
                <Button
                  type="submit"
                  disabled={isLoading || twoFactorCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
 
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRequireTwoFactor(false)
                    setTwoFactorCode('')
                  }}
                  className="w-full"
                >
                  Back to Sign In
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
 
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
 
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    id="remember"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-300">
                    Remember me
                  </label>
                </div>
 
                <a href="/auth/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                  Forgot password?
                </a>
              </div>
 
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
 
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
 
              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don't have an account?{' '}
                  <a href="/auth/signup" className="text-cyan-400 hover:text-cyan-300">
                    Sign up
                  </a>
                </p>
              </div>
            </motion.form>
          )}
        </div>
 
        {/* Demo Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Demo credentials: admin@avnistudio.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  )
}
