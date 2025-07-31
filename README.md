# AgriTech Insurance Providers
# 🌾 AgriInsure - Farmer Insurance Platform

A responsive farmer-facing agriculture insurance web platform built with React, Next.js, TailwindCSS, and shadcn/ui.

## 🎨 Design System
- **Primary Color**: Green (#2E7D32)
- **Background**: White (#FFFFFF)
- **Typography**: Rounded, friendly fonts
- **UX**: Large touch targets, mobile-first design

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── login/             # Login page
│   ├── setup-profile/     # Profile setup
│   ├── dashboard/         # Main dashboard
│   ├── buy/              # Buy insurance
│   ├── policies/         # My policies
│   ├── claims/           # File claims
│   ├── renew/            # Renew policies
│   └── layout.tsx        # Root layout
├── components/
│   ├── ui/               # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── select.tsx
│   ├── forms/            # Form components
│   │   ├── auth-form.tsx
│   │   ├── profile-form.tsx
│   │   └── insurance-form.tsx
│   ├── cards/            # Card components
│   │   ├── policy-card.tsx
│   │   └── dashboard-card.tsx
│   └── layout/           # Layout components
│       ├── header.tsx
│       └── navigation.tsx
├── lib/
│   ├── api/              # Mock API layer
│   │   ├── auth.ts
│   │   ├── policies.ts
│   │   └── claims.ts
│   ├── types/            # TypeScript types
│   └── utils.ts          # Utility functions
└── data/                 # Mock data
    ├── farmers.json
    ├── policies.json
    └── counties.json
```

## 👥 Task Distribution

### 🔵 Developer 1 (Senior Frontend Engineer)
**Status: In Progress**

#### Phase 1 - Foundation & Core (Week 1)
- [x] Set up project structure and configuration
- [ ] Create shared UI components (Button, Input, Card, Layout)
- [ ] Build Login Page with OTP authentication flow
- [ ] Set up mock API layer with placeholder data

#### Phase 2 - User Flow (Week 2)
- [ ] Create Profile Setup Page for first-time users
- [ ] Build Dashboard Page with overview cards
- [ ] Add routing and navigation between pages
- [ ] Implement responsive design and mobile-first styling

### 🟢 Developer 2 (Frontend Developer)
**Status: Ready to Start**

#### Phase 1 - Insurance Features (Week 1)
- [ ] Create Buy Insurance Page with step-by-step form
- [ ] Build My Policies Page with policy list view
- [ ] Create mock data structures for policies and farmers

#### Phase 2 - Claims & Additional (Week 2)
- [ ] Create File a Claim Page with form and image upload
- [ ] Build Renew Policy Page with renewal flow
- [ ] Create Error/404 page and fallbacks
- [ ] Add icons and polish UI components

## 📱 Pages Overview

### 1. Login Page (`/login`)
- Phone number input (+2547XXXXXXX format)
- OTP verification (6 digits)
- Auto-redirect to profile setup for new users

### 2. Profile Setup (`/setup-profile`)
- Full name input
- County/location selection
- Optional ID upload
- One-time setup for new farmers

### 3. Dashboard (`/dashboard`)
- Welcome message with farmer name
- Quick action cards: Buy, Policies, Claims, Renew
- Policy summary if exists

### 4. Buy Insurance (`/buy`)
- Step-by-step form
- Crop vs Livestock selection
- Premium calculation
- Payment integration ready

### 5. My Policies (`/policies`)
- Policy cards with status
- Download PDF capability
- Search and filter options

### 6. File Claim (`/claims`)
- Policy selection
- Reason dropdown (Drought, Death, Other)
- Description and photo upload

### 7. Renew Policy (`/renew`)
- Renewable policies list
- Expiry alerts
- Quick renewal flow

### 8. Error Handling (`/error`)
- 404 page
- Offline fallbacks
- Contact information

## 🔧 Technical Implementation

### Mock API Structure
```typescript
// lib/api/auth.ts
export const sendOTP = async (phone: string) => Promise<boolean>
export const verifyOTP = async (phone: string, otp: string) => Promise<User>

// lib/api/policies.ts
export const getPolicies = async (farmerId: string) => Promise<Policy[]>
export const buyPolicy = async (policyData: PolicyForm) => Promise<Policy>

// lib/api/claims.ts
export const submitClaim = async (claimData: ClaimForm) => Promise<Claim>
```

### Data Types
```typescript
interface Farmer {
  id: string
  name: string
  phone: string
  county: string
  idDocument?: string
}

interface Policy {
  id: string
  farmerId: string
  type: 'crop' | 'livestock'
  product: string
  coverage: number
  premium: number
  status: 'active' | 'expired'
  validFrom: Date
  validTo: Date
}
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Setup shadcn/ui
npx shadcn@latest init

# Run development server
npm run dev
```

## 📋 Development Guidelines

1. **Mobile-First**: All components must work on mobile devices
2. **Accessibility**: Use semantic HTML and ARIA labels
3. **Performance**: Optimize images and minimize bundle size
4. **Testing**: Write unit tests for critical components
5. **API Ready**: Structure code for easy API integration

## 🔄 API Integration Notes

When connecting to real APIs:
1. Replace mock functions in `lib/api/`
2. Update environment variables for API endpoints
3. Handle authentication tokens
4. Add error handling and loading states
5. Implement proper caching strategies

## 📞 Contact & Support

- **Development Lead**: Developer 1
- **Feature Development**: Developer 2
- **Issues**: Create GitHub issues for bugs and features

---

**Next Steps**: Developer 1 should start with project setup and UI components, while Developer 2 can begin planning the insurance form logic and mock data structures.
