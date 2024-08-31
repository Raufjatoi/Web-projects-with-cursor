// Player module for VLC Clone

// Get DOM elements
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPause');
const stopBtn = document.getElementById('stop');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');
const fullscreenBtn = document.getElementById('fullscreen');
const playlistItems = document.getElementById('playlistItems');

let currentTrack = 0;
let playlist = [];

// Play/Pause toggle
function togglePlayPause() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.textContent = 'Pause';
    } else {
        videoPlayer.pause();
        playPauseBtn.textContent = 'Play';
    }
}

// Stop video
function stopVideo() {
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    playPauseBtn.textContent = 'Play';
}

// Seek video
function seekVideo() {
    const time = videoPlayer.duration * (seekBar.value / 100);
    videoPlayer.currentTime = time;
}

// Update seek bar
function updateSeekBar() {
    const value = (100 / videoPlayer.duration) * videoPlayer.currentTime;
    seekBar.value = value;
}

// Update volume
function updateVolume() {
    videoPlayer.volume = volumeBar.value;
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

// Play next track
function playNext() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadAndPlayTrack(currentTrack);
}

// Play previous track
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
