let debounceTimer = null;
let currentController = null;

const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const copyBtn = document.getElementById('copy-btn');

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
        return;
    }
    
    debounceTimer = setTimeout(() => {
        translateText(text, 'gpt-4.1-nano');
    }, 500);
}

async function translateText(text, model) {
    showLoading();
    hideError();
    outputText.value = '';
    
    currentController = new AbortController();
    
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                model: model
            }),
            signal: currentController.signal
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
                    const jsonStr = line.slice(6);
                    if (jsonStr.trim()) {
                        try {
                            const data = JSON.parse(jsonStr);
                            if (data.content) {
                                translatedText += data.content;
                                outputText.value = translatedText;
                            } else if (data.done) {
                                hideLoading();
                                return;
                            }
                        } catch (e) {
                            console.warn('Failed to parse JSON:', jsonStr);
                        }
                    }
                }
            }
        }
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        
        if (error.name === 'AbortError') {
            return;
        }
        
        showError('Translation failed: ' + error.message);
        console.error('Translation error:', error);
    } finally {
        currentController = null;
    }
}

function showLoading() {
    loadingDiv.style.display = 'block';
    copyBtn.disabled = true;
}

function hideLoading() {
    loadingDiv.style.display = 'none';
    copyBtn.disabled = false;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function copyTranslation() {
    const translation = outputText.value;
    if (!translation) return;
    
    navigator.clipboard.writeText(translation).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });
}