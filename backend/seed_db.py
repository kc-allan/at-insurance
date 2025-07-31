import os
import django
import random
from faker import Faker
from django.contrib.auth.hashers import make_password
from datetime import timedelta
from decimal import Decimal

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from accounts.models import User
from core.models import Policy, Subscription, Claim, Payment, Document

fake = Faker()

def seed_users(num_users=10):
    created_count = 0
    # Kenyan counties for realistic data
    counties = ['Nairobi', 'Kiambu', 'Nakuru', 'Mombasa', 'Kisumu', 'Uasin Gishu', 'Machakos', 'Nyeri', 'Meru', 'Kakamega']
    
    for i in range(num_users):
        first_name = fake.first_name()
        last_name = fake.last_name()
        phone_number = f'+2547{random.randint(10000000, 99999999)}'
        
        user_data = {
            'username': phone_number,  # Use phone number as username
            'password': make_password('password123'),
            'first_name': first_name,
            'last_name': last_name,
            'email': f"{first_name.lower()}.{last_name.lower()}{i}@example.com",
            'phone_number': phone_number,
            'national_id': f"{random.randint(10000000, 39999999)}",
            'date_of_birth': fake.date_of_birth(minimum_age=18, maximum_age=65),
            'gender': random.choice(['M', 'F']),
            'county': random.choice(counties),
            'sub_county': fake.city(),
            'ward': fake.street_name(),
            'village': fake.street_address(),
            'farm_size_acres': Decimal(str(round(random.uniform(1.5, 20.0), 2))),
            'land_ownership_type': random.choice(['owned', 'leased', 'family']),
            'farming_type': random.choice(['subsistence', 'commercial', 'mixed']),
            'primary_crops': random.sample(['maize', 'beans', 'potatoes', 'cabbages', 'tomatoes', 'onions'], random.randint(2, 4)),
            'livestock_count': {'cattle': random.randint(0, 10), 'sheep': random.randint(0, 20), 'goats': random.randint(0, 15)},
            'years_farming_experience': random.randint(1, 30),
            'irrigation_type': random.choice(['rain_fed', 'irrigation', 'mixed']),
            'education_level': random.choice(['primary', 'secondary', 'tertiary']),
            'preferred_payment_method': random.choice(['mpesa', 'bank']),
            'mpesa_number': phone_number,
            'is_verified': True,
            'is_active': True,
            'is_staff': False,
            'is_superuser': False,
        }
        
        try:
            user, created = User.objects.get_or_create(phone_number=user_data['phone_number'], defaults=user_data)
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating user: {e}")
            
    # Create one admin user
    admin_phone = '+254700000000'
    admin_data = {
        'username': admin_phone,
        'password': make_password('admin123'),
        'first_name': 'Admin',
        'last_name': 'User',
        'email': 'admin@atinsurance.com',
        'phone_number': admin_phone,
        'is_staff': True,
        'is_superuser': True,
        'is_active': True,
        'is_verified': True,
    }
    
    admin_user, created = User.objects.get_or_create(phone_number=admin_phone, defaults=admin_data)
    if created:
        print("Admin user created (phone: +254700000000, password: admin123)")
        
    print(f"{created_count} new users seeded.")
    return User.objects.filter(is_superuser=False)

def seed_policies():
    policies = [
        {
            "name": "Crop Cover - Maize",
            "policy_type": "crop",
            "description": "Comprehensive insurance for maize farmers protecting against various risks",
            "coverage": "Covers drought, excess rainfall, pests, diseases, floods, and fire damage for maize crops.",
            "exclusions": "War, nuclear risks, willful negligence, poor farming practices",
            "base_premium": Decimal("5000"),
            "premium_rate": Decimal("5.0"),
            "min_sum_insured": Decimal("10000"),
            "max_sum_insured": Decimal("500000"),
            "duration_months": 6,
            "waiting_period_days": 14,
            "required_documents": ["National ID", "Farm photos", "Land ownership proof"],
            "eligibility_criteria": {"min_acres": 0.5, "max_acres": 100, "experience_years": 1}
        },
        {
            "name": "Livestock Cover - Cattle",
            "policy_type": "livestock",
            "description": "Insurance protection for cattle farmers against livestock losses",
            "coverage": "Covers theft, disease outbreak, accidental death, snake bites, and emergency slaughter.",
            "exclusions": "Malnutrition, old age, pre-existing conditions",
            "base_premium": Decimal("10000"),
            "premium_rate": Decimal("7.5"),
            "min_sum_insured": Decimal("50000"),
            "max_sum_insured": Decimal("2000000"),
            "duration_months": 12,
            "waiting_period_days": 21,
            "required_documents": ["National ID", "Livestock photos", "Veterinary certificate"],
            "eligibility_criteria": {"min_livestock": 1, "max_livestock": 500, "age_limit": 8}
        },
        {
            "name": "Weather Index - Rainfall",
            "policy_type": "weather_index",
            "description": "Parametric insurance based on rainfall levels",
            "coverage": "Automatic payout when rainfall is below or above predetermined thresholds.",
            "exclusions": "Irrigation failure, poor water management",
            "base_premium": Decimal("3000"),
            "premium_rate": Decimal("10.0"),
            "min_sum_insured": Decimal("5000"),
            "max_sum_insured": Decimal("200000"),
            "duration_months": 4,
            "waiting_period_days": 7,
            "required_documents": ["National ID", "Farm location GPS"],
            "eligibility_criteria": {"min_acres": 0.25, "rainfall_dependent": True}
        },
        {
            "name": "Poultry Insurance",
            "policy_type": "poultry",
            "description": "Comprehensive cover for poultry farmers",
            "coverage": "Covers disease outbreaks, fire, theft, and flooding for chicken farms.",
            "exclusions": "Poor management, vaccination negligence",
            "base_premium": Decimal("2000"),
            "premium_rate": Decimal("6.0"),
            "min_sum_insured": Decimal("5000"),
            "max_sum_insured": Decimal("300000"),
            "duration_months": 6,
            "waiting_period_days": 10,
            "required_documents": ["National ID", "Farm photos", "Vaccination records"],
            "eligibility_criteria": {"min_birds": 100, "max_birds": 50000}
        },
        {
            "name": "Greenhouse Cover",
            "policy_type": "greenhouse",
            "description": "Specialized insurance for greenhouse farming",
            "coverage": "Covers structure damage, crop loss, equipment breakdown, and theft.",
            "exclusions": "Wear and tear, gradual deterioration",
            "base_premium": Decimal("8000"),
            "premium_rate": Decimal("4.0"),
            "min_sum_insured": Decimal("50000"),
            "max_sum_insured": Decimal("1000000"),
            "duration_months": 12,
            "waiting_period_days": 14,
            "required_documents": ["National ID", "Greenhouse photos", "Equipment list"],
            "eligibility_criteria": {"min_size_sqm": 100, "structure_age_max": 10}
        }
    ]

    created_count = 0
    for data in policies:
        policy, created = Policy.objects.get_or_create(
            name=data['name'],
            policy_type=data['policy_type'],
            defaults=data
        )
        if created:
            created_count += 1
    print(f"{created_count} new policies seeded.")
    return Policy.objects.all()

def seed_subscriptions(users, policies, num_subscriptions=20):
    created_count = 0
    users_list = list(users)
    
    for i in range(num_subscriptions):
        user = random.choice(users_list)
        policy = random.choice(policies)
        
        # Calculate sum insured and premium
        sum_insured = Decimal(str(random.uniform(
            float(policy.min_sum_insured), 
            float(policy.max_sum_insured)
        )))
        premium_amount = (sum_insured * policy.premium_rate) / 100 + policy.base_premium
        
        # Generate dates based on status
        status = random.choice(['active', 'expired', 'pending'])
        if status == 'active':
            start_date = fake.date_between(start_date='-6m', end_date='today')
            is_paid = True
        elif status == 'expired':
            start_date = fake.date_between(start_date='-2y', end_date='-1y')
            is_paid = True
        else:  # pending
            start_date = fake.date_between(start_date='today', end_date='+1m')
            is_paid = False
            
        # Calculate end date based on policy duration
        end_date = start_date + timedelta(days=policy.duration_months * 30)
        
        sub_data = {
            'user': user,
            'policy': policy,
            'sum_insured': sum_insured.quantize(Decimal('0.01')),
            'premium_amount': premium_amount.quantize(Decimal('0.01')),
            'start_date': start_date,
            'end_date': end_date,
            'status': status,
            'is_paid': is_paid,
        }
        
        # Add specific fields based on policy type
        if policy.policy_type == 'crop':
            sub_data['insured_crop'] = random.choice(['Maize', 'Beans', 'Wheat', 'Potatoes'])
            sub_data['insured_area_acres'] = Decimal(str(random.uniform(0.5, 10.0))).quantize(Decimal('0.01'))
        elif policy.policy_type == 'livestock':
            sub_data['insured_livestock_count'] = random.randint(1, 50)
            sub_data['asset_details'] = {
                'breed': random.choice(['Holstein', 'Jersey', 'Zebu', 'Cross-breed']),
                'average_age': random.randint(1, 8)
            }
        elif policy.policy_type == 'poultry':
            sub_data['insured_livestock_count'] = random.randint(100, 5000)
            sub_data['asset_details'] = {
                'type': random.choice(['Broilers', 'Layers', 'Kienyeji']),
                'housing': random.choice(['Cage', 'Deep litter', 'Free range'])
            }
        elif policy.policy_type == 'greenhouse':
            sub_data['asset_details'] = {
                'size_sqm': random.randint(100, 1000),
                'crop_type': random.choice(['Tomatoes', 'Capsicum', 'Cucumbers']),
                'structure_type': random.choice(['Wooden', 'Metallic', 'PVC'])
            }
            
        if is_paid:
            sub_data['paid_at'] = start_date + timedelta(days=random.randint(0, 7))
            
        try:
            subscription, created = Subscription.objects.get_or_create(
                user=user,
                policy=policy,
                start_date=start_date,
                defaults=sub_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating subscription: {e}")
            
    print(f"{created_count} new subscriptions seeded.")
    return Subscription.objects.filter(status='active')

def seed_claims(subscriptions, num_claims=15):
    created_count = 0
    subscriptions_list = list(subscriptions)
    
    # Claim type descriptions
    claim_descriptions = {
        'crop_loss': [
            "Severe drought affected my maize plantation, lost about 60% of expected yield",
            "Heavy rains and flooding destroyed my bean crops",
            "Pest infestation (Fall armyworm) damaged significant portion of the farm",
            "Hailstorm destroyed all my tomato plants",
            "Disease outbreak (Maize lethal necrosis) affected entire field"
        ],
        'livestock_death': [
            "Three cows died due to East Coast Fever despite vaccination",
            "Lost 5 cattle to sudden poisoning from contaminated water source",
            "Lightning strike killed 2 of my best dairy cows",
            "Foot and mouth disease outbreak led to emergency slaughter",
            "Snake bite led to death of prize bull"
        ],
        'weather_damage': [
            "Unexpected frost damaged my potato crop severely",
            "Strong winds destroyed greenhouse structure and crops",
            "Extended dry spell affected germination and early growth",
            "Flash floods washed away topsoil and young plants",
            "Extreme heat wave caused significant crop wilting"
        ],
        'disease': [
            "Bacterial wilt affected entire tomato greenhouse",
            "Newcastle disease killed 200 chickens in my poultry farm",
            "Fungal infection spread rapidly through my cabbage field",
            "Viral disease affected my pepper plants reducing yield by 70%",
            "Root rot disease destroyed my onion crop"
        ]
    }
    
    for i in range(num_claims):
        subscription = random.choice(subscriptions_list)
        
        # Determine claim type based on policy
        if subscription.policy.policy_type == 'crop':
            claim_type = random.choice(['crop_loss', 'weather_damage', 'disease'])
        elif subscription.policy.policy_type == 'livestock':
            claim_type = 'livestock_death'
        elif subscription.policy.policy_type == 'poultry':
            claim_type = 'disease'
        elif subscription.policy.policy_type == 'weather_index':
            claim_type = 'weather_damage'
        else:
            claim_type = random.choice(['crop_loss', 'weather_damage'])
            
        # Calculate loss amount (between 10% and 70% of sum insured)
        loss_percentage = random.uniform(0.1, 0.7)
        loss_amount = subscription.sum_insured * Decimal(str(loss_percentage))
        
        # Select appropriate description
        description = random.choice(claim_descriptions.get(claim_type, ["Loss occurred due to unforeseen circumstances"]))
        
        # Generate incident date within subscription period
        days_in_period = (subscription.end_date - subscription.start_date).days
        incident_date = subscription.start_date + timedelta(days=random.randint(30, max(31, days_in_period - 30)))
        
        # Determine status and amounts
        status = random.choice(['submitted', 'under_review', 'approved', 'rejected', 'paid'])
        assessed_amount = None
        approved_amount = None
        reviewed_at = None
        paid_at = None
        rejection_reason = ""
        
        if status in ['approved', 'paid']:
            # Approve 70-90% of claimed amount
            approval_percentage = random.uniform(0.7, 0.9)
            assessed_amount = loss_amount * Decimal(str(random.uniform(0.8, 1.0)))
            approved_amount = loss_amount * Decimal(str(approval_percentage))
            reviewed_at = incident_date + timedelta(days=random.randint(7, 21))
            
            if status == 'paid':
                paid_at = reviewed_at + timedelta(days=random.randint(3, 10))
                
        elif status == 'rejected':
            assessed_amount = loss_amount * Decimal(str(random.uniform(0.3, 0.6)))
            reviewed_at = incident_date + timedelta(days=random.randint(7, 21))
            rejection_reason = random.choice([
                "Claim not covered under policy terms - damage due to poor farming practices",
                "Incident occurred during waiting period",
                "Insufficient documentation provided",
                "Investigation revealed pre-existing condition",
                "Claim amount exceeds coverage limits"
            ])
        
        claim_data = {
            'subscription': subscription,
            'user': subscription.user,
            'claim_type': claim_type,
            'incident_date': incident_date,
            'description': description,
            'loss_amount': loss_amount.quantize(Decimal('0.01')),
            'status': status,
            'assessed_amount': assessed_amount.quantize(Decimal('0.01')) if assessed_amount else None,
            'approved_amount': approved_amount.quantize(Decimal('0.01')) if approved_amount else None,
            'reviewed_at': reviewed_at,
            'paid_at': paid_at,
            'rejection_reason': rejection_reason,
            'assessment_notes': f"Field assessment conducted. {description}"
        }
        
        try:
            claim, created = Claim.objects.get_or_create(
                subscription=subscription,
                incident_date=incident_date,
                claim_type=claim_type,
                defaults=claim_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating claim: {e}")
            
    print(f"{created_count} new claims seeded.")
    return Claim.objects.all()

def seed_payments(subscriptions, claims, num_payments=30):
    created_count = 0
    
    # Process all paid subscriptions
    all_subscriptions = Subscription.objects.filter(is_paid=True)
    for subscription in all_subscriptions:
        payment_data = {
            'user': subscription.user,
            'subscription': subscription,
            'claim': None,
            'payment_type': 'premium',
            'amount': subscription.premium_amount,
            'payment_method': random.choice(['mpesa', 'bank_transfer']),
            'status': 'completed',
            'gateway_ref': f"MPESA{fake.unique.random_number(digits=10)}",
            'phone_number': subscription.user.phone_number,
            'completed_at': subscription.paid_at or subscription.start_date,
            'notes': f"Premium payment for {subscription.policy.name}",
            'metadata': {
                'subscription_number': subscription.subscription_number,
                'policy_name': subscription.policy.name,
                'coverage_period': f"{subscription.start_date} to {subscription.end_date}"
            }
        }
        
        try:
            payment, created = Payment.objects.get_or_create(
                subscription=subscription,
                payment_type='premium',
                defaults=payment_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating premium payment: {e}")
    
    # Process claim payments
    paid_claims = claims.filter(status='paid')
    for claim in paid_claims:
        payment_data = {
            'user': claim.user,
            'subscription': None,
            'claim': claim,
            'payment_type': 'claim',
            'amount': claim.approved_amount or claim.loss_amount,
            'payment_method': random.choice(['mpesa', 'bank_transfer']),
            'status': 'completed',
            'gateway_ref': f"CLM{fake.unique.random_number(digits=10)}",
            'phone_number': claim.user.phone_number,
            'completed_at': claim.paid_at,
            'notes': f"Claim settlement for {claim.claim_number}",
            'metadata': {
                'claim_number': claim.claim_number,
                'claim_type': claim.get_claim_type_display(),
                'incident_date': str(claim.incident_date)
            }
        }
        
        try:
            payment, created = Payment.objects.get_or_create(
                claim=claim,
                payment_type='claim',
                defaults=payment_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating claim payment: {e}")
            
    print(f"{created_count} new payments seeded.")

def seed_documents(users, subscriptions, claims, num_documents=40):
    created_count = 0
    
    # Ensure each user has ID card
    for user in users:
        doc_data = {
            'user': user,
            'document_type': 'id_card',
            'file': f'documents/{user.phone_number}_id_card.pdf',
            'description': f'National ID card for {user.full_name}',
        }
        
        try:
            document, created = Document.objects.get_or_create(
                user=user,
                document_type='id_card',
                defaults=doc_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating ID document: {e}")
    
    # Add farm photos for active subscriptions
    for subscription in subscriptions:
        doc_data = {
            'user': subscription.user,
            'subscription': subscription,
            'document_type': 'farm_photo',
            'file': f'documents/{subscription.subscription_number}_farm.jpg',
            'description': f'Farm photo for {subscription.policy.name} policy',
        }
        
        try:
            document, created = Document.objects.get_or_create(
                subscription=subscription,
                document_type='farm_photo',
                defaults=doc_data
            )
            if created:
                created_count += 1
        except Exception as e:
            print(f"Error creating farm photo: {e}")
    
    # Add evidence for claims
    for claim in claims:
        if claim.status in ['approved', 'paid', 'under_review']:
            doc_data = {
                'user': claim.user,
                'claim': claim,
                'document_type': 'loss_evidence',
                'file': f'documents/{claim.claim_number}_evidence.jpg',
                'description': f'Loss evidence for claim {claim.claim_number}',
            }
            
            try:
                document, created = Document.objects.get_or_create(
                    claim=claim,
                    document_type='loss_evidence',
                    defaults=doc_data
                )
                if created:
                    created_count += 1
            except Exception as e:
                print(f"Error creating claim document: {e}")
                
    print(f"{created_count} new documents seeded.")


if __name__ == '__main__':
    print("--- Starting database seeding ---")
    
    # Clear existing data to avoid duplicates
    Claim.objects.all().delete()
    Payment.objects.all().delete()
    Document.objects.all().delete()
    Subscription.objects.all().delete()
    Policy.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()
    print("Cleared existing data.")

    # Seed data
    users = seed_users()
    policies = seed_policies()
    active_subscriptions = seed_subscriptions(users, policies)
    claims = seed_claims(active_subscriptions)
    seed_payments(active_subscriptions, claims)
    seed_documents(users, active_subscriptions, claims)
    
    print("--- Database seeding completed ---")