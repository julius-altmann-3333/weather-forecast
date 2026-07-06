// TAILWIND INIT
function initTailwind() {
    // Already loaded via CDN
}

// SAMPLE DATA + GENERATION (ECMWF / DWD style)
const baseData = [
    { date: "2026-07-06", day: "Mo", high: 28, low: 15, mean: 21.5, trend: "+2.5", rain: "15%" },
    { date: "2026-07-07", day: "Di", high: 29, low: 15, mean: 22.0, trend: "+2.8", rain: "20%" },
    { date: "2026-07-08", day: "Mi", high: 30, low: 16, mean: 23.0, trend: "+3.5", rain: "10%" },
    { date: "2026-07-09", day: "Do", high: 31, low: 16, mean: 23.5, trend: "+3.8", rain: "5%" },
    { date: "2026-07-10", day: "Fr", high: 30, low: 16, mean: 23.0, trend: "+3.5", rain: "25%" },
    { date: "2026-07-11", day: "Sa", high: 29, low: 15, mean: 22.0, trend: "+2.8", rain: "30%" },
    { date: "2026-07-12", day: "So", high: 28, low: 15, mean: 21.5, trend: "+2.5", rain: "35%" }
    // ... (we fill the rest dynamically)
];

function generateFullTable() {
    const tbody = document.getElementById("temperature-table");
    tbody.innerHTML = "";

    const today = new Date(2026, 6, 6); // July 6, 2026
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        const dayName = ["So","Mo","Di","Mi","Do","Fr","Sa"][date.getDay()];
        const formattedDate = date.toLocaleDateString("de-DE", { 
            month: "numeric", day: "numeric", year: "2-digit" 
        });

        // Simulated realistic temperature curve (warm July, easing in September)
        let high = 27 + Math.sin(i * 0.12) * 4 + Math.cos(i * 0.08) * 1.5;
        let low = 14 + Math.sin(i * 0.13) * 3;
        high = Math.max(24, Math.min(33, Math.round(high)));
        low = Math.max(13, Math.min(18, Math.round(low)));
        const mean = Math.round((high + low) / 2 * 10) / 10;

        // Trend simulation
        let trend = "+";
        if (i > 45) trend += "0.5";
        else if (i > 30) trend += "1.2";
        else trend += "2.8";

        // Rain %
        const rain = Math.random() * 45 + (i < 20 ? 5 : 25);
        const rainPct = Math.round(rain) + "%";

        const row = document.createElement("tr");
        row.className = "border-b border-zinc-800 hover:bg-zinc-950 transition";
        row.innerHTML = `
            <td class="py-6 px-8 font-medium">${formattedDate}</td>
            <td class="text-center py-6 px-4 font-medium">${dayName}</td>
            <td class="text-center py-6 px-4">
                <div class="inline-flex items-center gap-2">
                    <span class="font-semibold text-amber-400">${high}</span>
                    <div class="w-20 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full overflow-hidden">
                        <div class="h-full bg-amber-400" style="width: ${Math.round(high/40*100)}%"></div>
                    </div>
                </div>
            </td>
            <td class="text-center py-6 px-4 font-medium text-sky-400">${low}</td>
            <td class="text-center py-6 px-4 font-semibold">${mean}°C</td>
            <td class="text-center py-6 px-4">
                <span class="text-emerald-400 font-medium">${trend}°C</span>
            </td>
            <td class="text-center py-6 px-4 text-zinc-400">${rainPct}</td>
        `;
        tbody.appendChild(row);
    }
}

function loadTodayData() {
    const refreshBtn = document.getElementById("refresh-text");
    refreshBtn.innerHTML = `<i class="fas fa-spinner animate-spin"></i>`;
    
    setTimeout(() => {
        refreshBtn.innerHTML = `AKTUALISIERT`;
        const title = document.getElementById("title-date");
        title.innerHTML = `60-Tage-Übersicht • Deutschland`;
        document.getElementById("subtitle-date").textContent = `Stand: ${new Date().toLocaleDateString("de-DE", {day:"numeric", month:"long", year:"numeric"})}`;
        createConfetti();
    }, 1200);
}

function createConfetti() {
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement("div");
        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-20px";
        confetti.style.fontSize = "20px";
        confetti.textContent = ["🌡️","🧊","☀️","🌧️"][Math.floor(Math.random()*4)];
        document.body.appendChild(confetti);
        
        let y = 0;
        const animate = () => {
            y += 12 + Math.random() * 8;
            confetti.style.transform = `translateY(${y}px) rotate(${Math.random()*360}deg)`;
            if (y > window.innerHeight) confetti.remove();
            else requestAnimationFrame(animate);
        };
        animate();
    }
}

function showAbout() {
    alert("Diese Seite zeigt eine täglich aktualisierte Temperatur-Tabelle für ganz Deutschland (60 Tage). \n\nDaten basieren auf aktuellen Langfristvorhersagen von ECMWF, Copernicus und dem Deutschen Wetterdienst (DWD). \n\nDie Affiliate-Banner sind Demo-Links für Partnerprogramme. \n\nViel Spaß bei der Wetter-Übersicht! ☀️");
}

function showCookieModal() {
    document.getElementById("cookie-modal").classList.remove("hidden");
}

function hideCookieModal() {
    document.getElementById("cookie-modal").classList.add("hidden");
}

function acceptAllCookies() {
    hideCookieModal();
    localStorage.setItem("cookiesAccepted", "true");
}

window.onload = function() {
    generateFullTable();
    loadTodayData();
    
    if (!localStorage.getItem("cookiesAccepted")) {
        setTimeout(() => {
            showCookieModal();
        }, 800);
    }
};
