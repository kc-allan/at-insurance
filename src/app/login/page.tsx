'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Phone, Shield } from 'lucide-react'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setStep('otp')
      setIsLoading(false)
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      // Redirect to dashboard or profile setup
      window.location.href = '/dashboard'
      setIsLoading(false)
    }, 1500)
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as +2547XXXXXXXX
    if (digits.startsWith('254')) {
      return '+' + digits
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return '+254' + digits
    }
    return '+254' + digits.slice(-9)
  }

  return (
    <div className="min-h-screen flex">
      {/* Background Image Half */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/bg.jpg"
          alt="Farmer in field"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">AgriInsure</h1>
          <p className="text-lg opacity-90">Protecting Kenya's Farmers</p>
        </div>
      </div>

      {/* Form Half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-gray-600">
              {step === 'phone' 
                ? 'Enter your phone number to get started' 
                : 'Enter the verification code sent to your phone'
              }
            </p>
          </div>

          {/* Login Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">
                {step === 'phone' ? 'Phone Verification' : 'Enter OTP Code'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'phone' 
                  ? 'We\'ll send you a verification code' 
                  : `Code sent to ${phone}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 'phone' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+2547XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                        className="pl-10 h-12 text-lg"
                        maxLength={13}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSendOTP}
                    disabled={phone.length < 13 || isLoading}
                    className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="text-center text-2xl tracking-widest h-12"
                      maxLength={6}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setStep('phone')}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleSendOTP}
                      className="text-sm text-primary hover:underline"
                    >
                      Didn't receive code? Resend
                    </button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help? Call our support line</p>
            <p className="font-semibold text-primary">+254 700 000 000</p>
          </div>
        </div>
      </div>
    </div>
  )
}