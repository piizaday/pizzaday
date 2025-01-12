const recordBtn = document.getElementById("record-btn");
const sendBtn = document.getElementById("send-btn");
const audioPlayer = document.getElementById("audio-player");
const translatedAudioPlayer = document.getElementById("translated-audio-player");

let mediaRecorder;
let audioChunks = [];
let audioBlob;

// Function to handle microphone and audio recording
recordBtn.addEventListener("click", async () => {
  if (!mediaRecorder) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioPlayer.hidden = false;
        sendBtn.disabled = false;

        // Translate Audio to English
        const translatedAudio = await translateAudio(audioBlob);

        // Set the translated audio
        const translatedUrl = URL.createObjectURL(translatedAudio);
        translatedAudioPlayer.src = translatedUrl;
        translatedAudioPlayer.hidden = false;

        sendBtn.onclick = () => {
          sendToWhatsApp(translatedAudio);
        };
      };
    } catch (error) {
      alert("Error accessing the microphone: " + error.message);
    }
  }

  if (mediaRecorder.state === "inactive") {
    audioChunks = [];
    mediaRecorder.start();
    recordBtn.textContent = "⏹️ Stop Recording";
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = "🎙️ Record Audio";
  }
});

// Function to translate audio to English (via API)
async function translateAudio(audioBlob) {
  const audioText = await transcribeAudio(audioBlob); // Transcribe the audio to text
  const translatedText = await translateText(audioText); // Translate the text
  const translatedAudio = await textToSpeech(translatedText); // Convert translated text to speech
  return translatedAudio;
}

// Function to transcribe audio to text
async function transcribeAudio(audioBlob) {
  // Implement transcription API call (e.g., Google Cloud Speech-to-Text)
  return "Hello, this is the translated text."; // Placeholder for transcription
}

// Function to translate text
async function translateText(text) {
  // Implement translation API call (e.g., Google Cloud Translation API)
  return "Hello, this is the translated text."; // Placeholder for translation
}

// Function to convert text to speech
async function textToSpeech(text) {
  // Convert translated text to audio (e.g., Google Text-to-Speech API)
  // For demonstration, we use a placeholder.
  const audio = new Blob([new Uint8Array([1, 2, 3])], { type: 'audio/mp3' });
  return audio;
}

// Function to send the translated MP3 file to WhatsApp
function sendToWhatsApp(audio) {
  const formData = new FormData();
  formData.append('file', audio, 'audio.mp3');
  const link = `https://wa.me/?text=Check out my translated audio!`;

  fetch(link, {
    method: 'POST',
    body: formData
  }).then(response => {
    console.log("Sent to WhatsApp", response);
  }).catch(error => {
    console.log("Error sending audio to WhatsApp", error);
  });
}
