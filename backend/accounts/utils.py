def normalize_phone_number(phone_number):
    """Normalize phone number to +254 format"""
    if phone_number.startswith('0'):
        return '+254' + phone_number[1:]
    elif phone_number.startswith('254'):
        return '+' + phone_number
    return phone_number