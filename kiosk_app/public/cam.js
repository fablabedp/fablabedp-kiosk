'use strict';

let socket = io();
let capture = null;
let review = null;
let video = null;
let photo = null;
let thumbnail = null;
let take_photo = null;
let send_photo = null;
let rotate_camera = null;
let to_review = null;
let to_review_btn = null;
let to_camera = null;
let email_form = null;
let email_sent_msg = null;
let countdown_label = null;

let photo_countdown = 5;

let camera_is_rotated = true;

window.onload = (event) => {

  capture = document.getElementById('capture');
  review = document.getElementById('review');
  video = document.getElementById('video');
  photo = document.getElementById('photo');
  thumbnail = document.getElementById('thumbnail');
  take_photo = document.getElementById('take-photo');
  send_photo = document.getElementById('send-photo');
  rotate_camera = document.getElementById('rotate-camera');
  to_review = document.getElementById('to-review');
  to_review_btn = document.getElementById('to-review-btn');
  to_camera = document.getElementById('to-camera');
  email_form = document.getElementById('email-form');
  email_sent_msg = document.getElementById('email-sent-msg');
  countdown_label = document.getElementById('countdown');

  rotateCamera(camera_is_rotated);

  to_review.addEventListener(
    'click',
    (ev) => {
      review_photo();
      ev.preventDefault();
    },
    false
  );
  to_review_btn.addEventListener(
    'click',
    (ev) => {
      review_photo();
      ev.preventDefault();
    },
    false
  );
  to_camera.addEventListener(
    'click',
    (ev) => {
      capture.hidden = false;
      review.hidden = true;
      ev.preventDefault();
    },
    false
  );

  rotate_camera.addEventListener(
    'click',
    (ev) => {
      camera_is_rotated = !camera_is_rotated;
      rotateCamera(camera_is_rotated);
      ev.preventDefault();
    },
    false
  );

  send_photo.addEventListener(
    'click',
    (ev) => {
      //socket.emit('send_email', document.getElementById('email').value, photo.src);
      email_form.style.display = 'none';
      email_sent_msg.style.display = 'block';
      ev.preventDefault();
    },
    false
  );
};


function review_photo() {
  capture.hidden = true;
  review.hidden = false;
  email_form.style.display = 'block';
  email_sent_msg.style.display = 'none';
  document.getElementById('email').value = '';
}


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
          photo.src = 'loading.gif';
          thumbnail.src = 'loading.gif';
          imageCapture.takePhoto()
            .then(blob => {
              const photo_data = URL.createObjectURL(blob);
              photo.src = photo_data;
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


function rotateCamera(rotate) {
  if(rotate) {
    video.style.transform = 'rotate(180deg)';
    photo.style.transform = 'rotate(180deg)';
    thumbnail.style.transform = 'rotate(180deg)';
  } else {
    video.style.transform = 'rotate(0deg)';
    photo.style.transform = 'rotate(0deg)';
    thumbnail.style.transform = 'rotate(0deg)';
  }
}