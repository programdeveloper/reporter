var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        if(!(localStorage.getItem("fullname") === null )){
            $("#fullname").val(localStorage.getItem("fullname"));
        }
        if(!(localStorage.getItem("phone") === null )){
            $("#phone").val(localStorage.getItem("phone"));
        }
        if(!(localStorage.getItem("email") === null)){
            $("#email").val(localStorage.getItem("email"));                   
        }

        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#fffk");
        }
        
    }
};
var path;
$('.record').click(function(){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            
            $("#playVideo").attr('src',path);
            if(!(localStorage.getItem("fullname") === null )){
                $('#reporter').val(localStorage.getItem("fullname"));
            }
            if(!(localStorage.getItem("phone") === null )){
                $('#reportPhone').val(localStorage.getItem("phone"));
            }
            if(!(localStorage.getItem("email") === null)){
               $('#reportEmail').val(localStorage.getItem("email"));                   
            }

            $.mobile.changePage('#sendReport',{reverse:false,transition: "slide"});
        }
    };

    var options = { limit: 1, quality: 1 };
    navigator.device.capture.captureVideo(captureSuccess, null, options);

});

function sendReport(){
    var fullname = $("#reporter").val();
    var phone  = $("#reportPhone").val();
    var email  = $("#reportEmail").val();
    var desc  = $('#reportdesc').val();
    var title = $('#reportTitle').val();

    localStorage.setItem("fullname",fullname);
    localStorage.setItem("phone",phone);
    localStorage.setItem("email",email);

    // window.PKVideoThumbnail.createThumbnail ( path, cordova.file.dataDirectory, null, null );
    console.log(window.PKVideoThumbnail);
    var ft = new FileTransfer(),
    name = 'test';
    console.log(path);
    ft.upload(path,
        "http://stunet.ge/admin/reporter/uploadfile",
        function(result) {
            console.log('Upload success: ' + result.responseCode);
            console.log(result.bytesSent + ' bytes sent');
            console.log(result.response);
        },
        function(error) {
            console.log('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name, mimeType: 'video/mp4',chunkedMode: true });



}

function SaveInfo(){
    var fullname = $("#fullname").val();
    var phone  = $("#phone").val();
    var email  = $("#email").val();

    localStorage.setItem("fullname",fullname);
    localStorage.setItem("phone",phone);
    localStorage.setItem("email",email);
    

    navigator.notification.alert(
        'თქვენი მონაცემები წარმატებით შეინახა',  // message
        null,         // callback
        'შეტყობინება',            // title
        'დახურვა'                  // buttonName
    );
}