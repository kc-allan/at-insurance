'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, Leaf, PiggyBank, Search, Shield } from 'lucide-react'

const mockPolicies = [
  {
    id: 'pol-001',
    type: 'crop',
    product: 'Maize Insurance',
    coverage: 50000,
    premium: 2500,
    status: 'active',
    validFrom: '2023-06-01',
    validTo: '2024-05-31',
    farmSize: '2 acres'
  },
  {
    id: 'pol-002',
    type: 'livestock',
    product: 'Dairy Cattle',
    coverage: 80000,
    premium: 4000,
    status: 'active',
    validFrom: '2023-09-15',
    validTo: '2024-09-14',
    farmSize: '5 animals'
  },
  {
    id: 'pol-003',
    type: 'crop',
    product: 'Wheat Insurance',
    coverage: 40000,
    premium: 2000,
    status: 'expired',
    validFrom: '2022-11-01',
    validTo: '2023-10-31',
    farmSize: '3 acres'
  }
]

export default function PoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all')

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.product.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         policy.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || policy.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Insurance Policies</h1>
          <Button className="bg-primary hover:bg-primary/90">
            Buy New Policy
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select onValueChange={(value: 'all' | 'active' | 'expired') => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Policy List */}
        {filteredPolicies.length > 0 ? (
          <div className="space-y-4">
            {filteredPolicies.map(policy => (
              <Card key={policy.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      policy.type === 'crop' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {policy.type === 'crop' ? (
                        <Leaf className="w-5 h-5" />
                      ) : (
                        <PiggyBank className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{policy.product}</h3>
                      <p className="text-sm text-gray-500">Policy ID: {policy.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {policy.status === 'active' ? 'Active' : 'Expired'}
                  </span>
                </CardHeader>
                <CardContent>
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
                      <p className="text-sm text-gray-500">Valid Until</p>
                      <p className="font-medium">{formatDate(policy.validTo)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">{policy.farmSize}</p>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" /> View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'You currently have no insurance policies'}
              </p>
              <Button className="mt-4 bg-primary hover:bg-primary/90">
                Buy Your First Policy
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}