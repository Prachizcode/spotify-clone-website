let currentAudio = null;
let currentPlayingIndex = null;

function searchSong() {
  const searchQuery = document.getElementById('searchInput').value.trim();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (!searchQuery) {
    resultsDiv.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  const url = `https://v1.nocodeapi.com/prachidhakad/spotify/IkdSKKRCcRGwVbze/search?q=${searchQuery}&type=track`;

  const requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(url, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(result => {
      if (result.tracks && result.tracks.items.length > 0) {
        result.tracks.items.forEach((track, index) => {
          const songDiv = document.createElement('div');
          songDiv.className = 'song';

          const albumImage = track.album.images[1]?.url || '';
          const trackName = track.name;
          const artists = track.artists.map(a => a.name).join(', ');
          const previewUrl = track.preview_url;

          songDiv.innerHTML = `
  <img src="${albumImage}" alt="Album Art">
  <div class="song-details">
    <div class="song-title">${trackName}</div>
    <div class="song-artist">By ${artists}</div>
  </div>
  ${
    previewUrl
      ? `
    <div class="controls" onclick="togglePlayPause(${index})" id="control-${index}">
      <i class="fas fa-play play-icon" id="icon-${index}"></i>
    </div>
    <audio id="audio-${index}" src="${previewUrl}"></audio>
    `
      : `<p><em>No preview available</em></p>`
  }
`;

resultsDiv.classList.remove("hidden");
          resultsDiv.appendChild(songDiv);
        });
      } else {
        resultsDiv.innerHTML = "<p>No tracks found.</p>";
      }
    })
    .catch(error => {
      console.log('Fetch error:', error);
      resultsDiv.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    });
    

}

function playAudio(index) {
  if (currentAudio && currentPlayingIndex !== index) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = document.getElementById(`audio-${index}`);
  currentAudio = audio;
  currentPlayingIndex = index;

  audio.play();
}

function pauseAudio(index) {
  const audio = document.getElementById(`audio-${index}`);
  audio.pause();
}
function togglePlayPause(index) {
  const audio = document.getElementById(`audio-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (currentAudio && currentPlayingIndex !== index) {
    currentAudio.pause();
    document.getElementById(`icon-${currentPlayingIndex}`).classList.remove('fa-pause');
    document.getElementById(`icon-${currentPlayingIndex}`).classList.add('fa-play');
  }

  if (audio.paused) {
    audio.play();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    currentAudio = audio;
    currentPlayingIndex = index;
  } else {
    audio.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
}
document.addEventListener("click", function (e) {
  const resultsDiv = document.getElementById("results");
  const searchInput = document.getElementById("searchInput");
  const searchSection = document.getElementById("searchSection");

  // If results are visible, and click is outside results or search section
  if (!resultsDiv.classList.contains("hidden") &&
      !resultsDiv.contains(e.target) &&
      !searchSection.contains(e.target)) {
    resultsDiv.classList.add("hidden"); // Hide results
  }
});


function loadArtistSongs(artistName, containerId) {
  const url = `https://v1.nocodeapi.com/prachidhakad/spotify/IkdSKKRCcRGwVbze/search?q=${encodeURIComponent(artistName)}&type=track`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById(containerId);
      container.innerHTML = `<h3>${artistName}</h3>`;

      const tracks = data.tracks.items.slice(0, 5); // Limit to 5 songs
      tracks.forEach((track, index) => {
        const previewUrl = track.preview_url;
        const albumImage = track.album.images[1]?.url || '';
        const trackName = track.name;
        const artists = track.artists.map(a => a.name).join(', ');

        const uniqueIndex = `${containerId}-${index}`;

        const songHTML = `
          <div class="song">
            <img src="${albumImage}" alt="Album Art">
            <div class="song-details">
              <div class="song-title">${trackName}</div>
              <div class="song-artist">By ${artists}</div>
            </div>
            ${
              previewUrl
                ? `
                <div class="controls" onclick="togglePlayPause('${uniqueIndex}')" id="control-${uniqueIndex}">
                  <i class="fas fa-play play-icon" id="icon-${uniqueIndex}"></i>
                </div>
                <audio id="audio-${uniqueIndex}" src="${previewUrl}"></audio>
              `
                : `<p><em>No preview available</em></p>`
            }
          </div>
        `;

        container.innerHTML += songHTML;
      });
    })
    .catch(err => {
      console.error(`Error fetching songs for ${artistName}:`, err);
    });
}


function togglePlayPause(index) {
  const audio = document.getElementById(`audio-${index}`);
  const icon = document.getElementById(`icon-${index}`);

  if (currentAudio && currentPlayingIndex !== index) {
    currentAudio.pause();
    document.getElementById(`icon-${currentPlayingIndex}`)?.classList.remove('fa-pause');
    document.getElementById(`icon-${currentPlayingIndex}`)?.classList.add('fa-play');
  }

  if (audio.paused) {
    audio.play();
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    currentAudio = audio;
    currentPlayingIndex = index;
  } else {
    audio.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-play');
  }
}

function goBackToMain() {
  const searchInput = document.getElementById('searchInput');
  const resultsDiv = document.getElementById('results');
  const mainPage = document.getElementById('mainPage');

  // Clear search input
  searchInput.value = '';

  // Hide search results
  resultsDiv.classList.add('hidden');
  resultsDiv.innerHTML = '';

  // Show main page
  if (mainPage) {
    mainPage.classList.remove('hidden');
  }

  // Pause any playing audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentPlayingIndex = null;
  }

  // Optionally hide the forward icon again
  const forwardIcon = document.getElementById('forwardIcon');
  if (forwardIcon) {
    forwardIcon.classList.add('hide');
  }
}
const forwardIcon = document.getElementById('forwardIcon');
if (forwardIcon) {
  forwardIcon.classList.remove('hide');
}


