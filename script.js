// Expose send() globally so the button onclick can call it
window.send = async function send() {
  const input = document.getElementById("city");
  const city = input.value.trim();
  if (!city) return;

  const chat = document.getElementById("chat");

  // User message
  chat.innerHTML += `<div class="message user">${city}</div>`;

  // AI placeholder
  const aiMsg = document.createElement("div");
  aiMsg.className = "message ai";
  aiMsg.innerText = "Thinking...";
  chat.appendChild(aiMsg);

  input.value = "";
  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("/api/groq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    });

    const data = await response.json();
    // Show useful error text if reply is missing
    aiMsg.innerText =
      data.reply ||
      data.error ||
      (typeof data.detail === "string"
        ? data.detail
        : JSON.stringify(data)) ||
      "No AI response.";
  } catch (error) {
    aiMsg.innerText = "Error connecting to server.";
  }

  chat.scrollTop = chat.scrollHeight;
};
