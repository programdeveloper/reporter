var path;
var reportName;
var db;
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

        // var request = window.indexedDB.open("Reporter", 3);
        // request.onerror = function(event) {
        //   alert('error created');
        // };
        // request.onsuccess = function(event) {
        //   db = event;
        // };
        getPosts();
    }
};

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
            $.each(data, function(i, item) {
                console.log(item.title);
              html += 
              '<li class="post-items">'+
            '<img src="post.png" class="post-img" />'+
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
                html+= item.receive_date +"/"+ item.post_date+' რეპორტაჟის ნახვა <a href="'+item.stunet_url+'">stunet.ge</a>-ზე';
            if(item.status==2)
                html+= 'რეპორტაჟი არ იყო დამტკიცებული ადმინისტრატორის მიერ. მიზეზი: ' +item.reason;
             
            html+= ' <a data-icon="delete" class="ui-btn-right closecaption" data-iconpos="notext" data-role="button" data-corners="false" data-shadow="false">Close</a>'+
            '</p>'+
          '</li>';

            });  
            $('.posts').html(html);
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
        }
    });     
}

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
       
        // db.transaction(insertDB, errorCB);

        Number.prototype.padLeft = function(base,chr){
           var  len = (String(base || 10).length - String(this).length)+1;
           return len > 0? new Array(len).join(chr || '0')+this : this;
        }
    

        function insertDB(tx) {
            var d = new Date,
                dformat = [ d.getFullYear().padLeft(),
                    (d.getMonth()+1).padLeft(),
                    d.getDate()].join('-')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
            var sql = 'INSERT INTO REPORTS (fullname,title, image, description,status,reason,stuLink,date,postdate) VALUES (?,?,?,?,?,?,?,?,?)';
            tx.executeSql(sql, ['fullname','title','post.png','desc','0','0','0','dformat','0'], sucessQueryDB, errorCB);

        }
     
        function sucessQueryDB(tx) {     
            tx.executeSql('SELECT * FROM REPORTS', [], renderList, errorCBg);
        }
     
        function renderList(tx,results) {
            var htmlstring = '';
            console.log(results);
             
            var len = results.rows.length;
             
            for (var i=0; i<len; i++){
                htmlstring += '<li>' + results.rows.item(i).title + '</li>';
                 
            }
             
            $('#resultList').html(htmlstring);
            $('#resultList').listview('refresh');
                  
        }

        
        

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

