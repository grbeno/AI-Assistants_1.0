from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from .models import CustomUser as User 


# Testing signup and login views

class SignupViewTestCase(TestCase):
    """ Test module for SignupView """
    def setUp(self):
        self.client = Client()
        self.signup_url = reverse('create_user')
        self.UserModel = User

    def test_signup(self, data: dict = {'username': 'testuser', 'email': 'testuser@example.com', 'password': 'testPassword123', 'password2': 'testPassword123'}) -> int:
        response = self.client.post(self.signup_url, data)
        return response.status_code
    
    def test_signup_success(self):
        response = self.test_signup()
        self.assertEqual(response, status.HTTP_201_CREATED)
        self.assertEqual(self.UserModel.objects.count(), 1)  # 1 user created successfully
        self.assertEqual(self.UserModel.objects.get().username, 'testuser')  # then, get the created user's username
        print("Case: The user created successfully")
        
    def test_signup_failure(self):
        print("\nTest cases for signup view")
        print("Case: Invavalid data...")
        data = {
            'username': '',
            'email': '',
            'password': '',
            'password2': '',
        }
        status_code = self.test_signup(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.UserModel.objects.count(), 0)

    def test_signup_failure_username_exists(self):
        print("Cases: username already exists...")    
        # 1
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testPassword123',
            'password2': 'testPassword123'
        }
        status_code = self.test_signup(data)
        self.assertEqual(status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.UserModel.objects.count(), 1)  # 1st user created successfully
        print("The username 'testuser' created successfully")
        # 2
        data = {
            'username': 'testuser2',
            'email': 'testuser2@example.com',
            'password': '2testPassword123',
            'password2': '2testPassword123'
        }
        status_code = self.test_signup(data)
        self.assertEqual(status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.UserModel.objects.count(), 2)  # 2nd user created successfully
        print("The username 'testuser2' created successfully")  
        # 3
        data = {
            'username': 'testuser2',
            'email': 'testuser2@example.com',
            'password': '3testPassword123',
            'password2': '3testPassword123'
        }
        status_code = self.test_signup(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.UserModel.objects.count(), 2)  # 3rd user with the already existed 'testuser' username was not created
        print("The username 'testuser2' already exists")
    

    def test_signup_failure_passwords_mismatch(self):
        data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testPassword123',
            'password2': 'testPassword1234'
        }
        status_code = self.test_signup(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.UserModel.objects.count(), 0)
        print("Case: The passwords do not match")


class LoginViewTestCase(TestCase):
    """ Test module for LoginView """
    def setUp(self):
        self.client = Client()
        self.login_url = reverse('token_obtain_pair')
        self.UserModel = User 
        self.user = self.UserModel.objects.create_user(username='testuser',)
        self.user.set_password('testPassword123')
        self.user.save()
        
    def test_login(self, data: dict = {'username': 'testuser', 'password': 'testPassword123'}) -> tuple:
        response = self.client.post(self.login_url, data)
        return response.status_code, response.data

    # 200: OK, when the request is successful

    def test_login_success(self):
        # username and password are correct, use the default values
        # get status code and response
        status_code, response_data = self.test_login()
        # check status code
        self.assertEqual(status_code, status.HTTP_200_OK)
        # check access and refresh tokens
        self.assertTrue('access' in response_data)
        self.assertTrue('refresh' in response_data)
        print("Case: The username and password are correct")

    # 401: Unathorized, when the user is not authenticated or the credentials are invalid
    # password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 digit and not contain any spaces or special characters
    # username must not contain any special characters, and must be unique
     
    def test_login_failure(self):
        print("\nTest cases for login view")
        print("Case: The username and password are incorrect")
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
    
    def test_login_failure_user_not_found(self):
        print("Case: The user is not found")
        data = {
            'username': 'unknownuser',
            'password': 'testPassword123'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)

    def test_login_failure_invalid_username(self):
        print("Case: The username is invalid")
        data = {
            'username': 'testuser!',
            'password': 'testPassword123'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
    
    def test_login_failure_invalid_password(self):
        print("Case: The password is invalid")
        data = {
            'username': 'testuser',
            'password': 'testPassword'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_invalid_password2(self):
        print("Case: The password is invalid")
        data = {
            'username': 'testuser',
            'password': 'testPassword!'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_invalid_username_and_password(self):
        print("Case: The username and password are invalid")
        data = {
            'username': 'testuser!',
            'password': 'testPassword'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_missing_username(self):
        print("Case: The username is missing")
        data = {
            'username': '',
            'password': 'testPassword123'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)    

    # 400: Bad Request, when the request is invalid, missing required fields, etc.
    
    def test_login_failure_missing_username(self):
        print("Case: The username is missing")
        data = {
            'username': '',
            'password': 'testPassword123'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_missing_password(self):
        print("Case: The password is missing")
        data = {
            'username': 'testuser',
            'password': ''
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_missing_username_and_password(self):
        print("Case: The username and password are missing")
        data = {
            'username': '',
            'password': ''
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_invalid_username_and_missing_password(self):
        print("Case: The username is invalid and the password is missing")
        data = {
            'username': 'testuser!',
            'password': ''
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    def test_login_failure_missing_username_and_invalid_password(self):
        print("Case: The username is missing and the password is invalid")
        data = {
            'username': '',
            'password': 'testPassword!'
        }
        status_code, response_data = self.test_login(data)
        self.assertEqual(status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse('access' in response_data)
        self.assertFalse('refresh' in response_data)
        
    # Change password, reset password, delete account, etc. tests