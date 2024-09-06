const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    var day = new Date();
    var hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    content.textContent = "Error occurred in recognition: " + event.error;
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } 
    // News feature
    else if (message.includes('news')) {
        fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_API_KEY`) // Replace YOUR_API_KEY
        .then(response => response.json())
        .then(data => {
            const headlines = data.articles.slice(0, 3).map(article => article.title).join(". ");
            speak(`Here are the top headlines: ${headlines}`);
        }).catch(() => speak("Sorry, I couldn't fetch the news at the moment."));
    } 
    // Joke feature
    else if (message.includes('tell me a joke')) {
        fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            speak(`${data.setup} ... ${data.punchline}`);
        }).catch(() => speak("Sorry, I couldn't find a joke right now."));
    } 
    // Math calculation feature
    else if (message.includes('calculate')) {
        try {
            const expression = message.replace('calculate', '').trim();
            const result = eval(expression); // Be cautious with eval for security reasons
            speak(`The result is ${result}`);
        } catch {
            speak('Sorry, I could not calculate that.');
        }
    }
    // Wikipedia search
    else if (message.includes('wikipedia')) {
        const query = message.replace("wikipedia", "").trim();
        window.open(`https://en.wikipedia.org/wiki/${query}`, "_blank");
        speak(`This is what I found on Wikipedia regarding ${query}`);
    } 
    // Time feature
    else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" });
        speak(`The time is ${time}`);
    } 
    // Date feature
    else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" });
        speak(`Today's date is ${date}`);
    } 
    // Calculator feature
    else if (message.includes('calculator')) {
        // Note: Opening a calculator may not be supported by all browsers/platforms
        const finalText = "Opening Calculator";
        speak(finalText);
        // Code to open calculator can be specific to the platform/environment
    } 
    // General Google search
    else {
        const query = message.replace(" ", "+");
        window.open(`https://www.google.com/search?q=${query}`, "_blank");
        speak(`I found some information for ${message} on Google`);
    }
}
