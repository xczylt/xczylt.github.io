// 定义全局常量，用于存储相关配置信息
const {
    wxpusherAppToken = 'AT_42SgggbnnXdnm3gzQPiYcbShLGTRYFgh',
    wxpusherUIDs = ['UID_kJP2XxI6RxcVtjt4W3Ve1lRW5Zzp']
} = window;
let lastNotificationTime = 0; // 记录上次通知的时间

// 显示信息框的函数，负责展示不同类型的提示信息并按设定时间隐藏
function showInfoBox(type, message) {
    const infoBox = document.getElementById('infoBox');
    const infoBoxIcon = document.getElementById('infoBoxIcon');
    const infoBoxMessage = document.getElementById('infoBoxMessage');

    infoBox.classList.remove('hide');
    infoBox.classList.add('show');
    infoBoxIcon.classList.remove('success', 'error');
    infoBoxIcon.classList.add(type);
    infoBoxMessage.textContent = message;

    const displayTimeMap = {
        'success': {
            '已成功通知车主前来移车，请稍后等待！ 11': 5000
        }
    };
    const displayTime = displayTimeMap[type]?.[message] || 5000;
    setTimeout(() => {
        infoBox.classList.remove('show');
        infoBox.classList.add('hide');
    }, displayTime);
}

// 通知车主的主函数，检查时间间隔后发起通知请求
function notifyOwnerWithCustomMessage() {
    const currentTime = Date.now();
    if (currentTime - lastNotificationTime < 120000) {
        const remainingTime = getRemainingTime(currentTime, lastNotificationTime);
        showInfoBox('error', getWaitMessage(remainingTime));
        return;
    }

    const customMessage = getCustomMessage();
    notifyOwner(customMessage);
}

// 获取自定义通知消息，如果输入框为空则使用默认消息
function getCustomMessage() {
    const inputElement = document.getElementById('customMessage');
    return inputElement.value.trim() || "您好，有人需要您挪车，请及时处理。 6";
}

// 根据剩余时间计算并返回等待提示的具体消息内容
function getWaitMessage(remainingTime) {
    const minutes = Math.floor(remainingTime / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);
    return `请等待 ${minutes} 分 ${seconds} 秒 后再通知车主。 3`;
}

// 获取两次通知之间的剩余时间（毫秒）
function getRemainingTime(currentTime, lastNotificationTime) {
    return 120000 - (currentTime - lastNotificationTime);
}

// 发起实际的通知请求并处理返回结果
function notifyOwner(messageToSend) {
    const bodyContent = {
        appToken: wxpusherAppToken,
        content: messageToSend,
        contentType: 1,
        uids: wxpusherUIDs
    };

    return fetch("https://wxpusher.zjiecode.com/api/send/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyContent)
    })
   .then(response => response.json())
   .then(data => {
        if (data.code === 1000) {
            showInfoBox('success', '已成功通知车主前来移车，请稍后等待！ 11');
            updateLastNotificationTime();
        } else {
            showInfoBox('error', `通知发送失败: ${data.msg || '未知错误 0'}`);
        }
    })
   .catch(error => {
        showInfoBox('error', `通知发送失败，请稍后重试。错误: ${error.message} 02`);
    });
}

// 更新上次通知时间为当前时间
function updateLastNotificationTime() {
    lastNotificationTime = Date.now();
}
