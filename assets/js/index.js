
const MEASSAGE_USER = "message_user";
const MEASSAGE_CHATBOT = "message_chatbot";
const LOCAL_HOST = "http://localhost:3000/"
const URL = "http://localhost:3000/?question=";
const URL_AUDIO = "http://localhost:3000/audio?answer=";


var num_messages = 0;
const audio = "";

function append_Message(input,clss){
    $(".MessageInput").val("")
    if(input.length > 0){
        $(".conversation").append('<li class="'+ clss +'"><p>'+input+'</p></li>')
    }
    num_messages = $("li").length;
    $(".conversation").animate({scrollTop:(num_messages+1)*300},'50');
}

$("#send").on("click",(e)=>{
    e.stopPropagation();
    var input = $(".MessageInput").val();
    append_Message(input,MEASSAGE_USER);
    GetAnswer(input);

})
$(".MessageInput").on("keypress",(e)=>{
    if(e.which===13){
        e.stopPropagation();
        var input = $(".MessageInput").val();
        append_Message(input,MEASSAGE_USER);
        GetAnswer(input);
    }

})



//Getting the answer


function GetAnswer(Question){
    var settings = {
        "async": true,
        "url": URL + Question,
        "method": "GET",
    }
    
    $.ajax(settings).done(function (response) {
        getAudio(response);
    });
};

function getAudio(answer){
    var settings = {
        "async": true,
        "url": URL_AUDIO + answer,
        "method": "GET",
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        append_Message(answer,"message_chatbot");
        // var snd = new Audio("data:audio/wav;base64," + response);
        // snd.play();
        new Audio("./backend"+response).play();
        window.setTimeout(()=>{Delete();},10000);
        
    });
}
function Delete(){
    var settings = {
        "async": true,
        "url": "http://localhost:3000/",
        "method": "delete",
    }
    $.ajax(settings).done(function (response) {console.log(response)
   
    });
}
getAudio("Hello");


