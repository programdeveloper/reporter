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

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        mediaType = navigator.camera.MediaType;
    }
};

var path;
var reportName;
var db;

$('.record').click(function(){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            reportName = mediaFiles[i].name;
            
            // $('video').append('<source id="playVideo" src="'+path+'" type="video/mp4, codecs='+'avc1.4D401E, mp4a.40.2'+'">');
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

    var ft = new FileTransfer(),
    name = reportName;

    ft.upload(
    path,
    "http://stunet.ge/admin/reporter/uploadfile",
    function(result) {

        $.ajax({
            url: "http://stunet.ge/admin/reporter/addReport",
            type: "POST",
            dataType: "json",
            data: ({
                device: device.uuid,
                name:  $("#reporter").val(),
                title: $("#reportTitle").val(),
                phone: $("#reportPhone").val(),
                email: $("#reportEmail").val(),
                description: $("#reportdesc").val(),
                fileUrl : reportName
            }),
            success: function(data) {
                console.log('success adding query');
            }
        });     

        var succText = "<center> <br> რეპორტაჟი გაგზავნილია! <br><br> მისი პუბლიკაციის ან არა პუბლიკაციის შემთხვევაში თქვენ მიიღებთ შეტყობინებას. <br><br> Stunet.Ge-ს გუნდი</center>";
        $('#succText').html(succText);
        setInterval(function(){
            document.location = "index.html";
        },5000);
    },
    function(error) {
        alert('Error uploading file ' + path + ': with Error ' + error.code);
    },
    { fileName: name, mimeType: 'video/mp4', chunkedMode: true });

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

function showGallery(){

    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        destinationType: destinationType.DATA_URL,
        mediaType: mediaType.VIDEO,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    function onPhotoURISuccess(imageURI) {
        path = imageURI;
        window.resolveLocalFileSystemURL(imageURI, function(entry){

            reportName =  Math.floor((Math.random() * 100000) + 1) + ".mp4";

            }, function(e){

            }); 
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

    function onFail(message) {
         alert('Failed because: ' + message);
    }
}

$(".post-action-dot-box").click(function(){    
    $(this).parent().next('.post-caption').fadeToggle("slow", function() {
        $(this).removeClass("hide");
    });
});

$('.closecaption').click(function(){
    $(this).parent().fadeOut("slow", function() {
        $(this).addClass("hide");
    });
});