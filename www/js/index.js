var path;
var reportName;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
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
        localStorage.setItem("mobiledata",'off');
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        mediaType = navigator.camera.MediaType;

        getPosts();
    }
};
    
setInterval(getPosts,120000);



$('.record').click(function(){
    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            reportName = mediaFiles[i].name;
            
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

    
    $('#loadingImg').css('display','block');
    var ft = new FileTransfer(),
    name = reportName;
    if(!(localStorage.getItem("mobiledata") == 'on' )){
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
                    fileUrl : reportName,
                    thumb : 'post.png'
                }),
                success: function(data) {
                    console.log('success adding query');
                }
            });     
        }
       

        // Number.prototype.padLeft = function(base,chr){
        //    var  len = (String(base || 10).length - String(this).length)+1;
        //    return len > 0 ? new Array(len).join(chr || '0')+this : this;
        // }
        // var d = new Date,
        // dformat = [ d.getFullYear().padLeft(),
        //     (d.getMonth()+1).padLeft(),
        //     d.getDate()].join('-')+
        //     ' ' +
        //   [ d.getHours().padLeft(),
        //     d.getMinutes().padLeft(),
        //     d.getSeconds().padLeft()].join(':');
        
        $('#loadingImg').css('display','none');
        var succText = "<center> <br> რეპორტაჟი გაგზავნილია! <br><br> მისი პუბლიკაციის ან არა პუბლიკაციის შემთხვევაში თქვენ მიიღებთ შეტყობინებას. <br><br> Stunet.Ge-ს გუნდი</center>";
        $('#succText').html(succText);
        setInterval(function(){
            document.location = "index.html";
        },5000);
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

function getPosts(){
    var html= "";
    $.ajax({
        url: "http://stunet.ge/admin/reporter/getReports",
        type: "POST",
        dataType: "json",
        data: ({
            device: device.uuid
        }),
        success: function(data) {
        if(data.length==0){
            html += "<center> თქვენ არ გაქვთ არცერთი გაგზავნილი რეპორტაჟი. პირველი რეპორტაჟის გადასაღებად დააჭირეთ ქვევით მოცემულ ღილაკს. </center>";
        }
        else{
            $.each(data, function(i, item) {
            html += 
            '<li class="post-items">'+
            '<img src="'+item.thumb+'" class="post-img" />'+
            '<p class="post-title ellipsis">'+
               item.title +
            '</p>'+
            '<div class="post-action-box">'+
              '<div class="post-action-dot-box clear">'+
               ' <span class="post-action-dot"></span><span class="post-action-dot"></span><span class="post-action-dot"></span>'+
             '</div>';
            if(item.status==0)
                html+= ' <div class="loading post-action">&nbsp;</div>';
            if(item.status==1)
                html+= ' <div class="check post-action">&nbsp;</div>';
            if(item.status==2)
                html+= ' <div class="deny post-action">&nbsp;</div>';
            html+= ' </div>'+
            '<p class="post-caption hide">';
            if(item.status==0)
                html+= 'რეპორტაჟი დამტკიცების მოლოდინშია.<br>გაგზავნის თარიღი :' + item.receive_date;
            if(item.status==1)
                html+= item.receive_date +"/"+ item.post_date+'<br> რეპორტაჟის ნახვა <a href="'+item.stunet_url+'">stunet.ge</a>-ზე';
            if(item.status==2)
                html+= 'რეპორტაჟი არ იყო დამტკიცებული ადმინისტრატორის მიერ. <br> მიზეზი: ' +item.reason;
         
            html+= '<a role="button" data-role="button" class="ui-link ui-btn-right ui-btn ui-icon-delete ui-btn-icon-notext closecaption" data-icon="delete" data-iconpos="notext" data-corners="false" data-shadow="false"></a>'+
            '</p>'+
            '</li>';

            });  
        }
        $('.posts').html(html);
            $(document).on('click','.post-action-dot-box',function(){    
                $(this).parent().next('.post-caption').fadeToggle("slow", function() {
                    $(this).removeClass("hide");
                });
            });

            $(document).on('click','.closecaption',function(){
                $(this).parent().fadeOut("slow", function() {
                    $(this).addClass("hide");
                });
            });
        },
        error: function(e,b,k) {
            var html = "გაგზავნილი რეპორტაჟების სანახავად გთხოვთ ჩართოთ ინტერნეტი.";
            $('.posts').html(html);
        }
    });     
};

$('#flipswitch').change(function(){
    localStorage.setItem("mobiledata",$('#flipswitch').val());
});