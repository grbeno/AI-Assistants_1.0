from django.core.exceptions import ValidationError
import re


class UppercaseAndNumericPasswordValidator:
    
    def validate(self, password, user=None):
        
        error_messages = []
        if not re.search('[A-Z]', password):
            error_messages.append("The password must contain at least one uppercase letter.")
        
        if not re.search('[0-9]', password):
            error_messages.append("The password must contain at least one number.")
            
        if not re.match('^[A-Za-z0-9]*$', password):
            error_messages.append("The password must contain only alphanumeric characters.")
            
        if error_messages:
            raise ValidationError(error_messages)

    def get_help_text(self):
        return "Your password must contain at least one uppercase letter, one number, and only alphanumeric characters."