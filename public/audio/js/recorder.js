let recordBt = null
let stopBt = null
let playBt = null
let proceedBt = null
let recorder = null
let audio = null
let wavesurfer = null
let timer = null
const MIN_ELAPSED_TIME = 10

// Init & load audio file
document.addEventListener('DOMContentLoaded', () => {
  recordBt = document.querySelector('#record')
  stopBt = document.querySelector('#stop')
  playBt = document.querySelector('[data-action="play"]')
  proceedBt = document.querySelector('#proceed')
  
  wavesurfer = WaveSurfer.create({
    container: document.querySelector('#waveform'),
    barWidth: 2,
    barHeight: 1, // the height of the wave
    barGap: null // the optional spacing between bars of the wave, if not provided will be calculated in legacy format
  });
 
  // Play button
  playBt.addEventListener('click', () => play())
  timer = new Timer()
})

const status = Object.defineProperties({}, {
  "started":{
      set:(val) => {
          console.log("started:"+val)
          this.value = val
          checkStarted(val)
      }
  },
});

const checkStarted = (started) => {
  if (started) {
    recordBt.disabled = true
    stopBt.disabled = false
  } else {
    recordBt.disabled = false
    stopBt.disabled = true
  }
}

const recordAudio = () =>
  new Promise(async resolve => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const audioChunks = []

    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data)
    });

    const start = () => mediaRecorder.start()

    const stop = () =>
      new Promise(resolve => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks)
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          wavesurfer.load(audioUrl)
          const play = () => audio.play()
          resolve({ audioBlob, audioUrl, play })
        });
        mediaRecorder.stop()
      });

    resolve({ start, stop })
  });

const record = async () => {
  wavesurfer.empty()
  recorder = await recordAudio()
  recorder.start()
  timer.start()

  status.started = true
  recordBt.disabled = true
  stopBt.disabled = false
}

const play = async () => {
  if (audio) {
    wavesurfer
      .playPause()
  }
}

const stop = async () => {
  audio = await recorder.stop();
  let elapsed = timer.stop()
  console.log('timer', elapsed)
  if (elapsed >= MIN_ELAPSED_TIME) {
    proceedBt.disabled = false
  }
  playBt.disabled = false
  recordBt.disabled = false;
  stopBt.disabled = true
}

const proceed = () => {
  alert('not implemented yet')
}

class Timer {

  start() {
    document.querySelector('#proceed').disabled = true
    this.count = 0    
    this.timeInterval = setInterval(() => {
      if (!this.count) {
        this.count = 1
      }
      document.querySelector('#timer').innerHTML = ` - (${this.count}s)`
      this.count++
    }, 1000);
  }

  stop() {
    clearInterval(this.timeInterval)
    return this.count
  }

  elapsed() {
    return this.count
  }
}