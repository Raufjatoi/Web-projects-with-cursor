// Playlist management for VLC Clone

let playlist = [];
let currentTrack = 0;

// Function to add a track to the playlist
function addToPlaylist(track) {
    playlist.push(track);
    updatePlaylistUI();
}

// Function to remove a track from the playlist
function removeFromPlaylist(index) {
    playlist.splice(index, 1);
    if (index < currentTrack) {
        currentTrack--;
    } else if (index === currentTrack && currentTrack === playlist.length) {
        currentTrack = 0;
    }
    updatePlaylistUI();
}

// Function to clear the entire playlist
function clearPlaylist() {
    playlist = [];
    currentTrack = 0;
    updatePlaylistUI();
}

// Function to shuffle the playlist
function shufflePlaylist() {
    for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
    }
    currentTrack = 0;
    updatePlaylistUI();
}

// Function to update the playlist UI
function updatePlaylistUI() {
    const playlistElement = document.getElementById('playlistItems');
    playlistElement.innerHTML = '';
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.textContent = track.name || `Track ${index + 1}`;
        li.onclick = () => loadAndPlayTrack(index);
        if (index === currentTrack) {
            li.classList.add('active');
        }
        playlistElement.appendChild(li);
    });
}

// Function to load and play a track
function loadAndPlayTrack(index) {
    if (index >= 0 && index < playlist.length) {
        currentTrack = index;
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.src = playlist[currentTrack].src;
        videoPlayer.play();
        updatePlaylistUI();
    }
}

// Function to play the next track
function playNext() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadAndPlayTrack(currentTrack);
}

// Function to play the previous track
function playPrevious() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadAndPlayTrack(currentTrack);
}

// Event listeners
document.getElementById('nextBtn').addEventListener('click', playNext);
document.getElementById('prevBtn').addEventListener('click', playPrevious);
document.getElementById('shuffleBtn').addEventListener('click', shufflePlaylist);
document.getElementById('clearPlaylistBtn').addEventListener('click', clearPlaylist);

// Initialize playlist UI
updatePlaylistUI();
