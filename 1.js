        let isDarkMode = false;
        let lastNotificationTime = 0; // 记录上次通知的时间
        const phone = '17608462601';
        const wxpusherAppToken = 'AT_42SgggbnnXdnm3gzQPiYcbShLGTRYFgh';
        const wxpusherUIDs = ['UID_kJP2XxI6RxcVtjt4W3Ve1lRW5Zzp'];

        // 切换夜间模式
        function toggleDarkMode() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            const button = document.querySelector('.toggle-dark-mode-btn');
            button.textContent = isDarkMode ? '☀️' : '🌙';
        }

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
            }, 3000); // 3秒后隐藏
        }

        // 通知车主
        function notifyOwnerWithCustomMessage() {
            const currentTime = Date.now();
            if (currentTime - lastNotificationTime < 120000) { // 检查是否达到2分钟限制120000
                const remainingTime = 120000 - (currentTime - lastNotificationTime);
                const minutes = Math.floor(remainingTime / 60000);
                const seconds = Math.floor((remainingTime % 60000) / 1000);
                showInfoBox('error', `请等待 ${minutes} 分 ${seconds} 秒 后再通知车主。`);
                return;
            }

            const customMessage = document.getElementById('customMessage').value.trim();
            const messageToSend = customMessage.length > 0 ? customMessage : "您好，有人需要您挪车，请及时处理。";

            showInfoBox('success', '正在通知车主...');

            setTimeout(() => {
                notifyOwner(messageToSend);
                lastNotificationTime = Date.now(); // 更新上次通知时间
            }, 2000);  // 延迟2秒，模拟通知过程
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
                if (data.code === 1000) {
                    showInfoBox('success', '已成功通知车主前来移车，请稍后等待！');
                } else {
                    showInfoBox('error', `通知发送失败: ${data.msg || '未知错误'}`);
                }
            })
            .catch(error => {
                showInfoBox('error', `通知发送失败，请稍后重试。错误: ${error.message}`);
            });
        }

        // 拨打电话
        function callOwner() {
            window.location.href = `tel:${phone}`;
        }

        // 监听滑块滑动（触摸支持）
        const callBtnContainer = document.getElementById('callBtnContainer');
        const callBtnSlider = document.getElementById('callBtnSlider');

        let startX;
        let isSliding = false;


// 触摸开始
callBtnContainer.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    isSliding = true;
    callBtnContainer.classList.remove('active');
    callBtnSlider.style.transition = 'none'; // 禁止过渡，实时更新
    // 隐藏文字并准备动画
    const callBtnText = document.querySelector('.call-btn-text');
    callBtnText.style.transition = 'none';
    callBtnText.style.opacity = '0';
    callBtnText.style.transform = 'translateX(-100%)';  // 让文字移出视图
});

// 触摸移动
callBtnContainer.addEventListener('touchmove', (event) => {
    if (!isSliding) return;
    let deltaX = event.touches[0].clientX - startX;
    if (deltaX >= 0) {
        const width = Math.min(deltaX, 250); // 限制最大滑动距离
        callBtnSlider.style.transform = `translateX(${width}px)`;  // 滑块移动
        callBtnSlider.style.width = `${width}px`; // 调整滑块宽度
    }
});

// 触摸结束
callBtnContainer.addEventListener('touchend', () => {
    if (isSliding) {
        isSliding = false;
        const deltaX = parseInt(callBtnSlider.style.transform.replace('translateX(', '').replace('px)', ''));

        if (deltaX >= 250) {
            // 如果滑动达到250px，触发拨打电话
            callBtnContainer.classList.add('active');
            callOwner();  // 执行拨打电话操作

            // 触发恢复滑块原位
            setTimeout(() => {
                // 恢复滑块原位，并显示过渡效果
                callBtnSlider.style.transition = 'transform 0.3s ease, width 0.3s ease';
                callBtnSlider.style.transform = 'translateX(0)';
                callBtnSlider.style.width = '50px';

                // 恢复按钮文字，加入动态效果
                const callBtnText = document.querySelector('.call-btn-text');
                callBtnText.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                callBtnText.style.opacity = '1'; // 恢复按钮文字透明度
                callBtnText.style.transform = 'translateX(0)';  // 文字从左滑入
            }, 500); // 在拨打电话操作之后，500毫秒恢复滑块原位
        } else {
            // 否则，恢复滑块原位
            callBtnSlider.style.transition = 'transform 0.3s ease, width 0.3s ease'; // 恢复过渡效果
            callBtnSlider.style.transform = 'translateX(0)';
            callBtnSlider.style.width = '50px'; // 恢复为初始宽度

            // 恢复按钮文字，加入动态效果
            const callBtnText = document.querySelector('.call-btn-text');
            callBtnText.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            callBtnText.style.opacity = '1'; // 恢复按钮文字透明度
            callBtnText.style.transform = 'translateX(0)';  // 文字从左滑入
        }
    }
});




