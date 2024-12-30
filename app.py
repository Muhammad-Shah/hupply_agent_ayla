import uvicorn
from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from langchain_openai_voice import OpenAIVoiceReactAgent
from utils.utils import websocket_stream
from utils.prompt import INSTRUCTIONS
from utils.tools import TOOLS
from starlette.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
# Mount static files from the "static" directory
app.mount("/static", StaticFiles(directory="static"), name="static")
# Enable CORS if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    browser_receive_stream = websocket_stream(websocket)

    agent = OpenAIVoiceReactAgent(
        model="gpt-4o-realtime-preview",
        tools=TOOLS,
        instructions=INSTRUCTIONS,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    await agent.aconnect(browser_receive_stream, websocket.send_text)

# Home page route
@app.get("/", response_class=HTMLResponse)
async def homepage():
    with open("./static/index.html") as f:
        html = f.read()
    return HTMLResponse(html)

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=3000)
