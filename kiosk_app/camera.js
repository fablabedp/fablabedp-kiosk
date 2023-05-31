import fs from 'fs';

const photo_file = process.env.DOWNLOADS_PATH + 'image.jpg';

function removePhoto() {
  fs.stat(photo_file, function (err, stats) {
    if (err) { return console.error(err); }
    fs.unlink(photo_file,function(err){
      if(err) return console.log(err);
    });
  });
}

export { removePhoto }