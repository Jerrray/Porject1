/**
 * 智能监测云平台 - 简化版登录页面
 * 优化性能，减少卡顿问题
 */

document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById("rememberMe");
    const loginForm = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");
    const loginBtn = document.querySelector('.btn-login');

    // 页面加载时自动填充本地存储的账号和密码
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const remember = localStorage.getItem("remember");

    if (remember === "true" && savedUsername && savedPassword) {
        usernameInput.value = savedUsername;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }

    // 登录验证逻辑
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 简单验证
        if (username === "user" && password === "123456789123") {
            errorMsg.textContent = "";
            errorMsg.style.display = "none";
            
            // 显示成功消息
            errorMsg.textContent = "登录成功！正在跳转...";
            errorMsg.style.display = "block";
            errorMsg.style.color = "#28a745";
            errorMsg.style.background = "rgba(40, 167, 69, 0.1)";
            errorMsg.style.borderLeftColor = "#28a745";

            // 如果勾选了"记住密码"，保存账号密码
            if (rememberCheckbox.checked) {
                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                localStorage.setItem("remember", "true");
            } else {
                localStorage.removeItem("username");
                localStorage.removeItem("password");
                localStorage.setItem("remember", "false");
            }

            // 快速跳转到首页
            setTimeout(() => {
                window.location.href = "home.html";
            }, 500);
        } else if (username === "admin" && password === "admin123") {
            // 快速登录选项
            errorMsg.textContent = "快速登录成功！正在跳转...";
            errorMsg.style.display = "block";
            errorMsg.style.color = "#28a745";
            errorMsg.style.background = "rgba(40, 167, 69, 0.1)";
            errorMsg.style.borderLeftColor = "#28a745";
            
            setTimeout(() => {
                window.location.href = "home.html";
            }, 300);
        } else {
            errorMsg.textContent = "用户名或密码错误，请重试。";
            errorMsg.style.display = "block";
            errorMsg.style.color = "#dc3545";
            errorMsg.style.background = "rgba(220, 53, 69, 0.1)";
            errorMsg.style.borderLeftColor = "#dc3545";
        }
    });

    // 简单的输入验证
    usernameInput.addEventListener('input', function() {
        if (this.value.trim()) {
            this.style.borderColor = '#28a745';
        } else {
            this.style.borderColor = '#ced4da';
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length >= 12) {
            this.style.borderColor = '#28a745';
        } else {
            this.style.borderColor = '#ced4da';
        }
    });

    // 清除错误信息
    usernameInput.addEventListener('focus', function() {
        errorMsg.style.display = 'none';
    });

    passwordInput.addEventListener('focus', function() {
        errorMsg.style.display = 'none';
    });

    console.log('简化版登录页面已加载完成');
});
