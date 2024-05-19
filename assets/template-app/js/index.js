const $ = require('jquery')
const mm = require('music-metadata');
let songData = {path: [], title:[]}
let audioPlayer = $('audio').get(0)
let playing = false
let currentIndex = 0
let timer = null

function chooseMusic() {
    console.log('choose music')
    $('input').click()
}

function musicSelected() {
    let files = $('input').get(0).files
    for(let i = 0; i < files.length; i++) {
        let {path} = files[i]
        mm.parseFile(path, {native:true}).then((result) => {

            songData.path[i] = path
            songData.title[i] = result.common.title

            let songsRow = 
            `<tr ondblclick="playSong(${i})">
                <td>${result.common.title}</td>
                <td>${result.common.artist}</td>
                <td>${secondsToTime(result.format.duration)}</td>
            </tr>`

            $('#table-body').append(songsRow)

        }).catch((err) => {
            console.log(result)
        
        });
    }
}

function secondsToTime(t) {
    return padZero(parseInt((t / (60)) % 60)) + ":" + padZero(parseInt(t % (60) ))
}

function padZero(v) {
    return (v < 10) ? "0" + v : v;
}

function playSong(i) {
    audioPlayer.src = songData.path[i]
    currentIndex = i
    audioPlayer.load()
    audioPlayer.play()
    $('h4').text(songData.title[i])
    playing = true
    updatePlayButton()
    timer = setInterval(updateTime, 1000)
}

function play() {
    if(playing) {
        audioPlayer.pause()
        playing = false
        clearInterval(timer)
    }
    else {
        audioPlayer.play()
        playing = true
        timer = setInterval(updateTime, 1000)
    }
    updatePlayButton()
}

function updatePlayButton() {
    let playIcon = $('#play-button span')
    if(playing) {
        playIcon.removeClass('icon-play')
        playIcon.addClass('icon-pause')
    }
    else {
        playIcon.removeClass('icon-pause')
        playIcon.addClass('icon-play')
    }
}

function nextSong() {
    currentIndex++
    console.log(currentIndex, songData.path.length)
    if(currentIndex >= songData.path.length) {
        currentIndex = 0
    }
    playSong(currentIndex)
}

function previousSong() {
    currentIndex--
    console.log(currentIndex, songData.path.length)
    if(currentIndex < 0 ) {
        currentIndex = songData.path.length - 1
    }
    playSong(currentIndex)
}

function updateTime() {
    $('#time-left').text(secondsToTime(audioPlayer.currentTime))
    $('#total-time').text(secondsToTime(audioPlayer.duration))
    if(audioPlayer.currentTime >= audioPlayer.duration) {
        nextSong()
    }
}

function clearPlayList() {
    clearInterval(timer)
    $('#time-left').text('00:00')
    $('#total-time').text('00:00')
    $('#table-body').html('')
    $('#h4').text('')
    audioPlayer.pause()
    audioPlayer.src = ''
    currentIndex = 0
    playing = false
    songData = {path: [], title:[]}
    updatePlayButton()
}

function changeVolume(input) {
    audioPlayer.volume = input.value
}