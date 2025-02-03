import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .chat_api import AiChat

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        print('Disconnected:', close_code)

    async def receive(self, text_data):
        # text data from the client
        text_data_json = json.loads(text_data)
        prompt = text_data_json["prompt"]
        # choose a model 
        model = 'gpt-4o-mini' 

        # Response
        model_response = AiChat(prompt, model, self.channel_name)  # instantiate
        response = model_response.chat()  # run the model

        # Send the response to the client
        await self.send(text_data=json.dumps({
            'prompt': prompt,
            'response': response,
        }))

# Create your views here.
