const recordButton = document.getElementById('recordButton');
const statusDiv = document.getElementById('status');

let mediaRecorder;
let audioChunks = [];

// Request microphone access
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.onstart = () => {
            statusDiv.textContent = 'Recording... Please speak.';
            audioChunks = [];
        };

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            statusDiv.textContent = 'Recording stopped. Processing audio...';

            // Convert audio to Blob and send to server
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            try {
                const response = await fetch('/process-audio', {
                    method: 'POST',
                    body: formData,
                });

                const result = await response.json();
                if (result.success) {
                    statusDiv.textContent = 'Audio processed successfully: ' + result.message;
                } else {
                    statusDiv.textContent = 'Error processing audio.';
                }
            } catch (error) {
                console.error('Error:', error);
                statusDiv.textContent = 'Failed to process audio.';
            }

            // Stop microphone access
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // Stop after 5 seconds

    } catch (error) {
        console.error('Microphone access denied or error:', error);
        statusDiv.textContent = 'Microphone access denied. Please allow access to use this feature.';
    }
}

recordButton.addEventListener('click', startRecording);
