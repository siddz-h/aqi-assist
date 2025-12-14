async function send() {
  const input = document.getElementById("city");
  const city = input.value.trim();
  if (!city) return;

  const chat = document.getElementById("chat");

  chat.innerHTML += `<div class="message user">${city}</div>`;

  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerText = "Thinking...";
  chat.appendChild(aiMsg);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city })
    });

    const data = await response.json();
    aiMsg.innerText = data.reply || "No AI response.";
  } catch (error) {
    aiMsg.innerText = "Error connecting to AI.";
  }

  chat.scrollTop = chat.scrollHeight;
}
