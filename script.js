const songs = [
    {
        title: "Gehra Hua",
        artist: "Irshad Kamil, Shashwat Sachdev, Arijit Singh, Armaan Khan",
        src: "./music/Gehra-Hua.mp3",
        cover: "./images/gehra-hua.png" 
    },
    {
        title: "Tera Ban Jaunga",
        artist: "Dj Yogi, Tulsi Kumar, Akhil Sachdeva",
        src: "./music/Tera-Ban-Jaunga.mp3",
        cover: "./images/tera-ban-jaunga.png"
    },
    {
        title: "Besharam Rang",
        artist: "Shilpa Rao, Caralisa Monteiro",
        src: "./music/Besharam-Rang.mp3",
        cover: "./images/Besharam-Rang.png"
    }
];

// DOM Elements
const audio = document.getElementById('audio-element');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const title = document.getElementById('song-title');
const artist = document.getElementById('song-artist');
const coverImage = document.getElementById('cover-image'); 
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');
const volumeBar = document.getElementById('volume-bar');
const playlistEl = document.getElementById('playlist');

let songIndex = 0;
let isPlaying = false;

// Initialize Player
function initPlayer() {
    renderPlaylist();
    loadSong(songs[songIndex]);
}

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === songIndex) li.classList.add('active');
        
        li.innerHTML = `
            <div class="song-details">
                <strong>${song.title}</strong>
                <span>${song.artist}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        
        playlistEl.appendChild(li);
    });
}

// Load Song details to DOM
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    audio.src = song.src;
    coverImage.src = song.cover; // Updates the album artwork
    updatePlaylistHighlight();
}

// Update Active Song in Playlist
function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play Song
function playSong() {
    isPlaying = true;
    playBtn.innerText = '⏸️'; // Change icon to pause
    audio.play();
}

// Pause Song
function pauseSong() {
    isPlaying = false;
    playBtn.innerText = '▶️'; // Change icon to play
    audio.pause();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1; // Loop to end
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0; // Loop to beginning
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Update Progress Bar & Time
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Update progress bar width
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
    }

    // Format Time strings
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    currentTimeEl.innerText = formatTime(currentTime);
    if (duration) {
        durationEl.innerText = formatTime(duration);
    }
}

// Set Progress (when user clicks on progress bar)
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    
    audio.currentTime = (clickX / width) * duration;
}

// Set Volume
function setVolume(e) {
    audio.volume = e.target.value;
}

// Event Listeners
playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong); // Auto-play next song when current ends

progressBar.addEventListener('input', (e) => {
    const duration = audio.duration;
    audio.currentTime = (e.target.value / 100) * duration;
});

volumeBar.addEventListener('input', setVolume);

// Run initialization
initPlayer();