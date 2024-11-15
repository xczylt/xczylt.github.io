        let isDarkMode = false;
        let lastNotificationTime = 0; // 记录上次通知的时间
        const phone = '17608462601';
        const wxpusherAppToken = 'AT_42SgggbnnXdnm3gzQPiYcbShLGTRYFgh';
        const wxpusherUIDs = ['UID_kJP2XxI6RxcVtjt4W3Ve1lRW5Zzp'];




// 显示信息框
function showInfoBox(type, message) {
    const infoBox = document.getElementById('infoBox');
    const infoBoxIcon = document.getElementById('infoBoxIcon');
    const infoBoxMessage = document.getElementById('infoBoxMessage');

    infoBox.classList.remove('hide');
    infoBox.classList.add('show');
    infoBoxIcon.classList.remove('success', 'error');
    infoBoxIcon.classList.add(type);
    infoBoxMessage.textContent = message;

    let displayTime = 5000;
    if (type ==='success' && message === '正在通知车主... 1') {
        displayTime = 2000; // 展示时间调整为2秒
    }
    setTimeout(() => {
        infoBox.classList.remove('show');
        infoBox.classList.add('hide');
        if (type ==='success' && message === '正在通知车主... 1') {
            setTimeout(() => {
                // 提前1秒显示“已成功通知车主前来移车，请稍后等待！”提示（假设通知成功）
                const lastMessage = document.getElementById('infoBoxMessage').textContent;
                if (lastMessage === '正在通知车主... 1') {
                    const messageToSend = document.getElementById('customMessage').value.trim();
                    const actualMessage = messageToSend.length > 0? messageToSend : "您好，有人需要您挪车，请及时处理。 6";
                    notifyOwner(actualMessage).then((success) => {
                        if (success) {
                            showInfoBox('success', '已成功通知车主前来移车，请稍后等待！ 11');
                        }
                    });
                }
            }, 1000); 
        }
    }, displayTime);
}

// 通知车主
function notifyOwnerWithCustomMessage() {
    const currentTime = Date.now();
    if (currentTime - lastNotificationTime < 120000) { // 检查是否达到2分钟限制120000
        const remainingTime = 120000 - (currentTime - lastNotificationTime);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        showInfoBox('error', `请等待 ${minutes} 分 ${seconds} 秒 后再通知车主。 3`);
        return;
    }

    const customMessage = document.getElementById('customMessage').value.trim();
    const messageToSend = customMessage.length > 0? customMessage : "您好，有人需要您挪车，请及时处理。 6";

    notifyOwner(messageToSend);
    showInfoBox('success', '正在通知车主... 1');
}

function notifyOwner(messageToSend) {
    const bodyContent = {
        appToken: wxpusherAppToken,
        content: `${messageToSend}`,
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
            return true;
        } else {
            showInfoBox('error', `通知发送失败: ${data.msg || '未知错误 0'}`);
            return false;
        }
    })
.catch(error => {
        showInfoBox('error', `通知发送失败，请稍后重试。错误: ${error.message} 02`);
        return false;
    });
}
