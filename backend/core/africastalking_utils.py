import africastalking
import os

africastalking.initialize(
    username=os.getenv('AFRICASTALKING_USERNAME'),
    api_key=os.getenv('AFRICASTALKING_API_KEY')
)
sms = africastalking.SMS

def send_otp_sms(phone_number, otp):
    message = f"Your verification code is {otp}"
    sender = os.getenv('AFRICASTALKING_SENDER_ID', None)
    if sender:
        sms.send(message, [phone_number], sender_id=sender)
    else:
        sms.send(message, [phone_number])
