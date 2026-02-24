// Strange Planet Translator — Refined UI
// Handles debounced input, streaming translation, and copy functionality.

let debounceTimer = null;
let currentController = null;

const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const copyBtn = document.getElementById('copy-btn');
const copyBtnText = document.getElementById('copy-btn-text');

// --- Input handling ---

inputText.addEventListener('input', handleInputChange);

function handleInputChange() {
    clearTimeout(debounceTimer);

    if (currentController) {
        currentController.abort();
        currentController = null;
    }

    const text = inputText.value.trim();
    if (!text) {
        outputText.value = '';
        hideLoading();
        hideError();
        updateCopyButton();
        return;
    }

    debounceTimer = setTimeout(() => {
        translateText(text, 'gpt-4.1-nano');
    }, 500);
}

// --- Translation (streaming) ---

async function translateText(text, model) {
    showLoading();
    hideError();
    outputText.value = '';
    updateCopyButton();

    currentController = new AbortController();

    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, model }),
            signal: currentController.signal,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Translation failed');
        }

        const reader = response.body.getReader();
        let translatedText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6).trim();
                    if (!jsonStr) continue;
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.content) {
                            translatedText += data.content;
                            outputText.value = translatedText;
                        } else if (data.done) {
                            hideLoading();
                            updateCopyButton();
                            return;
                        }
                    } catch (e) {
                        console.warn('Failed to parse SSE JSON:', jsonStr);
                    }
                }
            }
        }

        hideLoading();
        updateCopyButton();
    } catch (error) {
        hideLoading();

        if (error.name === 'AbortError') return;

        showError('Translation failed: ' + error.message);
        console.error('Translation error:', error);
    } finally {
        currentController = null;
    }
}

// --- Loading state ---

function showLoading() {
    loadingDiv.classList.add('visible');
    copyBtn.disabled = true;
}

function hideLoading() {
    loadingDiv.classList.remove('visible');
}

// --- Error display ---

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('visible');
}

function hideError() {
    errorDiv.textContent = '';
    errorDiv.classList.remove('visible');
}

// --- Copy button ---

function updateCopyButton() {
    copyBtn.disabled = !outputText.value.trim();
}

copyBtn.addEventListener('click', copyTranslation);

function copyTranslation() {
    const translation = outputText.value;
    if (!translation) return;

    navigator.clipboard.writeText(translation).then(() => {
        showCopiedFeedback();
    }).catch(() => {
        // Fallback for older browsers
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        document.execCommand('copy');
        showCopiedFeedback();
    });
}

function showCopiedFeedback() {
    copyBtn.classList.add('copied');
    copyBtnText.textContent = 'Copied';

    setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtnText.textContent = 'Copy';
    }, 1500);
}
