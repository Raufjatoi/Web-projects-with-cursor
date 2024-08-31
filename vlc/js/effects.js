// Effects module for VLC Clone

// Initialize effect values
let brightness = 100;
let contrast = 100;
let saturation = 100;
let hue = 0;
let sepia = 0;
let grayscale = 0;
let invert = 0;
let blur = 0;

// Function to apply effects to video
function applyEffects() {
    const video = document.getElementById('videoPlayer');
    video.style.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        hue-rotate(${hue}deg)
        sepia(${sepia}%)
        grayscale(${grayscale}%)
        invert(${invert}%)
        blur(${blur}px)
    `;
}

// Event listeners for effect sliders
document.getElementById('brightnessSlider').addEventListener('input', (e) => {
    brightness = e.target.value;
    applyEffects();
});

document.getElementById('contrastSlider').addEventListener('input', (e) => {
    contrast = e.target.value;
    applyEffects();
});

document.getElementById('saturationSlider').addEventListener('input', (e) => {
    saturation = e.target.value;
    applyEffects();
});

document.getElementById('hueSlider').addEventListener('input', (e) => {
    hue = e.target.value;
    applyEffects();
});

document.getElementById('sepiaSlider').addEventListener('input', (e) => {
    sepia = e.target.value;
    applyEffects();
});

document.getElementById('grayscaleSlider').addEventListener('input', (e) => {
    grayscale = e.target.value;
    applyEffects();
});

document.getElementById('invertSlider').addEventListener('input', (e) => {
    invert = e.target.value;
    applyEffects();
});

document.getElementById('blurSlider').addEventListener('input', (e) => {
    blur = e.target.value;
    applyEffects();
});

// Function to reset all effects
function resetEffects() {
    brightness = 100;
    contrast = 100;
    saturation = 100;
    hue = 0;
    sepia = 0;
    grayscale = 0;
    invert = 0;
    blur = 0;

    // Reset all sliders
    document.getElementById('brightnessSlider').value = 100;
    document.getElementById('contrastSlider').value = 100;
    document.getElementById('saturationSlider').value = 100;
    document.getElementById('hueSlider').value = 0;
    document.getElementById('sepiaSlider').value = 0;
    document.getElementById('grayscaleSlider').value = 0;
    document.getElementById('invertSlider').value = 0;
    document.getElementById('blurSlider').value = 0;

    applyEffects();
}

// Event listener for reset button
document.getElementById('resetEffects').addEventListener('click', resetEffects);

// Initial application of effects
applyEffects();
