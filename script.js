const chat = document.getElementById("chat");
const input = document.getElementById("city");

const API_TOKEN = "aab499a87d49aab331efcc5f8d139c82c2e10dc8";

// ------------------ UI HELPERS ------------------
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerHTML = text;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// ------------------ AQI LOGIC ------------------
function getAQIInfo(aqi) {
  if (aqi <= 50) return { level: "Good 🟢", risk: "low" };
  if (aqi <= 100) return { level: "Moderate 🟡", risk: "moderate" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups 🟠", risk: "sensitive" };
  if (aqi <= 200) return { level: "Unhealthy 🔴", risk: "high" };
  if (aqi <= 300) return { level: "Very Unhealthy 🟣", risk: "very-high" };
  return { level: "Hazardous ⚫", risk: "extreme" };
}

// ------------------ BASIC AI ENGINE ------------------
function aiResponse(city, aqi) {
  const info = getAQIInfo(aqi);
  const hour = new Date().getHours();

  let timeTip = hour < 10 || hour > 18
    ? "Early morning or late evening is safer for going outside."
    : "Avoid outdoor activities during peak daytime hours.";

  let advice = "";

  switch (info.risk) {
    case "low":
      advice = "The air is clean and healthy today. You can enjoy outdoor activities freely.";
      break;
    case "moderate":
      advice = "Air quality is acceptable, but sensitive individuals should be cautious.";
      break;
    case "sensitive":
      advice = "If you have asthma or allergies, consider wearing a mask outdoors.";
      break;
    case "high":
      advice = "Outdoor exercise is not recommended today. Limit exposure.";
      break;
    case "very-high":
      advice = "Health risks are serious. Staying indoors is strongly advised.";
      break;
    case "extreme":
      advice = "Emergency-level pollution detected. Avoid going outside completely.";
      break;
  }

  return `
    🤖 <b>AQI Assistant Analysis</b><br><br>
    In <b>${city}</b>, the current AQI is <b>${aqi}</b>, which is classified as <b>${info.level}</b>.<br><br>
    🩺 <b>Health Insight:</b> ${advice}<br><br>
    ⏰ <b>AI Tip:</b> ${timeTip}
  `;
}

// ------------------ SEND FUNCTION ------------------
async function send() {
  const city = input.value.trim();
  if (!city) return;

  addMessage(city, "user");
  input.value = "";

  const loading = document.createElement("div");
  loading.className = "message ai";
  loading.innerText = "🤖 AI is analyzing air quality...";
  chat.appendChild(loading);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch(
      `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${API_TOKEN}`
    );

    const data = await res.json();
    chat.removeChild(loading);

    if (data.status !== "ok") {
      addMessage("❌ I couldn't find AQI data for that city.", "ai");
      return;
    }

    const aqi = data.data.aqi;
    const cityName = data.data.city.name;
    const time = data.data.time.s;

    addMessage(
      `<b>📍 Location:</b> ${cityName}<br>
       <b>🧪 AQI:</b> ${aqi}<br>
       <b>⏰ Updated:</b> ${time}`,
      "ai"
    );

    // AI message
    setTimeout(() => {
      addMessage(aiResponse(cityName, aqi), "ai");
    }, 600);

  } catch (err) {
    chat.removeChild(loading);
    addMessage("⚠️ Network error occurred.", "ai");
  }
}

// Enter key support
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});
