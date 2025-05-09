
async function generateQuote() {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "qwen3:0.6b",
            "prompt": "Please give me 1 quote that inspire me today for coding, please only give me the quote /no_thinking",
            "stream": false
        })
    });
    const data = await response.json();
    const quote = data.response;
    console.log(quote);

    document.getElementById("quote").innerHTML = quote;
}


async function generateIdea() {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "qwen3:0.6b",
            "prompt": "Please give me 1 website project that I can practice for today, please only give me the name of it. Only response in one short sentence. /no_thinking",
            "stream": false
        })
    });
    const data = await response.json();
    const idea = data.response;
    console.log(idea);
    
    document.getElementById("idea").innerHTML = idea;
}

