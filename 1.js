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

            setTimeout(() => {
                infoBox.classList.remove('show');
                infoBox.classList.add('hide');
            }, 5000); // 3秒后隐藏
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
            const messageToSend = customMessage.length > 0 ? customMessage : "您好，有人需要您挪车，请及时处理。 6";

            showInfoBox('success', '正在通知车主... 1');

            setTimeout(() => {
                notifyOwner(messageToSend);
                lastNotificationTime = Date.now(); // 更新上次通知时间
            }, 4000);  // 延迟2秒，模拟通知过程
        }

        function notifyOwner(messageToSend) {
            const bodyContent = {
                appToken: wxpusherAppToken,
                content: `${messageToSend}`,
                contentType: 1,
                uids: wxpusherUIDs
            };

            fetch("https://wxpusher.zjiecode.com/api/send/message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bodyContent)
            })
            .then(response => response.json())
            .then(data => {
                if (data.code ===1000) {
                    showInfoBox('success', '已成功通知车主前来移车，请稍后等待！ 11');
                } else {
                    showInfoBox('error', `通知发送失败: ${data.msg || '未知错误 0'}`);
                }
            })
            .catch(error => {
                showInfoBox('error', `通知发送失败，请稍后重试。错误: ${error.message} 02`);
            });
        }


