'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, Clock, RefreshCw } from 'lucide-react'

const renewablePolicies = [
  {
    id: 'pol-001',
    product: 'Maize Insurance',
    coverage: 50000,
    premium: 2500,
    validFrom: '2023-06-01',
    validTo: '2024-05-31',
    daysToExpire: 15,
    farmSize: '2 acres'
  },
  {
    id: 'pol-002',
    product: 'Dairy Cattle',
    coverage: 80000,
    premium: 4000,
    validFrom: '2023-09-15',
    validTo: '2024-09-14',
    daysToExpire: 120,
    farmSize: '5 animals'
  }
]

export default function RenewPolicyPage() {
  const router = useRouter()
  const [selectedPolicy, setSelectedPolicy] = useState('')
  const [isRenewing, setIsRenewing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleRenew = async () => {
    setIsRenewing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRenewing(false)
      setIsSuccess(true)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="border-0 shadow-lg max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Policy Renewed Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your policy has been renewed for another year. The updated policy document will be available in your account shortly.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setIsSuccess(false)
                  setSelectedPolicy('')
                }}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Back to Renewals
              </Button>
              <Button
                onClick={() => router.push('/policies')}
                variant="outline"
                className="w-full"
              >
                View My Policies
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

        <h1 className="text-2xl font-bold mb-2">Renew Policy</h1>
        <p className="text-gray-600 mb-8">
          Renew your expiring insurance policies to maintain coverage
        </p>

        {renewablePolicies.length > 0 ? (
          <div className="space-y-4">
            {renewablePolicies.map(policy => (
              <Card
                key={policy.id}
                className={`border-0 shadow-sm hover:shadow-md transition-shadow ${
                  selectedPolicy === policy.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{policy.product}</CardTitle>
                      <p className="text-sm text-gray-500">Policy ID: {policy.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      policy.daysToExpire <= 30 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {policy.daysToExpire <= 30 ? 'Expiring soon' : 'Renewable'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Coverage</p>
                      <p className="font-medium">KSh {policy.coverage.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Premium</p>
                      <p className="font-medium">KSh {policy.premium.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Expires</p>
                      <p className="font-medium">{formatDate(policy.validTo)} ({policy.daysToExpire} days)</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <p className="text-sm text-gray-500">{policy.farmSize}</p>
                    <Button
                      onClick={() => {
                        setSelectedPolicy(policy.id)
                        handleRenew()
                      }}
                      disabled={isRenewing}
                      className="flex items-center"
                    >
                      {isRenewing && selectedPolicy === policy.id ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 mr-2" />
                      )}
                      Renew Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Alert className="bg-blue-50 border-blue-200">
              <AlertTitle className="text-blue-800">Early Renewal Benefit</AlertTitle>
              <AlertDescription className="text-blue-700">
                Renew your policy at least 30 days before expiry to receive a 5% discount on your premium.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies to renew</h3>
              <p className="text-gray-500 mb-4">
                You currently have no policies that are eligible for renewal.
              </p>
              <Button
                onClick={() => router.push('/buy')}
                className="bg-primary hover:bg-primary/90"
              >
                Buy New Policy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}