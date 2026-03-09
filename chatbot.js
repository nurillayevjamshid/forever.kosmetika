const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

// API KEY (Agar OpenAI ishlatilsa - hozircha simple logic ishlatamiz)
const API_KEY = "";

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span>🤖</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (userMsg) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const msg = userMsg.toLowerCase();

    // SIMPLE AI LOGIC (Local)
    let reply = "Kechirasiz, tushunmadim. Iltimos, mahsulot nomini yozing yoki 'yetkazib berish' haqida so'rang.";

    if (msg.includes("salom") || msg.includes("qalay")) {
        reply = "Assalomu alaykum! For.Ever Cosmetics'ga xush kelibsiz. Sizga qanday yordam bera olaman? 😊";
    } else if (msg.includes("yetkazib") || msg.includes("dostavka")) {
        reply = "Ertaga yetkazib beramiz! Toshkent bo'ylab yetkazib berish bepul (ma'lum summa bo'yicha). Viloyatlarga pochta orqali.";
    } else if (msg.includes("to'lov") || msg.includes("pul") || msg.includes("narx")) {
        reply = "To'lovni naqd pul yoki Click/Payme orqali qilishingiz mumkin. Mahsulot narxlarini saytda ko'rishingiz mumkin.";
    } else if (msg.includes("aloqa") || msg.includes("telefon") || msg.includes("nomer")) {
        reply = "Biz bilan bog'lanish uchun: +998 90 123 45 67. Yoki 'Kontakt' bo'limiga o'ting.";
    } else {
        // PRODUCT SEARCH
        const foundProducts = products.filter(p => p.name.toLowerCase().includes(msg) || p.description.toLowerCase().includes(msg));

        if (foundProducts.length > 0) {
            reply = `Topilgan mahsulotlar (${foundProducts.length} ta):`;
            // Add product cards dynamically
            setTimeout(() => {
                const incomingChatLi = createChatLi(reply, "incoming");
                chatbox.appendChild(incomingChatLi);

                foundProducts.slice(0, 3).forEach(p => {
                    const card = document.createElement("div");
                    card.className = "chat-product-card";
                    card.innerHTML = `
                        <img src="${p.image}" alt="${p.name}">
                        <div class="chat-product-info">
                            <h4>${p.name}</h4>
                            <p style="color:#666;font-size:0.8rem">${formatPrice(p.price)} so'm</p>
                        </div>
                    `;
                    card.onclick = () => {
                        document.body.classList.remove("show-chatbot");
                        // Scroll to product on page
                        const productEl = document.getElementById(`product-card-${p.id}`);
                        if (productEl) {
                            productEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Highlight effect
                            const originalTransition = productEl.style.transition;
                            productEl.style.transition = 'all 0.5s ease';
                            productEl.style.transform = 'scale(1.05)';
                            productEl.style.boxShadow = '0 0 20px rgba(112, 0, 255, 0.5)';

                            setTimeout(() => {
                                productEl.style.transform = 'scale(1)';
                                productEl.style.boxShadow = '';
                                setTimeout(() => {
                                    productEl.style.transition = originalTransition;
                                }, 500);
                            }, 1000);
                        }
                    };
                    chatbox.appendChild(card);
                });
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }, 600);
            return; // Exit normal flow
        } else {
            reply = "Afsuski, bunday mahsulot topilmadi. Boshqa nom bilan qidirib ko'ring.";
        }
    }

    setTimeout(() => {
        const incomingChatLi = createChatLi(reply, "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    generateResponse(userMessage);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
