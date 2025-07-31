'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, CheckCircle, Leaf, PiggyBank } from 'lucide-react'

const insuranceProducts = [
  { id: 'maize', name: 'Maize Insurance', type: 'crop', coverage: 50000, premium: 2500 },
  { id: 'wheat', name: 'Wheat Insurance', type: 'crop', coverage: 40000, premium: 2000 },
  { id: 'dairy', name: 'Dairy Cattle', type: 'livestock', coverage: 80000, premium: 4000 },
  { id: 'poultry', name: 'Poultry Insurance', type: 'livestock', coverage: 30000, premium: 1500 },
]

export default function BuyInsurancePage() {
  const router = useRouter()
  const [step, setStep] = useState<'type' | 'product' | 'details' | 'confirm'>('type')
  const [insuranceType, setInsuranceType] = useState<'crop' | 'livestock'>()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [farmSize, setFarmSize] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (step === 'type' && insuranceType) setStep('product')
    else if (step === 'product' && selectedProduct) setStep('details')
    else if (step === 'details') setStep('confirm')
  }

  const handleBack = () => {
    if (step === 'product') setStep('type')
    else if (step === 'details') setStep('product')
    else if (step === 'confirm') setStep('details')
  }

  const handlePurchase = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      router.push('/policies')
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {['type', 'product', 'details', 'confirm'].map((s, i) => (
            <div key={s} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === s
                    ? 'bg-primary text-white'
                    : i < ['type', 'product', 'details', 'confirm'].indexOf(step)
                    ? 'bg-green-100 text-primary'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < ['type', 'product', 'details', 'confirm'].indexOf(step) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-xs mt-2 capitalize">{s}</span>
            </div>
          ))}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 'type' && 'Select Insurance Type'}
              {step === 'product' && 'Choose Product'}
              {step === 'details' && 'Farm Details'}
              {step === 'confirm' && 'Confirm Purchase'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Insurance Type */}
            {step === 'type' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setInsuranceType('crop')}
                  className={`p-6 border rounded-lg flex flex-col items-center transition-all ${
                    insuranceType === 'crop' ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <Leaf className="w-8 h-8 mb-2 text-green-600" />
                  <h3 className="font-medium">Crop Insurance</h3>
                  <p className="text-sm text-gray-500 mt-1 text-center">Protect your crops against drought and pests</p>
                </button>
                <button
                  onClick={() => setInsuranceType('livestock')}
                  className={`p-6 border rounded-lg flex flex-col items-center transition-all ${
                    insuranceType === 'livestock' ? 'border-primary bg-green-50' : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <PiggyBank className="w-8 h-8 mb-2 text-green-600" />
                  <h3 className="font-medium">Livestock Insurance</h3>
                  <p className="text-sm text-gray-500 mt-1 text-center">Coverage for your animals and livestock</p>
                </button>
              </div>
            )}

            {/* Step 2: Product Selection */}
            {step === 'product' && (
              <div className="space-y-4">
                <Select onValueChange={(value) => setSelectedProduct(insuranceProducts.find(p => p.id === value))}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select insurance product" />
                  </SelectTrigger>
                  <SelectContent>
                    {insuranceProducts
                      .filter(p => p.type === insuranceType)
                      .map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - KSh {product.coverage.toLocaleString()} coverage
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectedProduct && (
                  <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-medium">{selectedProduct.name}</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Coverage Amount</p>
                        <p className="font-medium">KSh {selectedProduct.coverage.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Annual Premium</p>
                        <p className="font-medium">KSh {selectedProduct.premium.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Farm Details */}
            {step === 'details' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="farmSize">Farm Size (Acres/Number of Animals)</Label>
                  <Input
                    id="farmSize"
                    type="number"
                    placeholder={insuranceType === 'crop' ? 'Enter farm size in acres' : 'Enter number of animals'}
                    value={farmSize}
                    onChange={(e) => setFarmSize(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <h4 className="font-medium">Summary</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Product</p>
                      <p className="font-medium">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Farm Size</p>
                      <p className="font-medium">{farmSize} {insuranceType === 'crop' ? 'acres' : 'animals'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Coverage</p>
                      <p className="font-medium">KSh {(selectedProduct.coverage * Number(farmSize || 1)).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Premium</p>
                      <p className="font-medium">KSh {(selectedProduct.premium * Number(farmSize || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 'confirm' && (
              <div className="space-y-6">
                <div className="p-6 border border-green-200 rounded-lg bg-green-50 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium">Confirm Your Insurance Purchase</h3>
                  <p className="text-gray-600 mt-2">
                    You're about to purchase {selectedProduct.name} for your {farmSize} {insuranceType === 'crop' ? 'acres' : 'animals'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Annual Premium</span>
                    <span className="font-medium">KSh {(selectedProduct.premium * Number(farmSize || 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage Amount</span>
                    <span className="font-medium">KSh {(selectedProduct.coverage * Number(farmSize || 1)).toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t mt-2 flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">M-Pesa</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step !== 'type' ? (
                <Button variant="outline" onClick={handleBack} className="h-12">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              ) : (
                <div></div>
              )}

              {step !== 'confirm' ? (
                <Button
                  onClick={handleNext}
                  disabled={
                    (step === 'type' && !insuranceType) ||
                    (step === 'product' && !selectedProduct) ||
                    (step === 'details' && !farmSize)
                  }
                  className="h-12 bg-primary hover:bg-primary/90"
                >
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="h-12 bg-primary hover:bg-primary/90"
                >
                  {isLoading ? 'Processing...' : 'Confirm & Pay'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}