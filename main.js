// Description: 弹幕留言板功能实现
let selectedColor = '#333';

// ✅ 初始化颜色按钮
document.addEventListener("DOMContentLoaded", () => {
  // ✅ 颜色按钮逻辑
  document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.getAttribute('data-color');
      document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  // ✅ 加载已保存的留言
  const messages = JSON.parse(localStorage.getItem('messages')) || [];

  // ✅ 显示已保存的留言
  if(messages.length <=10)
  {
    createFloatingText(messages[0].text, messages[0].color, messages[0].fontSize);  
  }
  // ✅ 循环播放弹幕
  if (messages.length > 1) {
    let i = 0;
    setInterval(() => {
      const entry = messages[i % messages.length];
      createFloatingText(entry.text, entry.color, entry.fontSize);
      i++;
    }, 8000); // 每 8 秒出现一条弹幕
  }
});

// ✅ 提交留言
function submitMessage() {
  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  const fontSize = document.getElementById('fontsize').value;

  // ✅ 验证输入
  if (!name || !message) {
    alert("请填写署名和留言！");
    return;
  }

  // ✅ 验证字体大小
  const displayText = `${name}: ${message}`;

  // ✅ 保存当前留言
  const entry = {
    text: displayText,
    color: selectedColor,
    fontSize: fontSize
  };

  // ✅ 将留言保存到 localStorage
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  messages.push(entry);
  localStorage.setItem('messages', JSON.stringify(messages));

  // ✅ 弹幕立即出现
  createFloatingText(displayText, selectedColor, fontSize);
}

// ✅ 创建弹幕元素
function createFloatingText(text, color, fontSize) {
  const floating = document.createElement('div');
  floating.className = 'floating';
  floating.textContent = text;

  // 设置随机背景颜色
  const stickyColors = ['#fff8dc','#fce4ec','#e3f3fd','#f1f8e9','#fff3e0','#f9fbe7'];
  const bgColor = stickyColors[Math.floor(Math.random() * stickyColors.length)];

  // 设置样式
  floating.style.backgroundColor = bgColor;
  floating.style.border = '1px solid #e0d6d8';
  floating.style.color = color;
  floating.style.fontSize = fontSize;

// 设置随机位置和动画
  const y = Math.random() * (window.innerHeight -  60);
  floating.style.top = `${y}px`;
  floating.style.left = '100vw'; // 从右侧开始

  // 设置随机水平位置
  const duration = 12 + Math.random() * 8;
  floating.style.animation = `danmu ${duration}s linear forwards`;

  // 添加到页面
  document.getElementById('floating-messages').appendChild(floating);

 // 设置动画结束后移除元素
  setTimeout(() => {
    floating.remove();
  }, duration * 1000);
}
