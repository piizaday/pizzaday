/* Função para gravar áudio */
recordBtn.addEventListener("click", async () => {
  if (!mediaRecorder) {
    try {
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

        // Enviar para WhatsApp (simulação)
        sendBtn.onclick = () => {
          const link = `https://wa.me/?text=Olha o meu áudio traduzido pelo Pizza IA! ${audioUrl}`;
          window.open(link, "_blank");
        };
      };
    } catch (error) {
      alert("Erro ao acessar o microfone: " + error.message);
    }
  }

  if (mediaRecorder.state === "inactive") {
    audioChunks = [];
    mediaRecorder.start();
    recordBtn.textContent = "⏹️ Parar Gravação";
  } else {
    mediaRecorder.stop();
    recordBtn.textContent = "🎙️ Gravar Áudio";
  }
});
