var path;
var reportName;
var pictureSource; 
var destinationType; 
var mediaType;
var ft;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.backKeyDown, true);
    },
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


        getPosts();
    },

    backKeyDown: function(){
        navigator.app.exitApp();
    }
};


$('.record').click(function(){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            reportName = mediaFiles[i].name;
            size = mediaFiles[i].size;
            size = (size/1024/1024).toFixed(2);
            
            $("#size").html("აპლიკაციის საშუალებით შესაძლებალია აიტვირთოს მაქსიმუმ 1 GB მოცულობის ვიდეო. თვენი ვიდოეს მოცულობაა " + size + " MB");
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

    
   
    
    ft = new FileTransfer(),
    name = reportName;


    if(fullname && title && phone && email){
        $.mobile.changePage('#sendProgress',{reverse:false,transition:"slide"});
        $(".progressTitle").text(title);
        ft.onprogress = function(progressEvent) {
            if (progressEvent.lengthComputable) {
                $('.progress').val((progressEvent.loaded / progressEvent.total)*100);
                $('.progressval').text(Math.floor((progressEvent.loaded / progressEvent.total)*100) + "%");
                
            } else {
                console.log('else statement');
            }
        };

        ft.upload(
        path,
        "http://stunettv.ge/admin/reporter/uploadfile",
        function(result) {
            $.ajax({
                url: "http://stunettv.ge/admin/reporter/addReport",
                type: "GET",
                dataType: "json",
                data: ({
                    device: device.uuid,
                    name:  $("#reporter").val(),
                    title: $("#reportTitle").val(),
                    phone: $("#reportPhone").val(),
                    email: $("#reportEmail").val(),
                    description: $("#reportdesc").val(),
                    fileUrl : reportName,
                    thumb : 'post.png'
                }),
                success: function(data) {
                    //console.log('success adding query');
                }
            });     
            
            $('#loadingImg').css('display','none');
            $.mobile.changePage('#sendsuccess',{reverse:false,transition: "slide"});
            
            setInterval(function(){
                document.location = "index.html";
            },10000);
        },
        function(error) {
            ft.abort(win, null);
            // console.log(error.code);
            if(error.code==3){
                navigator.notification.alert(
                    'გთხოვთ ჩართოთ ინტერნეტი და სცადოთ თავიდან.',  // message
                    null,         // callback
                    'შეცდომა!!!',            // title
                    'დახურვა'                  // buttonName
                );
            }
            if(error.code== 4){
                $.mobile.changePage('#sendReport',{reverse:false,transition: "slide"});
                return;
            }
            $('#loadingImg').css('display','none');

            $.mobile.changePage('#senderror',{reverse:false,transition: "slide"});

            setInterval(function(){
                document.location = "index.html";
            },10000);
            
        },
        { fileName: name, mimeType: 'video/mp4', chunkedMode: true });
    }
    else{
        navigator.notification.alert(
            'ყველა ველის შევსება სავალდებულოა!',  // message
            null,         // callback
            'შეცდომა!!!',            // title
            'დახურვა'                  // buttonName
        );
        $('#loadingImg').css('display','none');
        
    }
    
}
function cancelUpload(){
    ft.abort(null, null);
}

function win(){
  $.mobile.back();
}
function fail(){
    alert("something");
}
function SaveInfo(){
    
    var fullname = $("#fullname").val();
    var phone  = $("#phone").val();
    var email  = $("#email").val();

    localStorage.setItem("fullname",fullname);
    localStorage.setItem("phone",phone);
    localStorage.setItem("email",email);

    navigator.notification.alert(
        'თქვენი მონაცემები წარმატებით შეინახა', // message
        null,                                   // callback
        'შეტყობინება',                          // title
        'დახურვა'                               // buttonName
    );
}

function showGallery(){

    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        destinationType: navigator.camera.DestinationType.FILE_URI,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY, 
        mediaType: mediaType.VIDEO
    });

    function onPhotoURISuccess(imageURI) {
        path = imageURI;
    
        window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
            fileEntry.file(function(fileObj) {
                size = (fileObj.size/1024/1024).toFixed(2);
                $("#size").html("აპლიკაციის საშუალებით შესაძლებალია აიტვირთოს მაქსიმუმ 1 GB მოცულობის ვიდეო. თვენი ვიდოეს მოცულობაა " + size + " MB");
            });
        });
        
        reportName =  Math.floor((Math.random() * 100000) + 1) + ".mp4";
        

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
         console.log('Failed because: ' + message);
         ft.abort(win, null);
    }
}

function getPosts(){
    var html= "";
    $.ajax({
        url: "http://stunettv.ge/admin/reporter/getReports",
        type: "GET",
        dataType: "json",
        data: ({
            device: device.uuid
        }),
        beforeSend: function() {
            var loadingvar = '<center><img id="loadingImg" src="loading.gif"></center>';
             $('.posts').html(loadingvar);
        },
        success: function(data) {
        if(data.length==0){
            html += "<center><p style='margin-top:10px;'> თქვენ არ გაქვთ არცერთი გაგზავნილი რეპორტაჟი. პირველი რეპორტაჟის გადასაღებად დააჭირეთ ქვევით მოცემულ ღილაკს. </p></center>";
        }
        else{
            $.each(data, function(i, item) {
                // console.log(item);
                html+= '<div class="video">'+
    '<div class="video-image"><img src="'+item.thumb+'" alt=""></div>'+
    '<a href="#info'+item.id+'" data-rel="popup">'+
    '<div class="video-title">'+item.title + "<br>" +item.description+' </div>'+
    '</a>'+
    '<div data-role="popup" id="info'+item.id+'" class="ui-content">'+
    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'+
    '<div class="custom-time">გაგზავნის თარიღი:</div>'+
    '<p>'+item.receive_date+'</p>'+
    '<p>'+item.reason+'</p>'+
    '</div>'+
    '<div class="video-params">'+
    '<a href="#delete'+item.id+'" data-rel="popup" class="ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext custom-no"></a>'+
    '<div data-role="popup" id="delete'+item.id+'" class="ui-content">'+
    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'+
    '<p>ნამდვილად გსურთ რეპორტაჟის წაშლა?</p>'+
    '<a onclick="deleteM('+item.id+')" class="ui-btn ui-icon-check ui-btn-icon-left custom-save">დიახ</a>'+
    '</div>';
    if(item.status==0)
        html+='<a href="#myPopup'+item.id+'" data-rel="popup" class="ui-btn ui-corner-all ui-icon-clock ui-btn-icon-notext custom-bullet"></a>'+
    '<div data-role="popup" id="myPopup'+item.id+'" class="ui-content">'+
    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'+
    '<p>'+'რეპორტაჟი დამტკიცების მოლოდინშია.<br>გაგზავნის თარიღი :' + item.receive_date + '</p>'+
    '</div>';
    if(item.status==1)
        html+='<a href="#myPopup'+item.id+'" data-rel="popup" class="ui-btn ui-corner-all ui-icon-check ui-btn-icon-notext custom-check"></a>'+
    '<div data-role="popup" id="myPopup'+item.id+'" class="ui-content">'+
    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'+
    '<p>'+item.receive_date + "/" + item.post_date + '<br> რეპორტაჟის ნახვა <a href="'+item.stunet_url+'">stunettv.ge</a>-ზე' + '</p>'+
    '</div>';
    if(item.status==2)
         html+='<a href="#myPopup'+item.id+'" data-rel="popup" class="ui-btn ui-corner-all ui-icon-forbidden ui-btn-icon-notext custom-locked"></a>'+
    '<div data-role="popup" id="myPopup'+item.id+'" class="ui-content">'+
    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a>'+
    '<p>ვიდეო დაიბლოკა ადმინისტრატორის მიერ. <br> მიზეზი: ' +item.reason + '</p>'+
    '</div>';
   
    
    html+= '</div>'+
    '</div>';           

            });  
        }
         $('.posts').html(html).enhanceWithin();
        },
        error: function(e,b,k) {
            var html = "<center><p style='margin-top:10px;'>გაგზავნილი რეპორტაჟების სანახავად გთხოვთ ჩართოთ ინტერნეტი.</p></center>";
            $('.posts').html(html);
        }
    });     
};


function deleteM( test){   
    $.ajax({
        url: "http://stunettv.ge/admin/reporter/deleteM",
        type: "GET",
        dataType: "json",
        data: ({
            id: test
        }),
        success: function(data) {
            getPosts();
        },
        error: function(d,b,a){
            //console.log('error occurred while deleting');
        }
    });
    $('#delete'+test).popup("close");
}

$("#homeLogo , .ui-icon-home, .homehref").click(function(){
    $("#nav-panel").panel('close');
    getPosts();
});