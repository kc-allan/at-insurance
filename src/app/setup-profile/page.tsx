'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, MapPin, Upload, CheckCircle } from 'lucide-react'
import { registerUser } from '@/lib/api/auth'

const kenyanCounties = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
]

export default function SetupProfilePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    county: '',
    idDocument: null as File | null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, idDocument: file }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const response = await registerUser({
        name: formData.fullName,
        phone: formData.phone,
        county: formData.county,
        idDocument: formData.idDocument?.name
      })
      
      if (response.success) {
        setSuccess(true)
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 2000)
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.fullName && formData.phone && formData.county

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Africas Insurance!</h2>
            <p className="text-gray-600 mb-4">Your profile has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-4xl font-bold mb-2">Africas Insurance</h1>
          <p className="text-lg opacity-90">Protecting Kenya's Farmers</p>
          <div className="mt-4 space-y-2 text-sm">
            <p>✓ Quick & Easy Registration</p>
            <p>✓ Instant Policy Activation</p>
            <p>✓ Comprehensive Coverage</p>
            <p>✓ Expert Support Team</p>
          </div>
        </div>
      </div>

      {/* Form Half */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Complete Your Profile</h2>
            <p className="mt-2 text-gray-600">
              Just a few more details to get you started
            </p>
          </div>

          {/* Profile Setup Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Farmer Information</CardTitle>
              <CardDescription className="text-center">
                This information helps us provide better service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+2547XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-12 text-lg"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">We'll use this for important updates</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County/Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select onValueChange={(value) => handleInputChange('county', value)} required>
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
                <p className="text-xs text-gray-500">
                  Upload National ID or Passport for faster claims processing
                </p>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid || isLoading}
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
              >
                {isLoading ? 'Setting up profile...' : 'Save & Proceed to Dashboard'}
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500">
            <p>By completing your profile, you agree to our</p>
            <p>
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
              {' & '}
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}