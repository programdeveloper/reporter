var path;
var reportName;
var pictureSource; 
var destinationType; 
var mediaType;
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

        // if(localStorage.getItem("mnetwork") === null){
        //     localStorage.setItem('mnetwork','false');
        // }

        // if(localStorage.getItem("mnetwork") == 'true'){
        //     $(".mnetwork").attr('checked',true);
        // }

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        mediaType = navigator.camera.MediaType;

        getPosts();
    },
    backKeyDown: function(){
        navigator.app.exitApp();
    }
};
    
setInterval(getPosts,10000);

// $('.mnetwork').click(function(){
//     if(!(localStorage.getItem("mnetwork") == 'false' )){
//         localStorage.setItem("mnetwork",'false');
//         $(".mnetwork").attr('checked',false);
//     }
//     else{
//         localStorage.setItem("mnetwork",'true');
//         $(".mnetwork").attr('checked',true);
//     }

//     console.log(localStorage.getItem("mnetwork"));
// });

$('.record').click(function(){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            reportName = mediaFiles[i].name;
            size = mediaFiles[i].size;
            size = (size/1024/1024).toFixed(2);
            
            $("#size").html("აპლიკაციის საშუალებით შესაძლებალია აიტვირთოს მაქსიმუმ 1 GB მოცულობის ვიდეო. თვენი ვიდოეს მოულობაა " + size + " MB");
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

    // if((localStorage.getItem("mnetwork") == 'false'  && navigator.connection.type == 'wifi') || (localStorage.getItem("mnetwork") == 'true'  && navigator.connection.type != 'wifi') ){
       
    $('#loadingImg').css('display','block');
    var ft = new FileTransfer(),
    name = reportName;
    if(fullname && title && phone && email){
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
                    console.log('success adding query');
                }
            });     
            
            $('#loadingImg').css('display','none');
            $.mobile.changePage('#sendsuccess',{reverse:false,transition: "slide"});
            // var succText = "<center> <br> რეპორტაჟი გაგზავნილია! <br><br> მისი პუბლიკაციის ან არა პუბლიკაციის შემთხვევაში თქვენ მიიღებთ შეტყობინებას. <br><br> Stunettv.Ge-ს გუნდი</center>";
            // $('#succText').html(succText);
            setInterval(function(){
                document.location = "index.html";
            },10000);
        },
        function(error) {
            if(error.code==3){
                navigator.notification.alert(
                    'გთხოვთ ჩართოთ ინტერნეტი და სცადოთ თავიდან.',  // message
                    null,         // callback
                    'შეცდომა!!!',            // title
                    'დახურვა'                  // buttonName
                );
            }
            $('#loadingImg').css('display','none');
            $.mobile.changePage('#senderror',{reverse:false,transition: "slide"});
            setInterval(function(){
                document.location = "index.html";
            },10000);
             // alert('Error uploading file ' + path + ': with Error ' + error.code);
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
    
    // }
    // else{
    //     navigator.notification.alert(
    //         'მობილური ინტერნეტით ატვირთვა შეზღუდულია. გთხოვთ ჩართოთ WiFi.',  // message
    //         null,         // callback
    //         'შეცდომა!!!',            // title
    //         'დახურვა'                  // buttonName
    //     ); 
    // }
}

function SaveInfo(){
    // console.log('clicked');
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
        destinationType: destinationType.FILE_URI,
        mediaType: mediaType.VIDEO,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    function onPhotoURISuccess(imageURI) {
        path = imageURI;
        console.log(imageURI);
        window.resolveLocalFileSystemURL(imageURI, function(fileEntry) {
            fileEntry.file(function(fileObj) {
                size = (fileObj.size/1024/1024).toFixed(2);
                $("#size").html("აპლიკაციის საშუალებით შესაძლებალია აიტვირთოს მაქსიმუმ 1 GB მოცულობის ვიდეო. თვენი ვიდოეს მოულობაა " + size + " MB");
            });
        });
        // console.log(imageURI);
        reportName =  Math.floor((Math.random() * 100000) + 1) + ".mp4";
        // window.resolveLocalFileSystemURL(imageURI, function(entry){
            // }, function(e){
                // alert(e);/
            // }); 

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
            // $(document).on('click','.post-action-dot-box',function(){    
            //     $(this).parent().next('.post-caption').fadeToggle("slow", function() {
            //         $(this).removeClass("hide");
            //     });
            // });

            // $(document).on('click','.closecaption',function(){
            //     $(this).parent().fadeOut("slow", function() {
            //         $(this).addClass("hide");
            //     });
            // });
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
            console.log('error occurred while deleting');
        }
    });
    $('#delete'+test).popup("close");
}

$("#homeLogo , .ui-icon-home").click(function(){
    app.initialize();
    getPosts();
});