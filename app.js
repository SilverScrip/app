document.addEventListener('DOMContentLoaded', function () {
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendButton");
  const stopButton = document.getElementById("stopButton");
  const audioPlayer = document.createElement("audio");

  let ws;

  function connectWebSocket() {
    const host = window.location.hostname;
    ws = new WebSocket(`ws://${host}:8080/audio`);

    ws.addEventListener('message', function (evt) {
      handleMessage(evt.data);
    });

    ws.addEventListener('open', function (evt) {
      console.log("Audio Socket connection opened.");
    });

    ws.addEventListener('close', function (evt) {
      console.log("Audio Socket connection closed. Reconnecting...");
      setTimeout(connectWebSocket, 3000);
    });
  }

  connectWebSocket();

  sendButton.addEventListener('click', function () {
    sendMessage();
  });

  stopButton.addEventListener('click', function () {
    stopAudio();
  });

  function handleMessage(data) {
    const host = window.location.hostname;
    const audioSrc = `http://${host}:8000/build/${data.slice(0, 5)}.wav`;
    setTimeout(() => {
      playAudio(audioSrc);
    }, 1000);
  }

  function stopAudio() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    console.error("Audio playback stopped.");
  }

  function playAudio(audioSrc) {
    audioPlayer.src = audioSrc;
    audioPlayer.play();
  }

  function sendMessage() {
    const message = messageInput.value;

    if (ws.readyState === WebSocket.OPEN) {
      const completeMessage = `${message}`;
      ws.send(completeMessage);
      messageInput.value = "";
    } else {
      console.error("Audio Socket is not open. Unable to send message.");
    }
  }

  window.addEventListener('beforeunload', function () {
    if (ws) {
      ws.close();
    }
  });
});
