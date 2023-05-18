
let capture = null;
let review = null;
let photo = null;
let thumbnail = null;
let take_photo = null;
let rotate_camera = null;
let to_review = null;
let to_camera = null;

let camera_is_rotated = true;

window.onload = (event) => {

  capture = document.getElementById('capture');
  review = document.getElementById('review');
  video = document.getElementById('video');
  photo = document.getElementById('photo');
  thumbnail = document.getElementById('thumbnail');
  take_photo = document.getElementById("take-photo");
  rotate_camera = document.getElementById("rotate-camera");
  to_review = document.getElementById("to-review");
  to_camera = document.getElementById("to-camera");

  rotateCamera(camera_is_rotated);

  to_review.addEventListener(
    "click",
    (ev) => {
      capture.hidden = true;
      review.hidden = false;
      ev.preventDefault();
    },
    false
  );

  to_camera.addEventListener(
    "click",
    (ev) => {
      capture.hidden = false;
      review.hidden = true;
      ev.preventDefault();
    },
    false
  );

  rotate_camera.addEventListener(
    "click",
    (ev) => {
      camera_is_rotated = !camera_is_rotated;
      rotateCamera(camera_is_rotated);
      ev.preventDefault();
    },
    false
  );
};


// adapted from https://developer.chrome.com/blog/imagecapture/
navigator.mediaDevices.getUserMedia({video: true})
  .then((mediaStream) => {
    const mediaStreamTrack = mediaStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(mediaStreamTrack);
    video.srcObject = mediaStream;
    video.play();
    take_photo.addEventListener(
      "click",
      (ev) => {
        imageCapture.takePhoto()
          .then(blob => {
          const photo_data = URL.createObjectURL(blob);
          photo.src = photo_data;
          thumbnail.src = photo_data;
          //download(photo_data, 'image.jpg');
          photo_data.onload = () => { URL.revokeObjectURL(this); }
           })
          .catch(error => console.error('takePhoto() error:', error));
        ev.preventDefault();
      },
      false
    );
  })
  .catch(error => console.error('getUserMedia() error:', error));


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