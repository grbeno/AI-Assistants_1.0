import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .chat_api import AiChat
from accounts.serializers import OpenAITokensSerializer
from channels.db import database_sync_to_async
import tiktoken

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.model = ''
        # Access the authenticated user
        user = self.scope['user']
        if user.is_authenticated:
            await self.accept()
            #print(f"Authenticated user: {user.username}, ID: {user.id}")
            self.user_id = user.id  # Store the user ID for later use
        else:
            print("Unauthenticated user")
            await self.close()

    async def disconnect(self, close_code):
        print('Disconnected:', close_code)

    async def receive(self, text_data):
        # text data from the client
        text_data_json = json.loads(text_data)
        prompt = text_data_json["prompt"]
        self.model = text_data_json["model"]

        # Response
        model_response = AiChat(prompt, self.model, self.channel_name)  # instantiate
        response = model_response.chat()  # run the model

        self.input_tokens = num_tokens(prompt)
        self.output_tokens = num_tokens(response)
        await self.count_openaitokens()

        # Send the response to the client
        await self.send(text_data=json.dumps({
            'prompt': prompt,
            'response': response,
        }))

    # Save conversation to database
    @database_sync_to_async
    def count_openaitokens(self):
        token_data = {
            'user': self.user_id,
            'model': self.model,
            'input_token': self.input_tokens,
            'output_token': self.output_tokens,
        }
        serializer = OpenAITokensSerializer(data=token_data)
            
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return serializer.data

def num_tokens(string, encoding_name="o200k_base"):
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

 