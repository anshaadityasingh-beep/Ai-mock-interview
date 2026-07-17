/**
 * Speech Service — browser-native voice I/O using Web Speech API.
 * No paid APIs or environment variables needed.
 */

let recognitionInstance = null;

/**
 * Speaks the given text aloud using the browser's SpeechSynthesis API.
 * @param {string} text - The text to read aloud.
 * @param {Function} onEnd - Callback invoked when speech finishes (or immediately if unsupported).
 */
export const speakText = (text, onEnd) => {
  // If SpeechSynthesis is not supported, fail silently and call onEnd
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech before starting new one
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    // If speech fails, still call onEnd so the app continues
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

/**
 * Stops any ongoing speech synthesis.
 */
export const stopSpeaking = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Starts listening for speech input using the browser's SpeechRecognition API.
 * @param {Function} onResult - Called with the transcribed text string when recognition completes.
 * @param {Function} onError - Called with an error message string if recognition fails or is unsupported.
 */
export const startListening = (onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    if (onError) {
      onError("Voice input isn't supported in this browser. Please type your answer instead.");
    }
    return;
  }

  // Stop any existing recognition session
  stopListening();

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult) onResult(transcript);
    recognitionInstance = null;
  };

  recognition.onerror = (event) => {
    let message;
    switch (event.error) {
      case 'no-speech':
        message = "No speech was detected. Please try again or type your answer.";
        break;
      case 'audio-capture':
        message = "No microphone was found. Please ensure a microphone is connected.";
        break;
      case 'not-allowed':
        message = "Microphone access was denied. Please allow microphone access and try again.";
        break;
      default:
        message = "Voice input isn't supported in this browser. Please type your answer instead.";
    }
    if (onError) onError(message);
    recognitionInstance = null;
  };

  recognition.onend = () => {
    // Recognition ended naturally (no result or error already fired)
    recognitionInstance = null;
  };

  recognitionInstance = recognition;
  recognition.start();
};

/**
 * Manually stops any active speech recognition.
 */
export const stopListening = () => {
  if (recognitionInstance) {
    try {
      recognitionInstance.abort();
    } catch (e) {
      // Ignore errors when stopping
    }
    recognitionInstance = null;
  }
};
