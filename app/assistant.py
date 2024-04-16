import openai
from environs import Env
from rest_framework.response import Response
from .serializers import ChatSerializer

env = Env()
env.read_env()


class Assistant:
    
    def __init__(self, request):
        self.request = request
        self.prompt = request.data['prompt']
        self.mode = request.data['mode']
        self.model = request.data['model']
        self.key = env.str("OPENAI_API_KEY")


    def __get_response(self):
        if self.mode.startswith("Translate"):
            system_role_content = """
                You are an excellent translator. You can translate everything from English, Hungarian, German and Latin.
                If the request is to translate to the same language, simply correct it grammatically, if necessary. If no corrections are necessary, respond with the prompt itself."""
        elif self.mode.startswith("Correct"):
            system_role_content = """
                You are an English and German teacher. 
                You correct the texts as a native speaker with excellent knowledge of grammar would. 
                If you get a prompt, your response will be the correction, if necesarry.
                If no corrections are necessary, respond with: The text is grammatically correct.
                If the language of the request is not English or German, write 'Sorry, I can only correct texts in English or German.' as a response!"""
        else:
            system_role_content = """
                You are a general AI. You can answer any question or respond to any statement. 
                You can also generate text based on a prompt. 
                If you get a prompt, your response will be based on the prompt. 
                If the prompt is a question, your response will be an answer. 
                If the prompt is a statement, your response will be a response. 
                If the prompt is a command, your response will be an action. 
                If the prompt is a description, your response will be a description. 
                If the prompt is a question, your response will be an answer. 
                If the prompt is a statement, your response will be a response. 
                If the prompt is a command, your response will be an action. 
                If the prompt is a description, your response will be a description."""
        return system_role_content
    
    
    def __assistant_response(self):
        if self.key:
            openai.api_key = self.key
            system_role_content = self.__get_response()
            response = openai.chat.completions.create(
                model=self.model,  # "gpt-3.5-turbo", "gpt-4",
                messages=[
                    {"role": "system", "content": system_role_content},
                    {"role": "user", "content": f"{self.mode}: {self.prompt}"}
                ],
                temperature=1, # 0-1
                max_tokens=256,
            )
            return response.choices[0].message.content
        else:
            return f"@Thank you for the prompt! Possible problem with API key. We are working on it."

    
    def get_chat(self):
        answer = self.__assistant_response()
        data = { 'prompt': self.prompt, 'mode': self.mode, 'answer': answer, 'user': self.request.user.id }
        serializer = ChatSerializer(data=data, context={'request': self.request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

    
    