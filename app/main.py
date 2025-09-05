import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import json
import asyncio
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")
client = openai.OpenAI()

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

class TranslationRequest(BaseModel):
    text: str
    model: str = "gpt-4.1-nano"

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/translate")
async def translate_text(translation_request: TranslationRequest):
    if not translation_request.text.strip():
        return {"error": "No text provided"}
    
    try:
        system_prompt = """You are a translator for the Strange Planet comic universe. Translate the given text to "Strange Planet" language style, which follows these patterns:

1. Replace common words with overly verbose, clinical descriptions
2. Use formal, scientific-sounding language for simple concepts
3. Examples:
   - "mouth" becomes "oral cavity" 
   - "eating" becomes "consuming sustenance"
   - "sleeping" becomes "entering dormancy period"
   - "happy" becomes "experiencing elevated mood indicators"
   - "dog" becomes "domesticated quadruped companion"
   - "car" becomes "personal transportation vessel"
   - "phone" becomes "portable communication device"

Make it sound like an alien trying to be very precise about human activities. Keep the same meaning but make it absurdly formal and verbose."""

        stream = client.chat.completions.create(
            model=translation_request.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": translation_request.text}
            ],
            stream=True,
            max_tokens=500,
            temperature=0.7
        )

        async def generate():
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    yield f"data: {json.dumps({'content': content})}\n\n"
            yield "data: {\"done\": true}\n\n"

        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)