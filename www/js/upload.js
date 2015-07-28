function postVideo(accessToken, fileURI) {
  var metadata = {
    snippet: {
      title: "test",
      description: "test",
      tags: ["youtube-cors-upload"],
      categoryId: 21
    },
    status: {
      privacyStatus: "unlisted"
    }
  }

  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = 'test';
  options.mimeType = "video/mp4";
  options.chunkedMode = false;

  options.headers = {
    Authorization: "Bearer " + accessToken,
    "Access-Control-Allow-Origin": "http://meteor.local"
  };

  var params = new Object();
  params.part = Object.keys(metadata).join(',')

  options.params = params;
  console.log(options)
  var ft = new FileTransfer();
  ft.upload(fileURI, "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet", win, fail, options, true);

  ft.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
      // console.log(progressEvent)
      // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
    } else {
      console.log('something not loading')
        // loadingStatus.increment();
    }
    console.log(progressEvent.loaded / progressEvent.total);
  };
}

function win(r) {
  console.log(r)
  console.log("Code = " + r.responseCode);
  console.log("Response = " + r.response);
  console.log("Sent = " + r.bytesSent);
}

function fail(error) {
  console.log(error)
    // alert("An error has occurred: Code = " + error.code);
  console.log("upload error source " + error.source);
  console.log("upload error target " + error.target);
}