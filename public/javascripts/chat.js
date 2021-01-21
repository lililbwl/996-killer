var socket;
let speakh = "北京第三 996 提醒您，道路千万条，生命第一条，健康不注意，亲人两行泪";
$(function () {
    drinkwater();
    socket = io();
    var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;
    if (isChrome) {
    } else {
        document.write("<h1>请使用chrome浏览器！</h1>");
    }
    // Initialize variables
    var $window = $(window);
    var clientWidth = document.documentElement.clientWidth;
    if (clientWidth < 1000) {
        document.write("<h1>请在电脑端使用！</h1>");
    }
    var $usernameInput = $('.loginin'); // Input for username
    var $messages = $('.messages'); // Messages area
    var $inputMessage = $('.inputMessage'); // Input message input box
    var $loginPage = $('#login'); // The login page
    var name = localStorage.getItem('996username');
    if (name) {
        $loginPage.fadeOut();
        document.getElementById('msge').innerText = "当前用户：" + name;
    } else {

    }
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        if ($('#m').val() === "") {
            alert("消息不能为空!");
            return;
        }
        let name = localStorage.getItem("996username");
        socket.emit('chat message', name + ": " + $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<p>').text(msg));
    });
    socket.on('block mine', function (msg) {
        alert(msg.data);
    });
    socket.on('login', (data) => {
        connected = true;
        // Display the welcome message
        var message = "Welcome to BWCoin~ Chat – ";
        alert(message + data.currentName);
    });
    socket.on('user joined', (data) => {
        alert("欢迎 " + data.username + '加入!');
    });
    var setUsername = function () {
        username = $usernameInput.val().trim();
        localStorage.setItem('996username', username);
        document.getElementById('msge').innerText = "消息列表！(" + username + ')';
        $loginPage.fadeOut();
        if (username) {
            socket.emit('add user', username);
        }
    }

    $window.keydown(function (event) {
        var name = localStorage.getItem('996username');
        if (event.which === 13) {
            if (name) {
                // console.log("当前名字为" + localStorage.getItem('username'));
                // localStorage.setItem('username',name);
                document.getElementById('msge').innerText = "消息列表！(" + name + ')';
            } else {
                setUsername();
            }
        }
    });
});



function drinkwater() {
    setTimeout(() => {
        doTTS(speakh);
        document.getElementById('notice').innerText = "补充点H2O"
    }, 60*60*1000);
}



function doTTS(value) {
    var ttsDiv = document.getElementById('bdtts_div_id');
    var ttsAudio = document.getElementById('tts_autio_id');


    // 这样就可实现播放内容的替换了
    ttsDiv.removeChild(ttsAudio);
    var au1 = '<audio id="tts_autio_id" autoplay="autoplay">';
    var sss = '<source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5&text=' + value + '" type="audio/mpeg">';
    var eee = '<embed id="tts_embed_id" height="0" width="0" src="">';
    var au2 = '</audio>';
    ttsDiv.innerHTML = au1 + sss + eee + au2;

    ttsAudio = document.getElementById('tts_autio_id');

    ttsAudio.play();
}