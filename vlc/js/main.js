// Main JavaScript file for VLC Clone

// DOM elements
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stop');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');
const fullscreenBtn = document.getElementById('fullscreen');
const playlistItems = document.getElementById('playlistItems');

// Playlist
let playlist = [];
let currentTrack = 0;

// Play/Pause function
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.innerHTML = '<img src="icons/pause.svg" alt="Pause">';
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<img src="icons/play.svg" alt="Play">';
    }
}

// Stop function
function stopVideo() {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    playPauseBtn.innerHTML = '<img src="icons/play.svg" alt="Play">';
}

// Update seek bar
function updateSeekBar() {
    seekBar.value = (videoPlayer.currentTime / videoPlayer.duration) * 100;
}

// Seek video
function seekVideo() {
    videoPlayer.currentTime = (seekBar.value / 100) * videoPlayer.duration;
}

// Update volume
function updateVolume() {
    videoPlayer.volume = volumeBar.value / 100;
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen();
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
        } else if (videoPlayer.msRequestFullscreen) {
            videoPlayer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Load and play next track
function playNext() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadAndPlayTrack(currentTrack);
}

// Load and play previous track
function playPrevious() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack(currentTrack);
}

// Load and play a specific track
function loadAndPlayTrack(index) {
    videoPlayer.src = playlist[index];
    videoPlayer.play();
    updatePlaylistUI();
}

// Update playlist UI
function updatePlaylistUI() {
    playlistItems.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = `Track ${index + 1}`;
        li.onclick = () => loadAndPlayTrack(index);
        if (index === currentTrack) {
            li.classList.add('active');
        }
        playlistItems.appendChild(li);
    });
}

// Event listeners
playPauseBtn.addEventListener('click', togglePlayPause);
stopBtn.addEventListener('click', stopVideo);
seekBar.addEventListener('input', seekVideo);
volumeBar.addEventListener('input', updateVolume);
fullscreenBtn.addEventListener('click', toggleFullscreen);
videoPlayer.addEventListener('timeupdate', updateSeekBar);
videoPlayer.addEventListener('ended', playNext);

// Initialize volume
updateVolume();

// Example playlist (replace with your actual playlist)
playlist = [
    'videos/sample1.mp4',
    'videos/sample2.mp4',
    'videos/sample3.mp4'
];

// Initial playlist UI update
updatePlaylistUI();

// Load the first track
loadAndPlayTrack(currentTrack);
