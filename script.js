const recordBtn = document.getElementById("record-btn");
const sendBtn = document.getElementById("send-btn");
const audioPlayer = document.getElementById("audio-player");

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener("click", async () => {
  if (!mediaRecorder) {
    try {
      // Solicita permissão para usar o microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayer.src = audioUrl;
        audioPlayer.hidden = false;
        sendBtn.disabled = false;

        sendBtn.onclick = () => {
          const link = `https://wa.me/?text=Check out my audio translated by Pizza AI! ${audioUrl}`;
          window.open(link, "_blank");
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
