import os
import logging
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import json
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

logger = logging.getLogger(__name__)

ALLOWED_ORIGINS = [
    "https://strangeplanet.afstkla.nl",
    "http://localhost:8000",
    "http://localhost:8001",
]

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def validate_origin(request: Request, call_next):
    """Block POST requests to /translate that don't come from allowed origins."""
    if request.method == "POST" and request.url.path == "/translate":
        origin = request.headers.get("origin") or request.headers.get("referer") or ""
        if not any(origin.startswith(allowed) for allowed in ALLOWED_ORIGINS):
            return Response(content="Forbidden", status_code=403)
    return await call_next(request)


client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")


MODEL = "gpt-4.1-nano"


class TranslationRequest(BaseModel):
    text: str


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/translate")
@limiter.limit("30/minute")
async def translate_text(request: Request, translation_request: TranslationRequest):
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
            model=MODEL,
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
        logger.exception("Translation failed")
        raise HTTPException(status_code=500, detail="Translation failed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
