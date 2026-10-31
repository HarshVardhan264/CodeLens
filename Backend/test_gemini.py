from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.8-flash",
    temperature=0,
    timeout=30
)

response = llm.invoke("Reply with exactly: GEMINI_OK")

print("CONTENT:", repr(response.content))
print("METADATA:", response.response_metadata)