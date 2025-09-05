# 🛸 Strange Planet Translator

**◈ LINGUISTIC CONVERSION APPARATUS ◈**

Transform your primitive human utterances into the verbose, clinical language of Strange Planet! Experience the most psychedelic, alien-powered translation interface in the galaxy.

![Strange Planet Translator Demo](https://img.shields.io/badge/Status-Operational-brightgreen) ![Python](https://img.shields.io/badge/Python-3.8+-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green) ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4.1--nano-purple)

## ✨ Features

### 🧠 Translation Engine
- **OpenAI GPT-4.1-nano** integration for lightning-fast translations
- **Auto-reload** with 500ms debouncing - no buttons needed!
- **Request cancellation** - new inputs cancel previous translations
- **Streaming responses** for real-time translation updates

### 👽 Alien Experience
- **Psychedelic interface** with space-age fonts (Orbitron, Space Mono)
- **56 alien emojis** randomly popping up during translation
- **Scanning beam effects** that sweep across the interface
- **Matrix data streams** with alien symbols (◈※⟦⟧⟳⟡░▒▓█)
- **Screen glitch distortions** for authentic alien tech feel
- **Web Audio API sounds** - bleeps and bloops symphony
- **Guaranteed 1.5s minimum effect duration** for full experience

### 🎨 Visual Effects
- **Pulsing containers** with color-shifting glows
- **Floating particles** drifting across the interface
- **Random typing glitches** (5% chance per keystroke)
- **Shimmer animations** on headers
- **Processing overlays** with radial gradients

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- OpenAI API Key
- [uv](https://docs.astral.sh/uv/) (recommended) or pip

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Afstkla/strange-planet.git
   cd strange-planet
   ```

2. **Set up your OpenAI API key:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key:
   # OPENAI_API_KEY=your_api_key_here
   ```

3. **Run with uv (recommended):**
   ```bash
   uv run --with fastapi --with uvicorn --with openai --with python-dotenv --with jinja2 --with python-multipart uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
   ```

   **Or with pip:**
   ```bash
   pip install fastapi uvicorn openai python-dotenv jinja2 python-multipart
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
   ```

4. **Open your browser:**
   ```
   http://localhost:8001
   ```

## 🎭 Usage

1. **Type your text** in the "PRIMITIVE UTTERANCE INPUT" field
2. **Watch the alien magic happen** - automatic translation after 500ms
3. **Experience the full alien rave** with visual and audio effects
4. **Copy your translation** with the "※ DUPLICATE TRANSLATION ※" button

### Example Translations
- "I'm happy" → "I am experiencing elevated mood indicators"
- "Let's eat" → "We shall commence sustenance consumption procedures"
- "I love my dog" → "I harbor deep affection for my domesticated quadruped companion"

## 🛠️ Technology Stack

- **Backend:** FastAPI with streaming responses
- **AI:** OpenAI GPT-4.1-nano
- **Frontend:** Jinja2 templates with vanilla JavaScript
- **Styling:** Pure CSS with advanced animations
- **Audio:** Web Audio API for alien sound effects
- **Package Management:** UV/pip compatible

## 🎨 Customization

### Modify Alien Effects
Edit `app/static/app.js` to adjust:
- Effect timing intervals
- Emoji collections
- Sound frequencies
- Animation durations

### Change Visual Style
Edit `app/templates/index.html` CSS section to modify:
- Color schemes
- Animations
- Fonts
- Layout

### Add New Models
Edit `app/main.py` to change the default model or add model selection.

## 🐛 Troubleshooting

### Port Already in Use
If port 8001 is taken, change the port:
```bash
uvicorn app.main:app --reload --port 8002
```

### Audio Not Working
Modern browsers require user interaction before playing audio. The sounds will start after you begin typing.

### Effects Too Intense?
Edit the timing values in `app/static/app.js` to make effects less frequent.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your alien improvements
4. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Strange Planet comic series
- Built with love for alien aesthetics and weird UX
- Powered by OpenAI's incredible language models

---

**※ Transform your communication into extraterrestrial sophistication! ※**

🛸 **Happy translating, fellow humans!** 👽