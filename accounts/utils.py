
""" VIEWS UTILS """

# Get error messages for views

def get_error_message(serializer, more_affected_fields=False):
    """ Get error messages from serializer. """
    
    if more_affected_fields:
        affected_field = []
        for key, value in serializer.errors.items():
            error_message = str(value[0])
            affected_field.append(f"{key} ")
        affected_field = list(affected_field)
    else:
        for key, value in serializer.errors.items():
            error_message = str(value[0])
            affected_field = key
    
    return {'error_message': error_message, 'affected_field': affected_field}