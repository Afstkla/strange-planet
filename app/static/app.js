let debounceTimer = null;
let currentController = null;

const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const copyBtn = document.getElementById('copy-btn');
const speechBtn = document.getElementById('speech-btn');


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

let effectsTimeout = null;

function showLoading() {
    loadingDiv.style.display = 'block';
    copyBtn.disabled = true;
    
    // EXTREME EFFECTS START
    startExtremeEffects();
    
    // Clear any existing timeout
    if (effectsTimeout) {
        clearTimeout(effectsTimeout);
    }
}

function hideLoading() {
    // Always ensure effects run for at least 1.5 seconds for the full experience
    const minEffectDuration = 1500;
    
    effectsTimeout = setTimeout(() => {
        loadingDiv.style.display = 'none';
        copyBtn.disabled = false;
        
        // EXTREME EFFECTS STOP
        stopExtremeEffects();
    }, minEffectDuration);
}

// EXTREME SCANNING EFFECTS
function startExtremeEffects() {
    // Add scanning beam
    const scanBeam = document.createElement('div');
    scanBeam.className = 'scan-beam';
    scanBeam.id = 'scan-beam';
    document.querySelector('.translator-container').appendChild(scanBeam);
    
    // Add processing overlay
    const overlay = document.createElement('div');
    overlay.className = 'processing-overlay active';
    overlay.id = 'processing-overlay';
    document.querySelector('.container').appendChild(overlay);
    
    // Add data stream with matrix effect
    createDataStream();
    
    // Random screen glitch - faster for quick translations
    setInterval(() => {
        if (loadingDiv.style.display === 'block') {
            createScreenGlitch();
        }
    }, 400);
    
    // Random alien popup emojis - much faster burst
    setInterval(() => {
        if (loadingDiv.style.display === 'block') {
            createAlienPopup();
        }
    }, 300);
    
    // Scanning lines
    createScanLines();
    
    // Play random alien sounds
    playAlienSounds();
}

function stopExtremeEffects() {
    // Remove all effects
    const effects = ['scan-beam', 'processing-overlay', 'data-stream', 'screen-glitch'];
    effects.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.remove();
    });
    
    // Clear scanning lines
    document.querySelectorAll('.scan-line').forEach(line => line.remove());
    
    // Stop sounds
    stopAlienSounds();
}

function createDataStream() {
    const dataStream = document.createElement('div');
    dataStream.className = 'data-stream active';
    dataStream.id = 'data-stream';
    document.body.appendChild(dataStream); // Append to body instead of container
    
    // Create matrix characters across full screen
    const chars = '01◈※⟦⟧⟳⟡░▒▓█';
    const screenWidth = window.innerWidth;
    const numChars = Math.floor(screenWidth / 15); // More characters for wider screens
    
    for (let i = 0; i < numChars; i++) {
        setTimeout(() => {
            if (document.getElementById('data-stream')) {
                const char = document.createElement('div');
                char.className = 'matrix-char';
                char.textContent = chars[Math.floor(Math.random() * chars.length)];
                char.style.left = Math.random() * (screenWidth - 20) + 'px'; // Full screen width
                char.style.animationDelay = Math.random() * 2 + 's';
                char.style.animationDuration = (2 + Math.random() * 2) + 's'; // Variable fall speed
                dataStream.appendChild(char);
                
                setTimeout(() => char.remove(), 4000); // Longer lifetime for full screen
            }
        }, i * 50); // Faster creation for more density
    }
}

function createScreenGlitch() {
    const glitch = document.createElement('div');
    glitch.className = 'screen-glitch';
    glitch.id = 'screen-glitch';
    document.body.appendChild(glitch);
    
    setTimeout(() => glitch.remove(), 300);
}

function createAlienPopup() {
    const aliens = [
        '🛸', '👽', '🛰️', '🌌', '⭐', '🔮', '🌟', '💫', '🎭', '🎪', '🎨', '🎯',
        '🌀', '⚡', '🔥', '💥', '✨', '🎆', '🎇', '🌈', '🦄', '🐙', '👁️', '🧿',
        '🔬', '🧪', '⚗️', '🧬', '💎', '🔭', '🎮', '🕹️', '🎲', '🃏', '🎨', '🎪',
        '🌊', '🌪️', '❄️', '☄️', '🌙', '☀️', '🪐', '🌍', '🌎', '🌏', '🚀', '🛰️',
        '👾', '🤖', '🦾', '🦿', '🧠', '👁️‍🗨️', '💭', '💡', '⚛️', '🧪', '🔬', '🧬'
    ];
    const popup = document.createElement('div');
    popup.className = 'alien-popup';
    popup.textContent = aliens[Math.floor(Math.random() * aliens.length)];
    popup.style.left = Math.random() * (window.innerWidth - 100) + 'px';
    popup.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

function createScanLines() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            if (loadingDiv.style.display === 'block') {
                const scanLine = document.createElement('div');
                scanLine.className = 'scan-line';
                scanLine.style.animationDelay = i * 0.2 + 's';
                document.querySelector('.translator-container').appendChild(scanLine);
                
                setTimeout(() => scanLine.remove(), 2000);
            }
        }, i * 200);
    }
}

// ALIEN SOUND EFFECTS
let soundInterval = null;

function playAlienSounds() {
    // Create audio context for Web Audio API sounds
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const AudioContextClass = AudioContext || webkitAudioContext;
        const audioContext = new AudioContextClass();
        
        soundInterval = setInterval(() => {
            if (loadingDiv.style.display === 'block') {
                playAlienBeep(audioContext);
            }
        }, 200 + Math.random() * 400);
    }
}

function playAlienBeep(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Random alien frequencies
    const frequencies = [220, 330, 440, 554, 659, 880];
    oscillator.frequency.setValueAtTime(
        frequencies[Math.floor(Math.random() * frequencies.length)], 
        audioContext.currentTime
    );
    
    // Random waveforms for weird sounds
    const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
    oscillator.type = waveforms[Math.floor(Math.random() * waveforms.length)];
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function stopAlienSounds() {
    if (soundInterval) {
        clearInterval(soundInterval);
        soundInterval = null;
    }
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
        copyBtn.textContent = '⟡ TRANSMISSION DUPLICATED ⟡';
        copyBtn.style.background = 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--alien-green) 0%, var(--alien-cyan) 100%)';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        outputText.select();
        outputText.setSelectionRange(0, 99999);
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '⟡ TRANSMISSION DUPLICATED ⟡';
        copyBtn.style.background = 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)';
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = 'linear-gradient(135deg, var(--alien-green) 0%, var(--alien-cyan) 100%)';
        }, 2000);
    });
}

// Add floating particles
function createParticles() {
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (4 + Math.random() * 4) + 's';
        
        const colors = ['var(--alien-cyan)', 'var(--alien-pink)', 'var(--alien-purple)', 'var(--alien-green)'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        container.appendChild(particle);
        
        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }
}

// Initialize particles and set interval
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setInterval(createParticles, 3000);
});

// Add weird typing effects
inputText.addEventListener('input', (e) => {
    // Random glitch effect
    if (Math.random() < 0.05) {
        const originalColor = inputText.style.color;
        inputText.style.color = 'var(--alien-pink)';
        inputText.style.textShadow = '0 0 10px var(--alien-pink)';
        setTimeout(() => {
            inputText.style.color = originalColor;
            inputText.style.textShadow = 'none';
        }, 100);
    }
    
    handleInputChange();
});

// ALIEN SPEECH SYNTHESIS
let currentSpeech = null;
let speechEffectsInterval = null;

function speakAlienText() {
    const textToSpeak = outputText.value.trim();
    
    if (!textToSpeak) {
        showError('No alien translation to transmit!');
        return;
    }
    
    // Stop any current speech
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        stopSpeechEffects();
        return;
    }
    
    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // ALIEN VOICE PARAMETERS
    utterance.pitch = 0.3;  // Very low pitch for alien depth
    utterance.rate = 0.85;  // Slightly slower for dramatic effect
    utterance.volume = 0.9;
    
    // Try to find a robotic-sounding voice
    const voices = speechSynthesis.getVoices();
    const roboticVoice = voices.find(v => 
        v.name.includes('Microsoft') || 
        v.name.includes('Google') ||
        v.name.includes('Zira') ||
        v.name.includes('David') ||
        v.name.toLowerCase().includes('male')
    );
    if (roboticVoice) {
        utterance.voice = roboticVoice;
    }
    
    // Speech event handlers
    utterance.onstart = () => {
        startSpeechEffects();
        speechBtn.classList.add('speaking');
        speechBtn.textContent = '⏹️ STOP TRANSMISSION';
        speechBtn.disabled = false;
    };
    
    utterance.onend = () => {
        stopSpeechEffects();
        speechBtn.classList.remove('speaking');
        speechBtn.textContent = '🔊 TRANSMIT AUDIO SIGNAL';
        speechBtn.disabled = false;
    };
    
    utterance.onerror = (event) => {
        stopSpeechEffects();
        speechBtn.classList.remove('speaking');
        speechBtn.textContent = '🔊 TRANSMIT AUDIO SIGNAL';
        speechBtn.disabled = false;
        showError('Audio transmission failed: ' + event.error);
    };
    
    // Start speech
    currentSpeech = utterance;
    speechSynthesis.speak(utterance);
}

function startSpeechEffects() {
    // Pulse the output text area
    outputText.style.animation = 'speechTextPulse 1s ease-in-out infinite';
    
    // Random screen glitches during speech
    speechEffectsInterval = setInterval(() => {
        if (speechSynthesis.speaking) {
            createScreenGlitch();
            
            // Random alien popup during speech
            if (Math.random() < 0.3) {
                createAlienPopup();
            }
        }
    }, 800);
    
    // Add speech pulse animation to container
    const container = document.querySelector('.container');
    container.style.animation = 'containerPulse 2s ease-in-out infinite, speechContainerGlow 1.5s ease-in-out infinite';
}

function stopSpeechEffects() {
    // Stop text pulsing
    outputText.style.animation = '';
    
    // Clear effects interval
    if (speechEffectsInterval) {
        clearInterval(speechEffectsInterval);
        speechEffectsInterval = null;
    }
    
    // Reset container animation
    const container = document.querySelector('.container');
    container.style.animation = 'containerPulse 4s ease-in-out infinite';
}

// Initialize speech synthesis voices (needed for some browsers)
speechSynthesis.onvoiceschanged = () => {
    // Voice list is now available
    if (speechBtn) {
        speechBtn.disabled = false;
    }
};

// Add speech text pulse animation CSS via JavaScript
const speechStyle = document.createElement('style');
speechStyle.textContent = `
    @keyframes speechTextPulse {
        0%, 100% { 
            border-color: var(--alien-green);
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
        }
        50% { 
            border-color: var(--alien-orange);
            box-shadow: 0 0 40px rgba(245, 158, 11, 0.6);
        }
    }
    
    @keyframes speechContainerGlow {
        0%, 100% { 
            box-shadow: 0 0 50px rgba(124, 58, 237, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        50% { 
            box-shadow: 0 0 100px rgba(245, 158, 11, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
    }
`;
document.head.appendChild(speechStyle);