/**
 * 智能监测云平台 - 忘记密码页面交互逻辑
 * 功能包括：分步表单、验证码发送、密码重置、倒计时功能
 */

class ForgotPasswordManager {
  constructor() {
    this.form = document.getElementById('forgotForm');
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    this.selectedMethod = null;
    this.verificationCode = '';
    this.countdownTimer = null;
    this.countdownSeconds = 60;
    
    // 表单元素
    this.steps = document.querySelectorAll('.step');
    this.formSteps = document.querySelectorAll('.form-step');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.submitBtn = document.getElementById('submitBtn');
    this.errorMsg = document.getElementById('errorMsg');
    this.successMessage = document.getElementById('successMessage');
    
    // 验证码输入框
    this.verificationInputs = document.querySelectorAll('.verification-input');
    
    this.init();
  }

  /**
   * 初始化忘记密码管理器
   */
  init() {
    this.bindEvents();
    this.initPasswordStrength();
    this.initPasswordToggle();
    this.initVerificationInputs();
    this.initMethodSelection();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 表单提交事件
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    
    // 导航按钮事件
    this.prevBtn.addEventListener('click', () => this.prevStep());
    this.nextBtn.addEventListener('click', () => this.nextStep());
    
    // 输入验证事件
    this.addInputValidation();
    
    // 键盘事件
    this.form.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  /**
   * 初始化方法选择
   */
  initMethodSelection() {
    const methodOptions = document.querySelectorAll('.method-option');
    
    methodOptions.forEach(option => {
      option.addEventListener('click', () => {
        // 移除其他选项的选中状态
        methodOptions.forEach(opt => opt.classList.remove('selected'));
        
        // 添加选中状态
        option.classList.add('selected');
        this.selectedMethod = option.dataset.method;
        
        // 更新联系方式的占位符
        const contactInput = document.getElementById('contact');
        if (this.selectedMethod === 'email') {
          contactInput.placeholder = '验证码将发送到邮箱';
        } else if (this.selectedMethod === 'sms') {
          contactInput.placeholder = '验证码将发送到手机';
        }
      });
    });
  }

  /**
   * 初始化验证码输入框
   */
  initVerificationInputs() {
    this.verificationInputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value;
        
        // 只允许数字
        if (!/^\d*$/.test(value)) {
          e.target.value = '';
          return;
        }
        
        // 移动到下一个输入框
        if (value && index < this.verificationInputs.length - 1) {
          this.verificationInputs[index + 1].focus();
        }
        
        // 检查是否所有输入框都已填写
        this.checkVerificationComplete();
      });
      
      input.addEventListener('keydown', (e) => {
        // 退格键处理
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
          this.verificationInputs[index - 1].focus();
        }
        
        // 左右箭头键处理
        if (e.key === 'ArrowLeft' && index > 0) {
          this.verificationInputs[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < this.verificationInputs.length - 1) {
          this.verificationInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        digits.split('').forEach((digit, i) => {
          if (i < this.verificationInputs.length) {
            this.verificationInputs[i].value = digit;
          }
        });
        
        this.checkVerificationComplete();
        this.verificationInputs[Math.min(digits.length - 1, this.verificationInputs.length - 1)].focus();
      });
    });
  }

  /**
   * 检查验证码是否完整
   */
  checkVerificationComplete() {
    const code = Array.from(this.verificationInputs)
      .map(input => input.value)
      .join('');
    
    this.verificationCode = code;
    
    // 更新输入框样式
    this.verificationInputs.forEach((input, index) => {
      input.classList.toggle('filled', input.value !== '');
    });
    
    // 如果验证码完整，自动验证
    if (code.length === 6) {
      setTimeout(() => this.verifyCode(), 500);
    }
  }

  /**
   * 添加输入验证
   */
  addInputValidation() {
    const inputs = this.form.querySelectorAll('input');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        this.clearFieldError(input);
        if (input.id === 'newPassword') {
          this.checkPasswordStrength(input.value);
        }
        if (input.id === 'confirmNewPassword') {
          this.validatePasswordMatch();
        }
      });
    });
  }

  /**
   * 验证单个字段
   */
  validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
      case 'username':
        // 检查用户名或邮箱格式
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        const isUsername = value.length >= 3 && value.length <= 20;
        isValid = isEmail || isUsername;
        errorMessage = isValid ? '' : '请输入有效的用户名或邮箱地址';
        break;
      
      case 'newPassword':
        isValid = value.length >= 6;
        errorMessage = isValid ? '' : '密码长度不少于6位';
        break;
      
      case 'confirmNewPassword':
        const password = document.getElementById('newPassword').value;
        isValid = value === password && value.length > 0;
        errorMessage = isValid ? '' : '两次输入的密码不一致';
        break;
    }

    this.updateFieldState(input, isValid, errorMessage);
    return isValid;
  }

  /**
   * 更新字段状态
   */
  updateFieldState(input, isValid, errorMessage) {
    const inputGroup = input.closest('.input-group');
    const warnElement = inputGroup.querySelector('.warn');
    
    inputGroup.classList.remove('success', 'error');
    
    if (input.value.trim()) {
      inputGroup.classList.add(isValid ? 'success' : 'error');
      warnElement.textContent = errorMessage;
      warnElement.style.display = errorMessage ? 'block' : 'none';
      
      // 更新ARIA状态
      input.setAttribute('aria-invalid', !isValid);
    } else {
      warnElement.style.display = 'none';
    }
  }

  /**
   * 清除字段错误
   */
  clearFieldError(input) {
    const inputGroup = input.closest('.input-group');
    const warnElement = inputGroup.querySelector('.warn');
    
    inputGroup.classList.remove('error');
    warnElement.style.display = 'none';
    input.removeAttribute('aria-invalid');
  }

  /**
   * 检查密码强度
   */
  checkPasswordStrength(password) {
    const strengthText = document.getElementById('strength-text');
    const strengthFill = document.getElementById('strength-fill');
    
    let strength = 0;
    let strengthLabel = '';
    let strengthClass = '';
    
    // 长度检查
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    
    // 复杂度检查
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // 确定强度等级
    if (strength <= 2) {
      strengthLabel = '弱';
      strengthClass = 'strength-weak';
    } else if (strength <= 4) {
      strengthLabel = '中等';
      strengthClass = 'strength-medium';
    } else {
      strengthLabel = '强';
      strengthClass = 'strength-strong';
    }
    
    // 更新UI
    strengthText.textContent = `密码强度：${strengthLabel}`;
    strengthFill.className = `strength-fill ${strengthClass}`;
    strengthFill.style.width = `${(strength / 6) * 100}%`;
  }

  /**
   * 验证密码匹配
   */
  validatePasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    const confirmInput = document.getElementById('confirmNewPassword');
    
    if (confirmPassword && password !== confirmPassword) {
      this.updateFieldState(confirmInput, false, '两次输入的密码不一致');
    } else if (confirmPassword && password === confirmPassword) {
      this.updateFieldState(confirmInput, true, '');
    }
  }

  /**
   * 初始化密码强度检测
   */
  initPasswordStrength() {
    const passwordInput = document.getElementById('newPassword');
    if (passwordInput) {
      passwordInput.addEventListener('input', (e) => {
        this.checkPasswordStrength(e.target.value);
      });
    }
  }

  /**
   * 初始化密码显示/隐藏功能
   */
  initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
        const eyeIcon = btn.querySelector('.eye-icon');
        
        if (input) {
          const isPassword = input.type === 'password';
          input.type = isPassword ? 'text' : 'password';
          eyeIcon.textContent = isPassword ? '🙈' : '👁️';
          btn.setAttribute('aria-label', isPassword ? '隐藏密码' : '显示密码');
        }
      });
    });
  }

  /**
   * 下一步
   */
  nextStep() {
    if (this.validateCurrentStep()) {
      this.saveCurrentStepData();
      
      if (this.currentStep === 1) {
        // 发送验证码
        this.sendVerificationCode();
      } else if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateStepDisplay();
      }
    }
  }

  /**
   * 上一步
   */
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStepDisplay();
      
      // 清除倒计时
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
    }
  }

  /**
   * 验证当前步骤
   */
  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    let isValid = true;
    
    if (this.currentStep === 1) {
      // 验证第一步：用户名和方法选择
      const usernameInput = document.getElementById('username');
      isValid = this.validateField(usernameInput);
      
      if (isValid && !this.selectedMethod) {
        this.showError('请选择验证方式');
        isValid = false;
      }
    } else if (this.currentStep === 2) {
      // 验证第二步：验证码
      if (this.verificationCode.length !== 6) {
        this.showError('请输入完整的验证码');
        isValid = false;
      }
    } else if (this.currentStep === 3) {
      // 验证第三步：新密码
      const inputs = currentStepElement.querySelectorAll('input[required]');
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
    }
    
    return isValid;
  }

  /**
   * 保存当前步骤数据
   */
  saveCurrentStepData() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input');
    
    inputs.forEach(input => {
      if (input.value.trim()) {
        this.formData[input.name] = input.value.trim();
      }
    });
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode() {
    try {
      this.setLoadingState(true);
      this.clearError();
      
      // 模拟发送验证码
      await this.simulateSendCode();
      
      // 更新联系方式显示
      this.updateContactDisplay();
      
      // 进入下一步
      this.currentStep++;
      this.updateStepDisplay();
      
      // 开始倒计时
      this.startCountdown();
      
    } catch (error) {
      this.showError(error.message || '发送验证码失败，请稍后重试');
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * 模拟发送验证码
   */
  simulateSendCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟用户名不存在的情况
        const username = this.formData.username;
        if (username === 'nonexistent') {
          reject(new Error('用户不存在，请检查用户名或邮箱'));
        } else {
          resolve();
        }
      }, 1000 + Math.random() * 1000);
    });
  }

  /**
   * 更新联系方式显示
   */
  updateContactDisplay() {
    const contactInput = document.getElementById('contact');
    const username = this.formData.username;
    
    if (this.selectedMethod === 'email') {
      // 如果是邮箱，直接显示
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
        contactInput.value = username;
      } else {
        // 如果是用户名，模拟邮箱
        contactInput.value = `${username}@example.com`;
      }
    } else if (this.selectedMethod === 'sms') {
      // 模拟手机号
      contactInput.value = '138****8888';
    }
  }

  /**
   * 开始倒计时
   */
  startCountdown() {
    this.countdownSeconds = 60;
    const countdownText = document.getElementById('countdown-text');
    const resendLink = document.getElementById('resend-link');
    const countdown = document.getElementById('countdown');
    
    countdown.classList.add('active');
    resendLink.classList.add('disabled');
    
    this.countdownTimer = setInterval(() => {
      countdownText.textContent = `${this.countdownSeconds}秒后可重新发送`;
      this.countdownSeconds--;
      
      if (this.countdownSeconds < 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        countdown.classList.remove('active');
        resendLink.classList.remove('disabled');
        countdownText.textContent = '验证码已发送，';
      }
    }, 1000);
  }

  /**
   * 重新发送验证码
   */
  async resendCode() {
    if (this.countdownTimer || !this.selectedMethod) {
      return;
    }
    
    try {
      this.setLoadingState(true);
      this.clearError();
      
      // 清空验证码输入
      this.verificationInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
      });
      this.verificationCode = '';
      
      // 重新发送验证码
      await this.simulateSendCode();
      
      // 重新开始倒计时
      this.startCountdown();
      
      this.showSuccessMessage('验证码已重新发送');
      
    } catch (error) {
      this.showError(error.message || '发送验证码失败，请稍后重试');
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * 验证验证码
   */
  async verifyCode() {
    try {
      // 模拟验证码验证
      await this.simulateVerifyCode();
      
      // 验证成功，进入下一步
      this.currentStep++;
      this.updateStepDisplay();
      
    } catch (error) {
      this.showError('验证码错误，请重新输入');
      
      // 清空验证码输入
      this.verificationInputs.forEach(input => {
        input.value = '';
        input.classList.remove('filled');
      });
      this.verificationCode = '';
      this.verificationInputs[0].focus();
    }
  }

  /**
   * 模拟验证码验证
   */
  simulateVerifyCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟验证码为 123456
        if (this.verificationCode === '123456') {
          resolve();
        } else {
          reject(new Error('验证码错误'));
        }
      }, 500);
    });
  }

  /**
   * 更新步骤显示
   */
  updateStepDisplay() {
    // 更新步骤指示器
    this.steps.forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
      }
    });
    
    // 更新表单步骤
    this.formSteps.forEach((step, index) => {
      const stepNumber = index + 1;
      step.classList.toggle('active', stepNumber === this.currentStep);
    });
    
    // 更新按钮显示
    this.prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    this.nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
    this.submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
  }

  /**
   * 处理表单提交
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateCurrentStep()) {
      return;
    }
    
    try {
      this.setLoadingState(true);
      this.clearError();
      
      // 保存所有数据
      this.saveCurrentStepData();
      
      // 模拟密码重置
      await this.simulatePasswordReset();
      
      // 显示成功页面
      this.showSuccessPage();
      
    } catch (error) {
      this.handleResetError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * 模拟密码重置
   */
  simulatePasswordReset() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500 + Math.random() * 1000);
    });
  }

  /**
   * 显示成功页面
   */
  showSuccessPage() {
    // 隐藏表单
    this.form.style.display = 'none';
    
    // 显示成功消息
    this.successMessage.style.display = 'block';
    
    // 清除倒计时
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  /**
   * 处理重置错误
   */
  handleResetError(error) {
    console.error('密码重置错误:', error);
    this.showError(error.message || '密码重置失败，请稍后重试');
  }

  /**
   * 处理键盘事件
   */
  handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (this.currentStep < this.totalSteps) {
        this.nextStep();
      } else {
        this.handleSubmit(e);
      }
    }
  }

  /**
   * 设置加载状态
   */
  setLoadingState(loading) {
    const activeBtn = this.currentStep === this.totalSteps ? this.submitBtn : this.nextBtn;
    activeBtn.disabled = loading;
    activeBtn.classList.toggle('loading', loading);
    
    if (this.currentStep === this.totalSteps) {
      const btnText = this.submitBtn.querySelector('.btn-text');
      const btnLoading = this.submitBtn.querySelector('.btn-loading');
      
      if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
      } else {
        btnText.style.display = 'block';
        btnLoading.style.display = 'none';
      }
    } else {
      activeBtn.textContent = loading ? '发送中...' : '下一步';
    }
  }

  /**
   * 显示错误消息
   */
  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = 'block';
    this.errorMsg.style.color = 'var(--error-color)';
    this.errorMsg.style.background = 'rgba(220, 53, 69, 0.1)';
    this.errorMsg.style.borderLeftColor = 'var(--error-color)';
    this.errorMsg.classList.add('show');
    
    // 自动隐藏错误消息
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  /**
   * 显示成功消息
   */
  showSuccessMessage(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.style.display = 'block';
    this.errorMsg.style.color = 'var(--success-color)';
    this.errorMsg.style.background = 'rgba(40, 167, 69, 0.1)';
    this.errorMsg.style.borderLeftColor = 'var(--success-color)';
    this.errorMsg.classList.add('show');
    
    // 自动隐藏成功消息
    setTimeout(() => {
      this.clearError();
    }, 3000);
  }

  /**
   * 清除错误消息
   */
  clearError() {
    this.errorMsg.textContent = '';
    this.errorMsg.style.display = 'none';
    this.errorMsg.style.color = '';
    this.errorMsg.style.background = '';
    this.errorMsg.style.borderLeftColor = '';
    this.errorMsg.classList.remove('show');
  }

  /**
   * 清理资源
   */
  cleanup() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }
}

/**
 * 重新发送验证码（全局函数）
 */
function resendCode() {
  if (window.forgotPasswordManager) {
    window.forgotPasswordManager.resendCode();
  }
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener("DOMContentLoaded", function() {
  // 检查浏览器兼容性
  if (!window.localStorage) {
    console.warn('浏览器不支持localStorage');
  }

  // 初始化忘记密码管理器
  window.forgotPasswordManager = new ForgotPasswordManager();
  
  // 页面卸载时清理资源
  window.addEventListener('beforeunload', () => {
    window.forgotPasswordManager.cleanup();
  });

  console.log('智能监测云平台忘记密码页面已加载完成');
});
