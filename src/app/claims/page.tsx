'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, FileImage, Upload } from 'lucide-react'

const mockPolicies = [
  { id: 'pol-001', name: 'Maize Insurance - 2 acres', type: 'crop' },
  { id: 'pol-002', name: 'Dairy Cattle - 5 animals', type: 'livestock' }
]

const claimReasons = [
  { id: 'drought', name: 'Drought' },
  { id: 'pests', name: 'Pest Infestation' },
  { id: 'disease', name: 'Disease' },
  { id: 'death', name: 'Death (Livestock)' },
  { id: 'other', name: 'Other' }
]

export default function FileClaimPage() {
  const router = useRouter()
  const [selectedPolicy, setSelectedPolicy] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages([...images, ...files])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 2000)
  }

  const resetForm = () => {
    setSelectedPolicy('')
    setReason('')
    setDescription('')
    setImages([])
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="border-0 shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Claim Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your claim has been received. We'll review it and get back to you within 5 business days.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/claims')}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Track Another Claim
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="w-full"
              >
                File New Claim
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 pl-0"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>

        <h1 className="text-2xl font-bold mb-2">File a Claim</h1>
        <p className="text-gray-600 mb-8">
          Submit a claim for your insured crops or livestock
        </p>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="policy">Select Policy</Label>
                <Select onValueChange={setSelectedPolicy} value={selectedPolicy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an insurance policy" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPolicies.map(policy => (
                      <SelectItem key={policy.id} value={policy.id}>
                        {policy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Claim</Label>
                <Select onValueChange={setReason} value={reason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason for claim" />
                  </SelectTrigger>
                  <SelectContent>
                    {claimReasons.map(reason => (
                      <SelectItem key={reason.id} value={reason.id}>
                        {reason.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your claim..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Upload Evidence (Photos)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Uploaded Images ({images.length})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Evidence ${index + 1}`}
                            className="rounded-md h-24 w-full object-cover"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">Claim Processing</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Claims are typically processed within 5-7 business days. You'll receive SMS updates on your claim status.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleSubmit}
                disabled={!selectedPolicy || !reason || !description || isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 h-12"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}