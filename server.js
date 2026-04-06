const http = require("http");

const clientId = "ваш_клієнтid";
const clientSecret = "ваш_клієнтсекрет"; 

const playlistIds = [
    "37i9dQZF1DX4YFrS99u87t", // Top Hits Ukraine
    "37i9dQZF1DXcBWndj3ao6M", // Today's Top Hits
    "37i9dQZF1DX1clg9V9S9r6", // Поп-тепінь
    "37i9dQZF1DX4s9whpS9vYn", // Танцювальний рай
    "37i9dQZF1DXd90p19cvE66"  // Новинки щоп'ятниці
];

http.createServer(async (req, res) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
    };

    if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        return res.end();
    }

    if (req.url === "/api") {
        try {
            console.log("--- Запит отримано. Авторизація... ---");

            const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
                },
                body: "grant_type=client_credentials",
            });

            const tokenData = await tokenRes.json();
            const token = tokenData.access_token;

            if (!token) throw new Error("Не вдалося отримати токен");

            console.log("🔍 Завантажую обрані плейлисти...");
            
            const requests = playlistIds.map(id => 
                fetch(`https://api.spotify.com/v1/playlists/${id}`, {
                    headers: { "Authorization": "Bearer " + token }
                }).then(r => r.json())
            );

            const results = await Promise.all(requests);

            const cleanData = results
                .filter(p => p && !p.error && p.images && p.images.length > 0)
                .map(p => ({
                    id: p.id,
                    name: p.name,
                    image: p.images[0].url,
                    owner: p.owner ? p.owner.display_name : 'Spotify',
                    link: p.external_urls.spotify
                }));

            console.log(`✅ Успішно відправлено плейлистів: ${cleanData.length}`);
            res.writeHead(200, headers);
            res.end(JSON.stringify(cleanData));

        } catch (e) {
            console.error("🔥 Помилка сервера:", e.message);
            if (!res.headersSent) {
                res.writeHead(500, headers);
                res.end(JSON.stringify({ error: e.message }));
            }
        }
    }
}).listen(3000, () => {
    console.log("🚀 СЕРВЕР ЗАПУЩЕНО: http://localhost:3000/api");
});