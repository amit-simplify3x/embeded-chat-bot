(
    function() {
        const api_Url = "http://localhost:3000/api/chat"
        const scriptTag = document.currentScript;
        const ownerid = scriptTag.getAttribute("data-ownerid");
        if (!ownerid) {
            console.error("Owner ID is required");
            return;
        }

        // --- STYLES ---
        const style = document.createElement("style");
        style.textContent = `
            #antigravity-chat-container {
                position: fixed; bottom: 90px; right: 20px; width: 350px; height: 500px;
                background-color: white; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                display: none; flex-direction: column; z-index: 10000; font-family: sans-serif;
                overflow: hidden; border: 1px solid #eee; transition: all 0.3s ease;
            }
            #antigravity-chat-header {
                background: #007bff; color: white; padding: 15px; font-weight: bold;
                display: flex; justify-content: space-between; align-items: center;
            }
            #antigravity-chat-messages {
                flex: 1; padding: 15px; overflow-y: auto; background: #f8f9fa;
                display: flex; flex-direction: column; gap: 10px;
            }
            .antigravity-msg {
                max-width: 80%; padding: 8px 12px; border-radius: 15px; font-size: 14px; line-height: 1.4;
            }
            .antigravity-msg.user {
                align-self: flex-end; background: #007bff; color: white; border-bottom-right-radius: 2px;
            }
            .antigravity-msg.bot {
                align-self: flex-start; background: #e9ecef; color: #333; border-bottom-left-radius: 2px;
            }
            #antigravity-chat-input-area {
                padding: 10px; border-top: 1px solid #eee; display: flex; gap: 5px;
            }
            #antigravity-chat-input {
                flex: 1; border: 1px solid #ddd; padding: 8px; border-radius: 4px; outline: none;
            }
            #antigravity-chat-send {
                background: #007bff; color: white; border: none; padding: 0 15px; border-radius: 4px; cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // --- COMPONENTS ---
        // Chat Window
        const container = document.createElement("div");
        container.id = "antigravity-chat-container";
        container.innerHTML = `
            <div id="antigravity-chat-header">
                <span>Customer Support</span>
                <span id="antigravity-close" style="cursor:pointer">&times;</span>
            </div>
            <div id="antigravity-chat-messages"></div>
            <div id="antigravity-chat-input-area">
                <input type="text" id="antigravity-chat-input" placeholder="Type a message...">
                <button id="antigravity-chat-send">Send</button>
            </div>
        `;
        document.body.appendChild(container);

        // Chat Button
        const button = document.createElement("div");
        button.innerHTML = `
            <div style="position: fixed; bottom: 20px; right: 20px; width: 60px; height: 60px; background-color: #007bff; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 9999; font-family: sans-serif; transition: transform 0.3s;"
                 onmouseover="this.style.transform='scale(1.1)'" 
                 onmouseout="this.style.transform='scale(1)'">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </div>
        `;
        document.body.appendChild(button);

        // --- LOGIC ---
        const messagesArea = document.getElementById("antigravity-chat-messages");
        const inputField = document.getElementById("antigravity-chat-input");
        const sendBtn = document.getElementById("antigravity-chat-send");
        const closeBtn = document.getElementById("antigravity-close");

        function toggleChat() {
            container.style.display = container.style.display === "flex" ? "none" : "flex";
        }

        button.onclick = toggleChat;
        closeBtn.onclick = toggleChat;

        function addMessage(text, sender) {
            const div = document.createElement("div");
            div.className = `antigravity-msg ${sender}`;
            div.innerText = text;
            messagesArea.appendChild(div);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }

        async function sendMessage() {
            const text = inputField.value.trim();
            if (!text) return;

            addMessage(text, "user");
            inputField.value = "";

            // Typing indicator
            const typingDiv = document.createElement("div");
            typingDiv.className = "antigravity-msg bot";
            typingDiv.innerText = "...";
            messagesArea.appendChild(typingDiv);

            try {
                const response = await fetch(api_Url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: text, ownerid: ownerid })
                });
                const data = await response.json();
                messagesArea.removeChild(typingDiv);
                addMessage(data.message || "Sorry, I couldn't process that.", "bot");
            } catch (error) {
                messagesArea.removeChild(typingDiv);
                addMessage("Connection error. Please try again.", "bot");
                console.error(error);
            }
        }

        sendBtn.onclick = sendMessage;
        inputField.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };
    }
)()