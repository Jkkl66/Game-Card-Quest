const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let aiHand = [];
let discardPile = [];
let isPlayerTurn = true;

// UI Elements
const playerHandEl = document.getElementById('player-hand');
const aiCardCountEl = document.getElementById('ai-card-count');
const discardPileEl = document.getElementById('discard-pile');
const deckEl = document.getElementById('deck');
const messageLogEl = document.getElementById('message-log');

function logMessage(msg) {
    const p = document.createElement('div');
    p.textContent = msg;
    messageLogEl.appendChild(p);
    messageLogEl.scrollTop = messageLogEl.scrollHeight;
}

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value, type: 'standard' });
        }
    }
    shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawCard(hand, count = 1) {
    for (let i = 0; i < count; i++) {
        if (deck.length === 0) {
            // Reshuffle discard pile (excluding top card) if deck is empty
            if (discardPile.length > 1) {
                logMessage("Reshuffling discard pile into deck...");
                const topCard = discardPile.pop();
                deck = discardPile;
                discardPile = [topCard];
                shuffle(deck);
            } else {
                logMessage("No more cards to draw!");
                return;
            }
        }
        hand.push(deck.pop());
    }
}

function dealInitialCards() {
    drawCard(playerHand, 7);
    drawCard(aiHand, 7);

    // Initial card for discard pile
    let initialCard = deck.pop();
    discardPile.push(initialCard);
}

function getSuitColor(suit) {
    if (suit === 'Hearts' || suit === 'Diamonds') return 'red';
    return 'black';
}

function renderPlayerHand() {
    playerHandEl.innerHTML = '';
    playerHand.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';
        cardEl.style.color = getSuitColor(card.suit);
        cardEl.innerHTML = `<div>${card.value}</div><div style="font-size:12px">${card.suit}</div>`;

        cardEl.addEventListener('click', () => tryPlayCard(index));
        playerHandEl.appendChild(cardEl);
    });
}

function renderGameState() {
    renderPlayerHand();
    aiCardCountEl.textContent = aiHand.length;

    if (discardPile.length > 0) {
        const topCard = discardPile[discardPile.length - 1];
        discardPileEl.style.color = getSuitColor(topCard.suit);
        discardPileEl.style.backgroundColor = 'white';
        discardPileEl.innerHTML = `<div>${topCard.value}</div><div style="font-size:12px">${topCard.suit}</div>`;
    }

    deckEl.innerHTML = `Deck (${deck.length})`;
}

function isValidPlay(card) {
    if (discardPile.length === 0) return true;
    const topCard = discardPile[discardPile.length - 1];

    return card.suit === topCard.suit || card.value === topCard.value;
}

function tryPlayCard(index) {
    if (!isPlayerTurn) return;

    const card = playerHand[index];
    if (isValidPlay(card)) {
        playerHand.splice(index, 1);
        discardPile.push(card);
        logMessage(`You played ${card.value} of ${card.suit}`);
        renderGameState();
        checkWinCondition();

        isPlayerTurn = false;
        setTimeout(aiTurn, 1000);
    } else {
        logMessage("Invalid play! Must match suit or value.");
    }
}

deckEl.addEventListener('click', () => {
    if (!isPlayerTurn) return;

    // Check if player has playable cards
    const hasPlayable = playerHand.some(isValidPlay);
    if (hasPlayable) {
        logMessage("You have playable cards. You must play one!");
        return;
    }

    logMessage("You drew a card.");
    drawCard(playerHand, 1);
    renderGameState();

    isPlayerTurn = false;
    setTimeout(aiTurn, 1000);
});

function aiTurn() {
    if (isPlayerTurn) return; // safety

    // AI tries to find a valid card
    let played = false;
    for (let i = 0; i < aiHand.length; i++) {
        if (isValidPlay(aiHand[i])) {
            const card = aiHand.splice(i, 1)[0];
            discardPile.push(card);
            logMessage(`Opponent played ${card.value} of ${card.suit}`);
            played = true;
            break;
        }
    }

    if (!played) {
        logMessage("Opponent drew a card.");
        drawCard(aiHand, 1);
    }

    renderGameState();
    checkWinCondition();
    isPlayerTurn = true;
}

function checkWinCondition() {
    if (playerHand.length === 0) {
        alert("You win!");
        resetGame();
    } else if (aiHand.length === 0) {
        alert("Opponent wins!");
        resetGame();
    }
}

function resetGame() {
    createDeck();
    playerHand = [];
    aiHand = [];
    discardPile = [];
    isPlayerTurn = true;
    messageLogEl.innerHTML = '';
    dealInitialCards();
    renderGameState();
    logMessage("Game started.");
}

document.addEventListener("DOMContentLoaded", () => {
    resetGame();
});
// --- Chaos & Glitch Engine ---

let chaosLevel = 0; // Increases over time, driving glitches
let glitchIntervalId = null;

function triggerRandomGlitch() {
    // Only apply glitches if chaos is high enough
    if (chaosLevel < 2) return;

    // 1. Sometimes shake the whole body
    if (Math.random() < 0.3) {
        document.body.classList.add('glitch-active');
        setTimeout(() => document.body.classList.remove('glitch-active'), 200 + Math.random() * 500);
    }

    // 2. Sometimes blur the play area
    if (Math.random() < 0.2) {
        document.getElementById('play-area').classList.add('glitch-blur');
        setTimeout(() => document.getElementById('play-area').classList.remove('glitch-blur'), 500 + Math.random() * 1000);
    }

    // 3. Move the deck button hitbox randomly
    if (chaosLevel >= 5 && Math.random() < 0.4) {
        deckEl.classList.add('moving-hitbox');
        deckEl.style.left = (Math.random() * 40 - 20) + 'px';
        deckEl.style.top = (Math.random() * 40 - 20) + 'px';
    }

    // 4. Scramble AI name
    if (Math.random() < 0.1) {
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        let randomStr = '';
        for(let i=0; i<8; i++) randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
        document.querySelector('#ai-area h2').childNodes[0].nodeValue = randomStr + " (";
        setTimeout(() => document.querySelector('#ai-area h2').childNodes[0].nodeValue = "Opponent (", 1000);
    }
}

function startChaosEngine() {
    if (glitchIntervalId) clearInterval(glitchIntervalId);

    // Increase chaos over time
    setInterval(() => {
        chaosLevel += 1;
    }, 15000); // +1 chaos every 15s

    // Try to trigger a glitch frequently
    glitchIntervalId = setInterval(triggerRandomGlitch, 2000);
}

// Start engine on load
document.addEventListener("DOMContentLoaded", () => {
    startChaosEngine();
});

// --- Red Herring Corruption Meter ---
const corruptionMeterEl = document.getElementById('corruption-meter');

function updateCorruptionMeter() {
    // Generate a completely nonsense number to confuse the player
    let fakeCorruptionValue;

    const randomChoice = Math.random();
    if (randomChoice < 0.3) {
        // Normal looking number
        fakeCorruptionValue = Math.floor(Math.random() * 100);
    } else if (randomChoice < 0.6) {
        // High number
        fakeCorruptionValue = Math.floor(Math.random() * 9999);
    } else if (randomChoice < 0.8) {
        // Negative number
        fakeCorruptionValue = -Math.floor(Math.random() * 500);
    } else {
        // Absolutely absurd integer limit type number
        fakeCorruptionValue = Math.floor(Math.random() * 2147483647);
    }

    corruptionMeterEl.textContent = `Corruption: ${fakeCorruptionValue}%`;

    // Randomize color slightly
    const r = Math.floor(100 + Math.random() * 155);
    const g = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 100);
    corruptionMeterEl.style.color = `rgb(${r},${g},${b})`;

    // Randomize the next update time (between 500ms and 4000ms)
    setTimeout(updateCorruptionMeter, 500 + Math.random() * 3500);
}

// Start fake corruption meter on load
document.addEventListener("DOMContentLoaded", () => {
    updateCorruptionMeter();
});

// --- Legendary Cards & Code Editor ---

const legendaryTypes = [
    { name: 'SYSTEM_OVERRIDE', type: 'legendary' },
    { name: 'NULL_POINTER', type: 'legendary' },
    { name: 'STACK_OVERFLOW', type: 'legendary' }
];

// Add legendary cards to deck creation
const originalCreateDeck = createDeck;
createDeck = function() {
    originalCreateDeck();

    // Add a few legendaries to the mix
    for(let i=0; i<3; i++) {
        deck.push({ ...legendaryTypes[0] }); // Add a SYSTEM_OVERRIDE
        deck.push({ ...legendaryTypes[1] }); // Add a NULL_POINTER
        deck.push({ ...legendaryTypes[2] }); // Add a STACK_OVERFLOW
    }
    shuffle(deck);
}

// Intercept isValidPlay to allow legendaries to be played anytime
// Also allow normal cards to be played ON TOP of legendaries
const originalIsValidPlay = isValidPlay;
isValidPlay = function(card) {
    if (card.type === 'legendary') return true;

    // If the top card is a legendary, any normal card can be played on it
    if (discardPile.length > 0) {
        const topCard = discardPile[discardPile.length - 1];
        if (topCard.type === 'legendary') {
            return true;
        }
    }

    return originalIsValidPlay(card);
}

// Modify renderPlayerHand to style legendaries differently
const originalRenderPlayerHand = renderPlayerHand;
renderPlayerHand = function() {
    playerHandEl.innerHTML = '';
    playerHand.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card';

        if (card.type === 'legendary') {
            cardEl.style.backgroundColor = '#000';
            cardEl.style.color = '#0f0';
            cardEl.style.border = '2px solid #0f0';
            cardEl.style.fontSize = '12px';
            cardEl.innerHTML = `<div class="glitch-text">${card.name}</div>`;
        } else {
            cardEl.style.color = getSuitColor(card.suit);
            cardEl.innerHTML = `<div>${card.value}</div><div style="font-size:12px">${card.suit}</div>`;
        }

        cardEl.addEventListener('click', () => tryPlayCard(index));
        playerHandEl.appendChild(cardEl);
    });
}

// Modify renderGameState for discard pile rendering of legendaries
const originalRenderGameState = renderGameState;
renderGameState = function() {
    originalRenderGameState();

    if (discardPile.length > 0) {
        const topCard = discardPile[discardPile.length - 1];
        if (topCard.type === 'legendary') {
            discardPileEl.style.backgroundColor = '#000';
            discardPileEl.style.color = '#0f0';
            discardPileEl.style.border = '2px solid #0f0';
            discardPileEl.style.fontSize = '12px';
            discardPileEl.innerHTML = `<div class="glitch-text">${topCard.name}</div>`;
        }
    }
}

// Intercept tryPlayCard to handle legendary effects
const originalTryPlayCard = tryPlayCard;
tryPlayCard = function(index) {
    if (!isPlayerTurn) return;

    const card = playerHand[index];
    if (card.type === 'legendary') {
        playerHand.splice(index, 1);
        discardPile.push(card);
        logMessage(`You played legendary card: ${card.name}`);
        renderGameState();

        handleLegendaryEffect(card);
        // Turn progression is handled inside the effect handler if needed
    } else {
        originalTryPlayCard(index);
    }
}

// AI also needs to handle playing legendaries
const originalAiTurn = aiTurn;
aiTurn = function() {
    if (isPlayerTurn) return;

    let played = false;
    for (let i = 0; i < aiHand.length; i++) {
        if (isValidPlay(aiHand[i])) {
            const card = aiHand.splice(i, 1)[0];
            discardPile.push(card);
            logMessage(`Opponent played ${card.name || (card.value + ' of ' + card.suit)}`);
            played = true;

            if (card.type === 'legendary') {
                logMessage(`Opponent triggered ${card.name}! Chaos increases.`);
                chaosLevel += 5; // AI playing legendary causes pure chaos
            }
            break;
        }
    }

    if (!played) {
        logMessage("Opponent drew a card.");
        drawCard(aiHand, 1);
    }

    renderGameState();
    checkWinCondition();
    isPlayerTurn = true;
}

// Modifiable game variables
window.game_vars = {
    ai_hand_size: () => aiHand.length,
    deck_size: () => deck.length,
    chaos_multiplier: () => chaosLevel,
    player_turn_active: () => isPlayerTurn
};
window.set_game_var = {
    ai_hand_size: (val) => {
        val = parseInt(val);
        if(isNaN(val)) return;
        if(val > aiHand.length) drawCard(aiHand, val - aiHand.length);
        else if(val < aiHand.length) aiHand.splice(0, aiHand.length - val);
    },
    deck_size: (val) => {
        val = parseInt(val);
        if(isNaN(val)) return;
        if(val > deck.length) {
            for(let i=0; i<val-deck.length; i++) deck.push({suit:'Hearts', value:'2', type:'standard'});
        } else if(val < deck.length) deck.splice(0, deck.length - val);
    },
    chaos_multiplier: (val) => { chaosLevel = parseInt(val) || 0; },
    player_turn_active: (val) => { isPlayerTurn = Boolean(val); }
};

const modal = document.getElementById('code-editor-modal');
const targetVarNameEl = document.getElementById('target-var-name');
const targetVarValueEl = document.getElementById('target-var-value');
const newVarValueEl = document.getElementById('new-var-value');
const submitBtn = document.getElementById('submit-override');

let currentOverrideTarget = null;

function handleLegendaryEffect(card) {
    if (card.name === 'SYSTEM_OVERRIDE') {
        const keys = Object.keys(window.game_vars);
        currentOverrideTarget = keys[Math.floor(Math.random() * keys.length)];

        targetVarNameEl.textContent = currentOverrideTarget;
        targetVarValueEl.textContent = window.game_vars[currentOverrideTarget]();
        newVarValueEl.value = '';

        modal.classList.remove('hidden');
    } else if (card.name === 'NULL_POINTER') {
        logMessage("NULL_POINTER Exception! AI loses a random card.");
        if(aiHand.length > 0) {
            aiHand.splice(Math.floor(Math.random() * aiHand.length), 1);
        }
        finishLegendaryTurn();
    } else if (card.name === 'STACK_OVERFLOW') {
        logMessage("STACK_OVERFLOW! Everyone draws 3 cards.");
        drawCard(playerHand, 3);
        drawCard(aiHand, 3);
        finishLegendaryTurn();
    }
}

submitBtn.addEventListener('click', () => {
    const val = newVarValueEl.value;
    window.set_game_var[currentOverrideTarget](val);
    logMessage(`OVERRIDE ACCEPTED: ${currentOverrideTarget} set to ${val}`);
    modal.classList.add('hidden');
    renderGameState();
    finishLegendaryTurn();
});

function finishLegendaryTurn() {
    renderGameState();
    checkWinCondition();
    isPlayerTurn = false;
    setTimeout(aiTurn, 1000);
}

// Need to call createDeck again to apply the override, but only after original setup finishes.
// We'll just reset the game to ensure the new createDeck is used.
setTimeout(() => {
    resetGame();
}, 100);
