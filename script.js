const rankIconImg = document.getElementById('rank-icon-img');
const rankName = document.getElementById('rank-name');
const progressBar = document.getElementById('progress-bar');
const percentageText = document.getElementById('percentage');

// Define ranks with sub-tiers
const ranks = [
    { name: "Unknown", icon: "unknown.png" },
    { name: "Bronze I", icon: "bronze-i.png" },
    { name: "Bronze II", icon: "bronze-ii.png" },
    { name: "Bronze III", icon: "bronze-iii.png" },
    { name: "Silver I", icon: "silver-i.png" },
    { name: "Silver II", icon: "silver-ii.png" },
    { name: "Silver III", icon: "silver-iii.png" },
    { name: "Gold I", icon: "gold-i.png" },
    { name: "Gold II", icon: "gold-ii.png" },
    { name: "Gold III", icon: "gold-iii.png" },
    { name: "Platinum I", icon: "platinum-i.png" },
    { name: "Platinum II", icon: "platinum-ii.png" },
    { name: "Platinum III", icon: "platinum-iii.png" },
    { name: "Diamond I", icon: "diamond-i.png" },
    { name: "Diamond II", icon: "diamond-ii.png" },
    { name: "Diamond III", icon: "diamond-iii.png" },
    { name: "Elite", icon: "elite.png" },
    { name: "Champion", icon: "champion.png" },
    { name: "Unreal", icon: "unreal.png" }
];

// Default values
let currentRankIndex = 0; // Start at "Unknown"
let currentPercentage = 0; // Starting percentage
let isAltPressed = false; // Track if Alt is pressed
let inputBuffer = ""; // Buffer to store typed input

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Expiry in days
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Function to update the progress (with cookies)
function updateProgress(percentage, rankIndex) {
    const progressWidth = Math.min((percentage / 100) * 100, 100); // Ensure it doesn't go above 100%
    progressBar.style.width = `${progressWidth}%`;
    percentageText.textContent = `${percentage}%`;
    rankIconImg.src = `icons/${ranks[rankIndex].icon}`; // Update rank icon with path
    rankName.textContent = ranks[rankIndex].name; // Update rank name

    // Save progress to cookies
    setCookie('currentRankIndex', rankIndex, 7); // Store rank index in cookie (7-day expiry)
    setCookie('currentPercentage', percentage, 7); // Store percentage in cookie (7-day expiry)
}

// Load saved progress from cookies
function loadProgressFromCookies() {
    const savedRankIndex = getCookie('currentRankIndex');
    const savedPercentage = getCookie('currentPercentage');

    if (savedRankIndex !== null && savedPercentage !== null) {
        currentRankIndex = parseInt(savedRankIndex);
        currentPercentage = parseInt(savedPercentage);
    }

    // Update the progress with the saved values
    updateProgress(currentPercentage, currentRankIndex);
}

// Handle key press to detect Alt and allow negative input
document.addEventListener('keydown', function(event) {
    if (event.key === 'Alt') {
        isAltPressed = true; // Alt key pressed
    }

    if (event.key === 'Enter') {
        const input = parseInt(inputBuffer); // Convert the input buffer to an integer
        if (!isNaN(input)) {
            // Add the input to the current percentage
            currentPercentage += input;

            // Rank up/down logic: check how many times the value exceeds 100 or goes below 0
            while (currentPercentage >= 100 && currentRankIndex < ranks.length - 1) {
                currentPercentage -= 100; // Reset percentage after ranking up
                currentRankIndex++; // Increase rank
            }

            while (currentPercentage < 0 && currentRankIndex > 0) {
                currentPercentage += 100; // Reset percentage after deranking
                currentRankIndex--; // Decrease rank
            }

            // Update the progress bar and other elements
            updateProgress(currentPercentage, currentRankIndex);
        }
        inputBuffer = ""; // Reset the input buffer after pressing Enter
    } else if (event.key >= '0' && event.key <= '9') {
        inputBuffer += event.key; // Append the typed number to the buffer
        percentageText.textContent = inputBuffer; // Display the current input
    } else if (event.key === 'Backspace') {
        inputBuffer = inputBuffer.slice(0, -1); // Remove the last character
        percentageText.textContent = inputBuffer; // Update the display
    } else if (event.key === '-' && inputBuffer.length === 0) {
        // Allow negative number input at the start of the string
        inputBuffer = "-"; // Start the input with a negative sign
        percentageText.textContent = inputBuffer; // Update the display
    }
});

// Handle Alt key release
document.addEventListener('keyup', function(event) {
    if (event.key === 'Alt') {
        isAltPressed = false; // Alt key released
    }
});

// Handle scrolling to change rank or adjust percentage
document.addEventListener('wheel', function(event) {
    if (isAltPressed) {
        // If Alt is held, scroll through ranks
        if (event.deltaY < 0 && currentRankIndex < ranks.length - 1) {
            currentRankIndex++; // Scroll up to next rank
        } else if (event.deltaY > 0 && currentRankIndex > 0) {
            currentRankIndex--; // Scroll down to previous rank
        }
    } else {
        // If Alt is not held, adjust rank percentage
        if (event.deltaY < 0) {
            currentPercentage += 5; // Increment percentage
        } else if (event.deltaY > 0) {
            currentPercentage -= 5; // Decrement percentage
        }

        // Handle overflow (reset percentage and move to next rank)
        if (currentPercentage >= 100) {
            currentPercentage = 0;
            if (currentRankIndex < ranks.length - 1) {
                currentRankIndex++; // Go to next rank
            }
        } else if (currentPercentage < 0) {
            currentPercentage = 100;
            if (currentRankIndex > 0) {
                currentRankIndex--; // Go to previous rank
            }
        }
    }

    // Update the progress bar and other elements
    updateProgress(currentPercentage, currentRankIndex);
});

// Initial setup: Load saved progress from cookies (if any)
loadProgressFromCookies();
