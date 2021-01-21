let startP = true;
let active = null;
function vedioStart() {
    let constraints = {
        // video属性设置
        video: {
            width: 300,
            height: 200
        },
        // audio属性设置
        audio: false
    }
    navigator.mediaDevices.getUserMedia(constraints)
        .then(mediaStream => {
            // 成功返回promise对象，接收一个mediaStream参数与video标签进行对接
            document.getElementById('video').srcObject = mediaStream
            document.getElementById('video').play()
        })
    setInterval(() => {
        let ctx = document.getElementById("canvas").getContext('2d')
        ctx.drawImage(document.getElementById("video"), 0, 0, 300, 200);
        detectImg();
    }, 150)
}

const color = "#0000ff";
const minConfidence = 0.2;
const lineWidth = 1;
// ######################################### 工具函数
// 坐标转换
function toTuple({ y, x }) {
    return [y, x];
}
// 将图片绘制到canvas
function renderImageToCanvas(image, size, canvas) {
    canvas.width = size[0];
    canvas.height = size[1];
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, size[0], size[1]);
}

// 画关键点
function drawKeypoints(keypoints, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
        const keypoint = keypoints[i];
        if (keypoint.score < minConfidence) {
            continue;
        }
        const { y, x } = keypoint.position;
        drawPoint(ctx, y * scale, x * scale, 3, color);
    }
}
// canvas画点
function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

// 关键点连线
function drawSkeleton(keypoints, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);
    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(
            toTuple(keypoints[0].position), toTuple(keypoints[1].position), color, scale, ctx);
    });
}
// canvas画线
function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function practiceIntercal(){
    active = setInterval(() => {
        doTTS(speakh);
        document.getElementById('notice').innerText = "起来活动，活动"
        document.getElementById('subtitle').innerText = "挥动你的双手，让我看见，即可停止语音提醒！"
    }, 10000);
}

setTimeout(() => {
    active = setInterval(() => {
        doTTS("北京第三 996 提醒您，道路千万条，生命第一条，健康不注意，亲人两行泪");
        document.getElementById('notice').innerText = "起来活动，活动"
        document.getElementById('subtitle').innerText = "挥动你的双手，让我看见，即可停止语音提醒！"
    }, 10000);
}, 1000);

setTimeout(() => {
    practiceIntercal()
}, 1*60*60*1000);

setTimeout(() => {
    practiceIntercal()
}, 1.5*60*60*1000);

setTimeout(() => {
    practiceIntercal()
}, 3*60*60*1000);

setTimeout(() => {
    practiceIntercal()
}, 4.5*60*60*1000);



// ######################################### 识别图片
function detectImg() {
    let imageElement = document.getElementById('canvas');
    let canvas = document.getElementById('output');

    // 设置加载模型走自己服务器，不设置则走google的服务器
    posenet.load({ modelUrl: '/model-stride16.json' }).then(net => {
        return net.estimateSinglePose(imageElement, {
            flipHorizontal: false
        });
    }).then(pose => {
        if (pose.keypoints[10].score > 0.9) {
            if (active) {
                clearInterval(active);
                document.getElementById('notice').innerText = "... ...";
                document.getElementById('subtitle').innerText = "";
            }
        }
        renderImageToCanvas(imageElement, [imageElement.width, imageElement.height], canvas);
        let ctx = canvas.getContext('2d');
        drawKeypoints(pose.keypoints, ctx);
        drawSkeleton(pose.keypoints, ctx);
    });
}
