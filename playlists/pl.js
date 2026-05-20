// создаем модуль
const playlistManager = (function () {
  // access token spotify
  let accessToken = "";

  // id пользователя spotify
  let userId = "";

  // устанавливаем токен
  function setAccessToken(token) {
    if (!token) {
      throw new Error("Токен не передан");
    }

    accessToken = token;
  }

  // проверяем токен
  function checkToken() {
    if (!accessToken) {
      throw new Error("Spotify access token отсутствует");
    }
  }

  // получаем профиль пользователя
  async function loadUserProfile() {
    checkToken();

    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка получения профиля");
    }

    // превращаем ответ в js объект
    const data = await response.json();

    // сохраняем id пользователя
    userId = data.id;

    return data;
  }

  // создаем плейлист
  async function createPlaylist(name, description = "") {
    checkToken();

    if (!name || name.trim() === "") {
      throw new Error("Название плейлиста не может быть пустым");
    }

    // если userId еще нет
    if (!userId) {
      await loadUserProfile();
    }

    const response = await fetch(
      "https://api.spotify.com/v1/users/" + userId + "/playlists",
      {
        method: "POST",

        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // название плейлиста
          name: name.trim(),

          // описание
          description: description,

          // публичный ли плейлист
          public: false,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Ошибка создания плейлиста");
    }

    return await response.json();
  }

  // ищем трек
  async function searchTrack(query) {
    checkToken();

    if (!query || query.trim() === "") {
      throw new Error("Введите название трека");
    }

    // кодируем строку для url
    const encodedQuery = encodeURIComponent(query);

    const response = await fetch(
      "https://api.spotify.com/v1/search?q=" +
        encodedQuery +
        "&type=track&limit=10",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Ошибка поиска трека");
    }

    const data = await response.json();

    return data.tracks.items;
  }

  // добавляем песни в плейлист
  async function addTracksToPlaylist(playlistId, trackUris) {
    checkToken();

    if (!playlistId) {
      throw new Error("playlistId отсутствует");
    }

    if (!Array.isArray(trackUris)) {
      throw new Error("trackUris должен быть массивом");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
      {
        method: "POST",

        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          // массив uri треков
          uris: trackUris,
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Ошибка добавления треков");
    }

    return await response.json();
  }

  // возвращаем все плейлисты
  async function getAllPlaylists() {
    checkToken();

    const response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка получения плейлистов");
    }

    return await response.json();
  }

  // ищем плейлист по id
  async function getPlaylistById(id) {
    checkToken();

    const response = await fetch("https://api.spotify.com/v1/playlists/" + id, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      throw new Error("Плейлист не найден");
    }

    return await response.json();
  }

  // возвращаем песни плейлиста
  async function getSongs(playlistId) {
    checkToken();

    const response = await fetch(
      "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Ошибка получения песен");
    }

    return await response.json();
  }

  // экспорт
  return {
    // авторизация
    setAccessToken,

    // профиль
    loadUserProfile,

    // плейлисты
    createPlaylist,
    getAllPlaylists,
    getPlaylistById,

    // песни
    getSongs,
    searchTrack,
    addTracksToPlaylist,
  };
})();

// ПАБЕДА
