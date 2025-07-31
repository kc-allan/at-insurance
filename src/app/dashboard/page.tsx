'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Shield, 
  Plus, 
  FileText, 
  AlertCircle, 
  RefreshCcw,
  User,
  Phone,
  MapPin,
  Calendar,
  Wheat,
  PiggyBank
} from 'lucide-react'

// Mock user data
const mockUser = {
  name: 'John Mwangi',
  phone: '+254712345678',
  county: 'Nakuru',
  joinDate: '2024-01-15'
}

// Mock policies data
const mockPolicies = [
  {
    id: 'POL-001',
    type: 'crop',
    product: 'Maize',
    coverage: '5 acres',
    premium: 2500,
    status: 'active',
    validFrom: '2024-01-01',
    validTo: '2024-12-31'
  },
  {
    id: 'POL-002',
    type: 'livestock',
    product: 'Dairy Cattle',
    coverage: '3 cows',
    premium: 1800,
    status: 'active',
    validFrom: '2024-02-01',
    validTo: '2025-01-31'
  }
]

export default function DashboardPage() {
  const [user] = useState(mockUser)
  const [policies] = useState(mockPolicies)

  const activePolicies = policies.filter(p => p.status === 'active')
  const totalCoverage = policies.reduce((sum, p) => sum + p.premium, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Africas Insurance</h1>
                <p className="text-sm text-gray-600">Farmer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.phone}</p>
              </div>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {user.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-gray-600">
            Welcome to your insurance dashboard. Manage your policies and claims from here.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{activePolicies.length}</div>
              <p className="text-xs text-muted-foreground">Currently protected</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">KES {totalCoverage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Annual premium</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No pending claims</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Location</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.county}</div>
              <p className="text-xs text-muted-foreground">County</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/buy">
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20 hover:border-primary/40">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Buy Insurance</h3>
                <p className="text-sm text-gray-600">Protect your crops & livestock</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/policies">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">My Policies</h3>
                <p className="text-sm text-gray-600">View all your policies</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/claims">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">File a Claim</h3>
                <p className="text-sm text-gray-600">Report damage or loss</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/renew">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <RefreshCcw className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Renew Policy</h3>
                <p className="text-sm text-gray-600">Extend your coverage</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Active Policies Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Active Policies
              </CardTitle>
              <CardDescription>
                Your current insurance coverage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activePolicies.length > 0 ? (
                activePolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {policy.type === 'crop' ? (
                          <Wheat className="w-5 h-5 text-primary" />
                        ) : (
                          <PiggyBank className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{policy.product}</p>
                        <p className="text-sm text-gray-600">{policy.coverage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">KES {policy.premium.toLocaleString()}</p>
                      <p className="text-sm text-green-600">Valid till {new Date(policy.validTo).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No active policies</p>
                  <Link href="/buy">
                    <Button className="mt-3">Buy Your First Policy</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Full Name</span>
                </div>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Phone</span>
                </div>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">County</span>
                </div>
                <span className="font-medium">{user.county}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">Member Since</span>
                </div>
                <span className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}