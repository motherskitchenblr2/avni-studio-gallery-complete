'use client'
 
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Building, Shield, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
 
export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    jobTitle: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const router = useRouter()
  const { signUp } = useAuthStore()
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
 
  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return formData.firstName.trim() && formData.lastName.trim() && formData.email.trim()
      case 2:
        return formData.password && formData.password.length >= 8 &&
               formData.password === formData.confirmPassword
      case 3:
        return formData.company.trim() && formData.jobTitle.trim() &&
               formData.agreeToTerms && formData.agreeToPrivacy
      default:
        return false
    }
  }
 
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1)
      setError('')
    } else {
      setError('Please fill in all required fields correctly')
    }
  }
 
  const handlePrevStep = () => {
    setStep(prev => prev - 1)
    setError('')
  }
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
 
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const success = await signUp(
        formData.email,
        formData.password,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          jobTitle: formData.jobTitle
        }
      )
      
      if (success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/signin?message=Registration successful')
        }, 2000)
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setIsLoading(false)
    }
  }
 
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Registration Successful!</h2>
          <p className="text-gray-400 mb-8">
            Welcome to Avni Studio. Your account has been created successfully.
          </p>
          
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Next Steps</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                <span>Check your email for verification</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                <span>Complete your profile setup</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                <span>Start exploring AI features</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    )
  }
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join Avni Studio Enterprise</p>
        </div>
 
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  step === stepNum
                    ? 'bg-cyan-500 text-white'
                    : step > stepNum
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                )}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div
                  className={cn(
                    'w-16 h-1 mx-2 transition-colors',
                    step > stepNum ? 'bg-green-500' : 'bg-gray-700'
                  )}
                />
              )}
            </div>
          ))}
        </div>
 
        {/* Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
 
            {/* Step 1: Personal Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
 
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
 
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@company.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
 
                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={handleNextStep}>
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
 
            {/* Step 2: Security */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">Security Settings</h3>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
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
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 8 characters long
                  </p>
                </div>
 
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
 
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="button" onClick={handleNextStep}>
                    Next
                  </Button>
                </div>
              </motion.div>
            )}
 
            {/* Step 3: Company Information & Terms */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">Company Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Company Inc."
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
 
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Designer"
                      required
                    />
                  </div>
                </div>
 
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-white">Terms & Conditions</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3">
                      <Checkbox
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeToTerms: !!checked }))
                        }
                        id="terms"
                      />
                      <div className="text-sm text-gray-300">
                        I agree to the{' '}
                        <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/terms" className="text-cyan-400 hover:text-cyan-300">
                          Usage Guidelines
                        </a>
                      </div>
                    </label>
 
                    <label className="flex items-start space-x-3">
                      <Checkbox
                        checked={formData.agreeToPrivacy}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeToPrivacy: !!checked }))
                        }
                        id="privacy"
                      />
                      <div className="text-sm text-gray-300">
                        I agree to the{' '}
                        <a href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                          Privacy Policy
                        </a>{' '}
                        and consent to data processing
                      </div>
                    </label>
                  </div>
                </div>
 
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                        <span className="ml-2">Creating account...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
 
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/auth/signin" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
