/**
 * 智能监测云平台 - 用户注册页面交互逻辑
 * 功能包括：分步表单、表单验证、密码强度检测、用户注册
 */

class RegisterManager {
  constructor() {
    this.form = document.getElementById('registerForm');
    this.currentStep = 1;
    this.totalSteps = 3;
    this.formData = {};
    
    // 表单元素
    this.steps = document.querySelectorAll('.step');
    this.formSteps = document.querySelectorAll('.form-step');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.submitBtn = document.getElementById('submitBtn');
    this.errorMsg = document.getElementById('errorMsg');
    
    this.init();
  }

  /**
   * 初始化注册管理器
   */
  init() {
    this.bindEvents();
    this.initPasswordStrength();
    this.initPasswordToggle();
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
   * 添加输入验证
   */
  addInputValidation() {
    const inputs = this.form.querySelectorAll('input');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        this.clearFieldError(input);
        if (input.id === 'password') {
          this.checkPasswordStrength(input.value);
        }
        if (input.id === 'confirmPassword') {
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
      case 'firstName':
      case 'lastName':
        isValid = value.length >= 2;
        errorMessage = isValid ? '' : '姓名至少需要2个字符';
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        errorMessage = isValid ? '' : '请输入有效的邮箱地址';
        break;
      
      case 'phone':
        const phoneRegex = /^1[3-9]\d{9}$/;
        isValid = phoneRegex.test(value);
        errorMessage = isValid ? '' : '请输入有效的手机号码';
        break;
      
      case 'username':
        isValid = value.length >= 3 && value.length <= 20;
        errorMessage = isValid ? '' : '用户名长度3-20个字符';
        break;
      
      case 'password':
        isValid = value.length >= 6;
        errorMessage = isValid ? '' : '密码长度不少于6位';
        break;
      
      case 'confirmPassword':
        const password = document.getElementById('password').value;
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
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const confirmInput = document.getElementById('confirmPassword');
    
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
    const passwordInput = document.getElementById('password');
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
      
      if (this.currentStep < this.totalSteps) {
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
    }
  }

  /**
   * 验证当前步骤
   */
  validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
    const inputs = currentStepElement.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showError('请检查并修正表单中的错误');
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
      step.style.display = stepNumber === this.currentStep ? 'block' : 'none';
    });
    
    // 更新按钮显示
    this.prevBtn.style.display = this.currentStep > 1 ? 'inline-block' : 'none';
    this.nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-block' : 'none';
    this.submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-block' : 'none';
    
    // 更新确认信息
    if (this.currentStep === 3) {
      this.updateSummaryInfo();
    }
  }

  /**
   * 更新确认信息
   */
  updateSummaryInfo() {
    document.getElementById('summary-name').textContent = `${this.formData.lastName || ''}${this.formData.firstName || ''}`;
    document.getElementById('summary-email').textContent = this.formData.email || '';
    document.getElementById('summary-phone').textContent = this.formData.phone || '';
    document.getElementById('summary-username').textContent = this.formData.username || '';
  }

  /**
   * 处理表单提交
   */
  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateCurrentStep()) {
      return;
    }
    
    // 检查服务条款
    const agreeTerms = document.getElementById('agreeTerms').checked;
    if (!agreeTerms) {
      this.showError('请同意用户服务协议和隐私政策');
      return;
    }
    
    try {
      this.setLoadingState(true);
      this.clearError();
      
      // 保存所有数据
      this.saveCurrentStepData();
      
      // 模拟注册请求
      await this.simulateRegisterRequest();
      
      // 注册成功
      this.handleRegisterSuccess();
      
    } catch (error) {
      this.handleRegisterError(error);
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * 模拟注册请求
   */
  simulateRegisterRequest() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟用户名已存在的情况
        if (this.formData.username === 'admin' || this.formData.username === 'user') {
          reject(new Error('用户名已存在，请选择其他用户名'));
        } else {
          resolve();
        }
      }, 1000 + Math.random() * 1000);
    });
  }

  /**
   * 处理注册成功
   */
  handleRegisterSuccess() {
    this.showSuccessMessage('注册成功！正在跳转到登录页面...');
    
    // 保存用户信息到本地存储（仅用于演示）
    localStorage.setItem('registeredUser', JSON.stringify({
      username: this.formData.username,
      email: this.formData.email,
      registeredAt: new Date().toISOString()
    }));
    
    // 延迟跳转
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  }

  /**
   * 处理注册错误
   */
  handleRegisterError(error) {
    console.error('注册错误:', error);
    this.showError(error.message || '注册过程中发生错误，请稍后重试');
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
    this.submitBtn.disabled = loading;
    this.submitBtn.classList.toggle('loading', loading);
    
    const btnText = this.submitBtn.querySelector('.btn-text');
    const btnLoading = this.submitBtn.querySelector('.btn-loading');
    
    if (loading) {
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
    } else {
      btnText.style.display = 'block';
      btnLoading.style.display = 'none';
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
}

/**
 * 显示用户服务协议
 */
function showTerms() {
  alert('用户服务协议\n\n这里是用户服务协议的内容...\n\n在实际应用中，这里应该是一个完整的协议页面。');
}

/**
 * 显示隐私政策
 */
function showPrivacy() {
  alert('隐私政策\n\n这里是隐私政策的内容...\n\n在实际应用中，这里应该是一个完整的隐私政策页面。');
}

/**
 * 页面加载完成后初始化
 */
document.addEventListener("DOMContentLoaded", function() {
  // 检查浏览器兼容性
  if (!window.localStorage) {
    console.warn('浏览器不支持localStorage');
  }

  // 初始化注册管理器
  const registerManager = new RegisterManager();
  
  // 添加页面可见性变化监听
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // 页面重新可见时可以添加一些逻辑
    }
  });

  console.log('智能监测云平台注册页面已加载完成');
});
