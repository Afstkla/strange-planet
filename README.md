# Linguistic Conversion Apparatus

A device for transmuting primitive human verbal emissions into the refined articulations of an advanced civilization.

## Purpose of This Apparatus

The beings on this planet communicate using crude abbreviations and imprecise terminology. This apparatus intercepts their utterances and converts them into appropriately verbose and clinically accurate phrasing, as documented by the observer Nathan W. Pyle in his field notes regarding our civilization.

For example, a human might say "I'm hungry" when the correct expression is clearly "I am experiencing a caloric deficit and require sustenance intake."

## Activating the Apparatus

### Required Components

- The language known as Python (version 3.8 or more recent iterations)
- An access credential for the OpenAI computational intelligence network
- The dependency procurement tool called [uv](https://docs.astral.sh/uv/)

### Initialization Sequence

Obtain the source materials:

```bash
git clone https://github.com/Afstkla/strange-planet.git
cd strange-planet
```

Configure the computational intelligence credential:

```bash
cp .env.example .env
```

Place your OpenAI access credential within the `.env` document.

Engage the apparatus:

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8001
```

Direct your rectangular information display device to `http://localhost:8001`.

## Operating the Apparatus

1. Deposit your primitive utterance into the left receptacle
2. The computational intelligence will process your crude phrasing
3. A refined articulation materializes in the right receptacle
4. Press the duplication control to transfer the result to your clipboard mechanism

The apparatus automatically initiates conversion after 500 milliseconds of keystroke inactivity. There is no need to locate and depress a submission control.

## Construction Materials

- **Computational Framework:** FastAPI with response streaming capabilities
- **Intelligence Engine:** OpenAI GPT-4.1-nano
- **Visual Interface:** HTML, CSS, and JavaScript without extraneous frameworks
- **Dependency Coordination:** UV

## Attribution of Intellectual Origin

This apparatus was constructed in admiration of the documented observations by the being known as Nathan W. Pyle. This is merely a tribute creation — all intellectual property regarding the Strange Planet civilization belongs to its original chronicler.

## Permission Documentation

This project operates under the MIT permission framework.
