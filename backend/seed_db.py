import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')  # change to your actual project name
django.setup()

from core.models import Policy

def seed_policies():
    policies = [
        {
            "name": "Crop Cover - Maize",
            "policy_type": "crop",
            "premium": 500,
            "coverage": "Covers drought, pests (fall armyworm), floods, and crop disease for maize farmers.",
            "duration_months": 12
        },
        {
            "name": "Livestock Cover - Cattle",
            "policy_type": "livestock",
            "premium": 1000,
            "coverage": "Protects against cattle theft, disease, and accidental death.",
            "duration_months": 12
        },
        {
            "name": "Flood Damage Cover",
            "policy_type": "flood",
            "premium": 800,
            "coverage": "Covers loss due to flash floods and heavy rainfall damage in flood-prone counties.",
            "duration_months": 12
        },
        {
            "name": "Fire and Drought Combined Cover",
            "policy_type": "other",
            "premium": 1200,
            "coverage": "Combined protection from wildfire, accidental fires, and long-term drought.",
            "duration_months": 12
        },
        {
            "name": "Livestock Cover - Goats & Sheep",
            "policy_type": "livestock",
            "premium": 600,
            "coverage": "Covers mortality due to disease and theft of goats and sheep.",
            "duration_months": 12
        },
        {
            "name": "Crop Cover - Horticulture",
            "policy_type": "crop",
            "premium": 700,
            "coverage": "Protects tomato, onion, cabbage, and sukuma crops from pests, frost, and waterlogging.",
            "duration_months": 6
        },
    ]

    created = 0
    for data in policies:
        obj, was_created = Policy.objects.get_or_create(name=data['name'], defaults=data)
        if was_created:
            created += 1

    print(f"{created} new policies seeded.")

if __name__ == '__main__':
    seed_policies()
