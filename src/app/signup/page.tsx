'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Phone, Shield, User, MapPin, Upload } from 'lucide-react'

const kenyanCounties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    county: '',
    idDocument: null as File | null
  })
  const [step, setStep] = useState<'details' | 'otp'>('details')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (digits.startsWith('254')) {
      return '+' + digits
    } else if (digits.startsWith('7') || digits.startsWith('1')) {
      return '+254' + digits
    }
    return '+254' + digits.slice(-9)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, idDocument: file }))
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    // Simulate API call for registration
    setTimeout(() => {
      setStep('otp')
      setIsLoading(false)
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    // Simulate API call for OTP verification
    setTimeout(() => {
      // After successful OTP verification, always go to dashboard
      window.location.href = '/dashboard'
      setIsLoading(false)
    }, 1500)
  }

  const isFormValid = formData.fullName && formData.phone.length >= 13 && formData.county

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
          <h1 className="text-4xl font-bold mb-2">Africas Insurance</h1>
          <p className="text-lg opacity-90">Protecting Kenya's Farmers</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>✓ Crop Insurance Coverage</p>
            <p>✓ Livestock Protection</p>
            <p>✓ Quick Claims Processing</p>
            <p>✓ 24/7 Support Hotline</p>
          </div>
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
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              {step === 'details' 
                ? 'Join thousands of protected farmers' 
                : 'Enter the verification code sent to your phone'
              }
            </p>
          </div>

          {/* Sign Up Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">
                {step === 'details' ? 'Farmer Registration' : 'Verify Phone Number'}
              </CardTitle>
              <CardDescription className="text-center">
                {step === 'details' 
                  ? 'Fill in your details to get started' 
                  : `Code sent to ${formData.phone}`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 'details' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+2547XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                        className="pl-10 h-12 text-lg"
                        maxLength={13}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county">County/Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                      <Select onValueChange={(value) => handleInputChange('county', value)}>
                        <SelectTrigger className="pl-10 h-12">
                          <SelectValue placeholder="Select your county" />
                        </SelectTrigger>
                        <SelectContent>
                          {kenyanCounties.map((county) => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idDocument">ID Document (Optional)</Label>
                    <div className="relative">
                      <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="idDocument"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="pl-10 h-12"
                      />
                    </div>
                    <p className="text-xs text-gray-500">Upload National ID or Passport (Photo or PDF)</p>
                  </div>

                  <Button 
                    onClick={handleSignUp}
                    disabled={!isFormValid || isLoading}
                    className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
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
                      onClick={() => setStep('details')}
                      className="flex-1 h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleVerifyOTP}
                      disabled={otp.length !== 6 || isLoading}
                      className="flex-1 h-12 bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? 'Verifying...' : 'Complete Registration'}
                    </Button>
                  </div>
                  <div className="text-center">
                    <button
                      onClick={handleSignUp}
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
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-500">
              <p>Already have an account?</p>
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              <p>Need help? Call our support line</p>
              <p className="font-semibold text-primary">+254 700 000 000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}