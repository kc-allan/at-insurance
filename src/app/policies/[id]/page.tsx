'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, ArrowLeft, FileText, Shield, Leaf, PiggyBank } from 'lucide-react'

type Claim = {
	id: string
	date: string
	status: string
	amount: number
}

type PolicyDetail = {
	id: string
	type: string
	product: string
	coverage: number
	premium: number
	status: string
	validFrom: string
	validTo: string
	farmSize: string
	farmerId: string
	paymentMethod: string
	paymentFrequency: string
	claims: Claim[]
	terms: string[]
}

const mockPolicyDetails: { [key: string]: PolicyDetail } = {
	'pol-001': {
		id: 'pol-001',
		type: 'crop',
		product: 'Maize Insurance',
		coverage: 50000,
		premium: 2500,
		status: 'active',
		validFrom: '2023-06-01',
		validTo: '2024-05-31',
		farmSize: '2 acres',
		farmerId: 'farmer-123',
		paymentMethod: 'M-Pesa',
		paymentFrequency: 'annual',
		claims: [
			{ id: 'claim-001', date: '2023-08-15', status: 'approved', amount: 15000 },
			{ id: 'claim-002', date: '2023-11-02', status: 'pending', amount: 10000 }
		],
		terms: [
			'Covers drought and pest damage',
			'Minimum claim amount: KSh 5,000',
			'Claims must be filed within 30 days of incident',
			'Requires photographic evidence for claims'
		]
	},
	'pol-002': {
		id: 'pol-002',
		type: 'livestock',
		product: 'Dairy Cattle',
		coverage: 80000,
		premium: 4000,
		status: 'active',
		validFrom: '2023-09-15',
		validTo: '2024-09-14',
		farmSize: '5 animals',
		farmerId: 'farmer-123',
		paymentMethod: 'M-Pesa',
		paymentFrequency: 'annual',
		claims: [
			{ id: 'claim-003', date: '2023-10-20', status: 'approved', amount: 20000 }
		],
		terms: [
			'Covers death by disease or accident',
			'Animals must be at least 1 year old',
			'Veterinary certificate required for death claims',
			'24-hour notification required for deaths'
		]
	}
}

interface PageProps {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function PolicyDetailsPage({ params }: PageProps) {
	const router = useRouter()
	const { id } = params
	const policy = mockPolicyDetails[id as string]

	if (!policy) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
				<Card className="border-0 shadow-lg max-w-md w-full">
					<CardContent className="p-8 text-center">
						<Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">Policy Not Found</h3>
						<p className="text-gray-500 mb-4">
							The requested policy could not be found.
						</p>
						<Button
							onClick={() => router.push('/policies')}
							className="bg-primary hover:bg-primary/90"
						>
							Back to My Policies
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800'
			case 'expired':
				return 'bg-gray-100 text-gray-800'
			case 'pending':
				return 'bg-yellow-100 text-yellow-800'
			default:
				return 'bg-blue-100 text-blue-800'
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-4xl mx-auto p-6">
				<Button
					variant="ghost"
					onClick={() => router.back()}
					className="mb-6 pl-0"
				>
					<ArrowLeft className="w-5 h-5 mr-2" /> Back to Policies
				</Button>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Main Policy Details */}
					<div className="flex-1 space-y-6">
						<Card className="border-0 shadow-sm">
							<CardHeader className="flex flex-row items-center justify-between pb-4">
								<div className="flex items-center space-x-3">
									<div className={`p-2 rounded-lg ${policy.type === 'crop' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
										}`}>
										{policy.type === 'crop' ? (
											<Leaf className="w-5 h-5" />
										) : (
											<PiggyBank className="w-5 h-5" />
										)}
									</div>
									<div>
										<CardTitle>{policy.product}</CardTitle>
										<p className="text-sm text-gray-500">Policy ID: {policy.id}</p>
									</div>
								</div>
								<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
									{policy.status === 'active' ? 'Active' : 'Expired'}
								</span>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<p className="text-sm text-gray-500">Coverage Amount</p>
										<p className="font-medium">KSh {policy.coverage.toLocaleString()}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Annual Premium</p>
										<p className="font-medium">KSh {policy.premium.toLocaleString()}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">Start Date</p>
										<p className="font-medium">{formatDate(policy.validFrom)}</p>
									</div>
									<div>
										<p className="text-sm text-gray-500">End Date</p>
										<p className="font-medium">{formatDate(policy.validTo)}</p>
									</div>
								</div>

								<div className="pt-4 border-t">
									<p className="text-sm text-gray-500">Farm Details</p>
									<p className="font-medium">{policy.farmSize}</p>
								</div>

								<div className="pt-4 border-t">
									<p className="text-sm text-gray-500">Payment Method</p>
									<p className="font-medium">{policy.paymentMethod} ({policy.paymentFrequency})</p>
								</div>
							</CardContent>
						</Card>

						{/* Policy Terms */}
						<Card className="border-0 shadow-sm">
							<CardHeader>
								<CardTitle>Policy Terms</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{policy.terms.map((term, index) => (
										<li key={index} className="flex items-start">
											<span className="flex-shrink-0 w-5 h-5 text-primary mr-2">•</span>
											<span className="text-gray-700">{term}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>
					</div>

					{/* Claims History */}
					<div className="md:w-80 space-y-6">
						<Card className="border-0 shadow-sm">
							<CardHeader>
								<CardTitle>Claims History</CardTitle>
							</CardHeader>
							<CardContent>
								{policy.claims.length > 0 ? (
									<div className="space-y-4">
										{policy.claims.map(claim => (
											<div key={claim.id} className="border-b pb-4 last:border-b-0 last:pb-0">
												<div className="flex justify-between items-start">
													<div>
														<p className="font-medium">Claim #{claim.id}</p>
														<p className="text-sm text-gray-500">{formatDate(claim.date)}</p>
													</div>
													<span className={`px-2 py-1 rounded-full text-xs font-medium ${claim.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
														}`}>
														{claim.status === 'approved' ? 'Approved' : 'Pending'}
													</span>
												</div>
												<p className="text-sm mt-1">Amount: KSh {claim.amount.toLocaleString()}</p>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-500 text-center py-4">No claims filed for this policy</p>
								)}
								<Button
									variant="outline"
									className="w-full mt-4"
									onClick={() => router.push('/claims')}
								>
									File New Claim
								</Button>
							</CardContent>
						</Card>

						{/* Actions */}
						<Card className="border-0 shadow-sm">
							<CardHeader>
								<CardTitle>Policy Actions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button variant="outline" className="w-full">
									<Download className="w-4 h-4 mr-2" /> Download Policy
								</Button>
								<Button variant="outline" className="w-full">
									<FileText className="w-4 h-4 mr-2" /> View Certificate
								</Button>
								{policy.status === 'active' && (
									<Button className="w-full bg-primary hover:bg-primary/90">
										Renew Policy
									</Button>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	)
}