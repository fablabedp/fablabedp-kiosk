'use strict';

let video = null;
let thumbnail = null;
let take_photo = null;
let countdown_label = null;
let photo_countdown = 1;
let project_id = null;

window.onload = (event) => {

  video = document.getElementById('video');
  thumbnail = document.getElementById('thumbnail');
  take_photo = document.getElementById('take-photo');
  countdown_label = document.getElementById('countdown');
  project_id = document.getElementById('project_id');

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

          const time = new Date(Date.now());
          const timestamp =
            time.getFullYear() + '-' +
            String(time.getMonth()).padStart(2,'0') + '-' +
            String(time.getDate()).padStart(2,'0') + '_' +
            String(time.getHours()).padStart(2,'0') + '-' +
            String(time.getMinutes()).padStart(2,'0') + '-' +
            String(time.getSeconds()).padStart(2,'0');

          thumbnail.src = 'loading.gif';
          thumbnail.parentElement.href =
            '../photo/?project_id=' + project_id.value +
            '&file=' + timestamp + '.jpg';

          imageCapture.takePhoto()
            .then(blob => {
              const photo_data = URL.createObjectURL(blob);
              thumbnail.src = photo_data;

              const req = new XMLHttpRequest();
              req.open("POST",
                'photo/capture' +
                '?project_id=' + project_id.value +
                '&timestamp=' + timestamp
                , true);
              req.onload = (event) => {
                // Uploaded
              };
              req.send(blob);
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