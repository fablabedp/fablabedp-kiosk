import fs from 'fs';

const temp_photo_file = process.env.DOWNLOADS_PATH + 'image.jpg';

function movePhoto() {

}

function removePhoto() {
  fs.stat(temp_photo_file, function (err, stats) {
    if (err) {
      //return console.error(err);
    } else {
      fs.unlink(temp_photo_file,function(err){
        if(err) return console.log(err);
      });
    }
  });

}

export { removePhoto }