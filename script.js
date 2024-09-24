let audio = new Audio();
let currentSongIndex = 0;
let songs = [];

async function getSongs() {
    let response = await fetch("http://127.0.0.1:3000/songs");
    let textResponse = await response.text();

    let div = document.createElement("div");
    div.innerHTML = textResponse;
    let as = div.getElementsByTagName("a");
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

function playSong(index) {
    if (index < 0 || index >= songs.length) return;
    audio.src = songs[index];
    audio.play();
    currentSongIndex = index;
    updateInfoBar();
    updateSeekBar();
    playPauseIcon.innerHTML = `<img src="icons/pause.svg" alt="Pause">`;
    let playBar = document.getElementsByClassName("playbar")[0]
    playBar.style.backgroundColor = "#123319";
    audio.onended = () => {
        playSong(currentSongIndex + 1);  // Automatically play the next song
    };

    const albumArt = document.getElementById("albumart");

    audio.onpause = () => {
        albumArt.classList.remove("album-art"); // Remove the rotation class when paused
    };

    audio.onplay= () => {
        albumArt.classList.add("album-art");
    }

    audio.onended = () => {
        albumArt.classList.remove("album-art"); // Remove the rotation class when song ends
    };
}


function updateInfoBar() {
    const infoBar = document.querySelector('.infobar');
    const songName = songs[currentSongIndex].split("songs/")[1].split("-")[1].replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("0", "");
    const artistName = songs[currentSongIndex].split("songs/")[1].split("-")[0].replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("0", "").replace(/\d+/g, "").replace(".", "");
    infoBar.innerHTML = `<div>${songName}</div>
                        <div>${artistName}</div>`;
}

function updateSeekBar() {
    const seekbar = document.getElementById("seekbar");
    seekbar.value = 0;
    seekbar.max = Math.floor(audio.duration);
    const timer = document.querySelector('.timer');

    audio.onloadedmetadata = function () {
        seekbar.max = Math.floor(audio.duration); // Set the max value of the seekbar to the audio's total duration
    };

    audio.ontimeupdate = function () {
        seekbar.value = Math.floor(audio.currentTime);
        timer.textContent = `${formatTime(audio.currentTime)}/${formatTime(audio.duration)}`;
    };

    seekbar.oninput = function () {
        audio.currentTime = seekbar.value;
    };
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}


async function main() {
    songs = await getSongs();
    console.log(songs);

    const songList = document.getElementsByClassName("playlist")[0];
    songs.forEach((song, index) => {
        songList.insertAdjacentHTML("beforeend", `<div class="song" data-index="${index}">
            <div class="name">
                <div class="songinfo">${song.split("songs/")[1].split("-")[1].replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("0", "")}</div>
                <div class="artist">${song.split("songs/")[1].split("-")[0].replaceAll("%20", " ").replaceAll(".mp3", "").replaceAll("0", "").replace(/\d+/g, "").replace(".", "")}</div>
            </div>
            <div class="playico"><img src="icons/play.svg" alt=""></div>
        </div>`);
    });

    // Attach click event to each song
    const songElements = document.querySelectorAll('.song');
    songElements.forEach(songElement => {
        songElement.addEventListener('click', () => {
            const index = parseInt(songElement.dataset.index);
            playSong(index);
            playPauseIcon.innerHTML = `<img src="icons/pause.svg" alt="Play">`;
        });
    });
}

let playPauseIcon = document.getElementById("playPause");

// Play/pause control
document.querySelector('.controls .play').addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseIcon.innerHTML = `<img src="icons/pause.svg" alt="Pause">`; // Use correct template literal syntax
    } else {
        audio.pause();
        playPauseIcon.innerHTML = `<img src="icons/play.svg" alt="Play">`; // Use correct template literal syntax
    }
});



document.querySelector('.controls .previous').addEventListener('click', () => {
    playSong(currentSongIndex - 1)
});

document.querySelector('.controls .next').addEventListener('click', () => {
    playSong(currentSongIndex + 1)
});

const volumeControl = document.getElementById("volume");

// Set initial volume
audio.volume = volumeControl.value;

// Add event listener for volume change
volumeControl.addEventListener('input', () => {
    audio.volume = volumeControl.value; // Set audio volume
});

main();

let menu = document.getElementById("menu")
menu.addEventListener('click', () => {
    let library = document.getElementsByClassName("library")[0]
    if (library.style.left === "0px") {
        library.style.left = "-200%"; // Close menu if open
    } else {
        library.style.left = "0"; // Open menu if closed
    }
    event.stopPropagation();
});

let library = document.getElementsByClassName("library")[0]
let body= document.getElementsByTagName("body")[0]
body.addEventListener('click', () => {
    if (library.style.left === "0px") {
        library.style.left = "-200%"; // Close menu if open
    } 
});

let cross = document.getElementById("cross")
cross.addEventListener('click', () => {
    let library = document.getElementsByClassName("library")[0]
    library.style.left = "-200%"
});


let fullplayerico =document.getElementsByClassName("fullplayerico")[0]
let fpi =document.getElementById("fpi")
fullplayerico.addEventListener('click', () => {
    let albumdetails = document.getElementsByClassName("albumdetails")[0]
    if (albumdetails.style.display === "none") {
        albumdetails.style.display = "flex";
        albumdetails.style.bottom = "14vh";
        fpi.style.transform="rotate(90deg)"
    } else {
        albumdetails.style.display = "none";
        fpi.style.transform="rotate(-90deg)" // Open menu if closed
    }
});






