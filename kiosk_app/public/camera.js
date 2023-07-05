'use strict';

let socket = io();
let capture = null;
let review = null;
let video = null;
let photo = null;
let thumbnail = null;
let take_photo = null;
let countdown_label = null;
let photo_countdown = 5;

window.onload = (event) => {

  capture = document.getElementById('capture');
  review = document.getElementById('review');
  video = document.getElementById('video');
  photo = document.getElementById('photo');
  thumbnail = document.getElementById('thumbnail');
  take_photo = document.getElementById('take-photo');
  countdown_label = document.getElementById('countdown');

};


// adapted from https://developer.chrome.com/blog/imagecapture/
navigator.mediaDevices.getUserMedia({video: true})
  .then((mediaStream) => {
    const mediaStreamTrack = mediaStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    video.srcObject = mediaStream;
    video.play();
    take_photo.addEventListener(
      'click',
      (ev) => {
        countdown(photo_countdown).then(() => {
          countdown_label.textContent = '';
          socket.emit('take_photo');
          thumbnail.src = 'loading.gif';
          imageCapture.takePhoto()
            .then(blob => {
              const photo_data = URL.createObjectURL(blob);
              thumbnail.src = photo_data;
              download(photo_data, 'image.jpg');
            })
            .catch(error => console.error('takePhoto() error:', error));
        });
        ev.preventDefault();
      },
      false
    );
  })
  .catch(error => console.error('getUserMedia() error:', error));


function delay(t) {
  return new Promise(resolve => setTimeout(resolve, t));
}

async function countdown(n) {
  while(n > 0) {
    countdown_label.textContent = n;
    await delay(1000);
    n--;
  }
}


// from https://attacomsian.com/blog/javascript-download-file
const download = (path, filename) => {
  const anchor = document.createElement('a');
  anchor.href = path;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};