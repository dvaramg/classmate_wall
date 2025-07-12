let selectedColor = '#333';

document.addEventListener("DOMContentLoaded", () => {
  // 颜色选择
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.getAttribute('data-color');
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // 等待 Firebase 初始化完成
  const waitFirebase = setInterval(() => {
    if (window.messagesCollectionRef) {
      clearInterval(waitFirebase);
      startRealtimeListener();
    }
  }, 100);
});

function submitMessage() {
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  const fontSize = document.getElementById('fontsize').value;
  const displayText = `${name}: ${message}`;

  if (!name || !message) {
    alert("请填写署名和留言！");
    return;
  }

  const entry = {
    text: displayText,
    color: selectedColor,
    fontSize: fontSize,
    timestamp: Date.now()
  };

  if (window.messagesCollectionRef) {
    window.addDoc(window.messagesCollectionRef, entry).then(() => {
      document.getElementById('name').value = '';
      document.getElementById('message').value = '';
    }).catch(err => {
      console.error("上传失败", err);
    });
  }
}

function startRealtimeListener() {
  const q = window.query(window.messagesCollectionRef, window.orderBy("timestamp", "desc"));
  window.onSnapshot(q, (snapshot) => {
    const allMessages = [];
    snapshot.forEach(doc => {
      allMessages.push(doc.data());
    });

    // 清空原弹幕
    document.getElementById('floating-messages').innerHTML = "";

    // 遍历生成弹幕
    let i = 0;
    if (allMessages.length) {
      createFloatingText(allMessages[0].text, allMessages[0].color, allMessages[0].fontSize);
    }
    if (allMessages.length > 1) {
      setInterval(() => {
        const entry = allMessages[i % allMessages.length];
        createFloatingText(entry.text, entry.color, entry.fontSize);
        i++;
      }, 8000);
    }
  });
}

function createFloatingText(text, color, fontSize) {
  const floating = document.createElement('div');
  floating.className = 'floating';
  floating.textContent = text;

  const stickyColors = ['#fff8dc','#fce4ec','#e3f3fd','#f1f8e9','#fff3e0','#f9fbe7'];
  const bgColor = stickyColors[Math.floor(Math.random() * stickyColors.length)];

  floating.style.backgroundColor = bgColor;
  floating.style.border = '1px solid #e0d6d8';
  floating.style.color = color;
  floating.style.fontSize = fontSize;

  const y = Math.random() * (window.innerHeight *0.3);
  floating.style.top = `${y}px`;
  floating.style.left = '100vw';
  const duration = 12 + Math.random() * 8;
  floating.style.animation = `danmu ${duration}s linear forwards`;

  document.getElementById('floating-messages').appendChild(floating);

  setTimeout(() => {
    floating.remove();
  }, duration * 1000);
}
