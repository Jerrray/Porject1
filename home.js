/**
 * 智能监测云平台 - 首页交互逻辑
 * 功能包括：导航切换、用户管理、数据展示、响应式处理
 */

class HomeManager {
  constructor() {
    this.currentModule = '项目概览';
    this.menuItems = document.querySelectorAll('.menu a');
    this.logoutBtn = document.getElementById('logoutBtn');
    this.dashboardContent = document.getElementById('dashboard-content');
    this.userInfo = document.getElementById('user-display');
    this.currentMenuItemIndex = 0;
    
    this.init();
  }

  /**
   * 初始化首页管理器
   */
  init() {
    this.bindEvents();
    this.loadUserInfo();
    this.initializeDashboard();
    this.addResponsiveHandlers();
    this.addKeyboardNavigation();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 菜单点击事件
    this.menuItems.forEach(link => {
      link.addEventListener('click', (e) => this.handleMenuClick(e, link));
    });

    // 退出登录事件
    this.logoutBtn.addEventListener('click', () => this.handleLogout());

    // 窗口大小变化事件
    window.addEventListener('resize', Utils.debounce(() => this.handleResize(), 250));

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  /**
   * 处理菜单点击
   */
  handleMenuClick(e, clickedLink) {
        e.preventDefault();
    
    const moduleName = clickedLink.textContent.trim();
    
    // 更新活动状态
    this.updateActiveMenu(clickedLink);
    
    // 更新内容
    this.updateContent(moduleName);
    
    // 更新当前模块
    this.currentModule = moduleName;
    
    // 添加动画效果
    this.animateContentChange();
    
    // 更新页面标题
    this.updatePageTitle(moduleName);
  }

  /**
   * 更新活动菜单
   */
  updateActiveMenu(activeLink) {
    this.menuItems.forEach((link, index) => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
      if (link === activeLink) {
        this.currentMenuItemIndex = index;
      }
    });
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
  }

  /**
   * 更新内容区域
   */
  updateContent(moduleName) {
    const content = this.generateModuleContent(moduleName);
    
    // 添加淡出效果
    this.dashboardContent.style.opacity = '0';
    this.dashboardContent.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.dashboardContent.innerHTML = content;
      this.dashboardContent.style.opacity = '1';
      this.dashboardContent.style.transform = 'translateY(0)';
      
      // 如果是监控信息模块，初始化相关功能
      if (moduleName === '监控信息') {
        setTimeout(() => {
          this.initializeMonitoringFeatures();
        }, 100);
      }
    }, 200);
  }

  /**
   * 生成模块内容
   */
  generateModuleContent(moduleName) {
    const moduleContents = {
      '项目概览': this.generateProjectOverview(),
      '项目信息': this.generateProjectInfo(),
      '监控信息': this.generateMonitoringInfo(),
      '采集系统': this.generateCollectionSystem(),
      '告警信息': this.generateAlertInfo(),
      '数据分析': this.generateDataAnalysis(),
      '数据管理': this.generateDataManagement(),
      '权限管理': this.generatePermissionManagement()
    };

    return moduleContents[moduleName] || this.generateDefaultContent(moduleName);
  }

  /**
   * 生成项目概览内容
   */
  generateProjectOverview() {
    return `
      <div class="overview-card">
        <h3>项目概览</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>项目名称：</strong>
            <span>基坑监测云平台系统</span>
          </div>
          <div class="info-row">
            <strong>项目编号：</strong>
            <span>YRRZ-2024-001</span>
          </div>
          <div class="info-row">
            <strong>项目性质：</strong>
            <span>基坑安全监测</span>
          </div>
          <div class="info-row">
            <strong>监测单位：</strong>
            <span>智能监测云科技有限公司</span>
          </div>
          <div class="info-row">
            <strong>位置：</strong>
            <span>北京市朝阳区</span>
          </div>
          <div class="info-row">
            <strong>坐标：</strong>
            <span>116.4074°E, 39.9042°N</span>
          </div>
          <div class="info-row">
            <strong>报警级别：</strong>
            <span class="status-indicator online"></span>
            <span>正常</span>
          </div>
          <div class="info-row">
            <strong>项目状态：</strong>
            <span>运行中</span>
          </div>
          <div class="info-row">
            <strong>项目简介：</strong>
            <span>基于物联网技术的智能基坑监测系统，实时监控基坑变形、水位、应力等关键参数。</span>
          </div>
          <div class="info-row">
            <strong>全景图片：</strong>
            <div class="upload-box" onclick="this.handleImageUpload()">
              <span>📷 上传图片（≤10M）</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成项目信息内容
   */
  generateProjectInfo() {
    return `
      <div class="overview-card">
        <h3>项目信息</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>项目负责人：</strong>
            <span>张工程师</span>
          </div>
          <div class="info-row">
            <strong>联系电话：</strong>
            <span>138-0000-0000</span>
          </div>
          <div class="info-row">
            <strong>开始时间：</strong>
            <span>2024年1月1日</span>
          </div>
          <div class="info-row">
            <strong>预计结束：</strong>
            <span>2024年12月31日</span>
          </div>
          <div class="info-row">
            <strong>监测频率：</strong>
            <span>每2小时一次</span>
          </div>
          <div class="info-row">
            <strong>监测点数：</strong>
            <span>25个监测点</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成监控信息内容
   */
  generateMonitoringInfo() {
    return `
      <div class="monitoring-container">
        <!-- 顶部导航栏 -->
        <div class="monitoring-nav">
          <div class="nav-tabs">
            <button class="nav-tab">应变监测</button>
            <button class="nav-tab active">测点曲线</button>
          </div>
        </div>

        <!-- 筛选控制面板 -->
        <div class="filter-panel">
          <div class="filter-row">
            <div class="filter-group">
              <label>测点位置</label>
              <select class="filter-select">
                <option>请选择</option>
                <option>位置A</option>
                <option>位置B</option>
                <option>位置C</option>
              </select>
            </div>
            <div class="filter-group">
              <label>测点名称</label>
              <div class="filter-input-group">
                <input type="text" value="4HJWD" class="filter-input">
                <button class="clear-btn">×</button>
              </div>
            </div>
            <div class="filter-group">
              <label>数据量</label>
              <select class="filter-select">
                <option>500条</option>
                <option>1000条</option>
                <option>2000条</option>
              </select>
            </div>
          </div>
          
          <div class="filter-row">
            <div class="filter-group">
              <label>日期范围</label>
              <select class="filter-select">
                <option>请选择</option>
                <option>最近7天</option>
                <option>最近30天</option>
                <option>自定义</option>
              </select>
            </div>
            <div class="filter-group">
              <label>开始日期</label>
              <input type="date" class="filter-input">
            </div>
            <div class="filter-group">
              <label>结束日期</label>
              <input type="date" class="filter-input">
            </div>
            <div class="filter-group">
              <label>时段</label>
              <div class="time-inputs">
                <input type="time" class="filter-input" placeholder="开始时间">
                <input type="time" class="filter-input" placeholder="结束时间">
              </div>
            </div>
            <div class="filter-group">
              <label>按次</label>
              <select class="filter-select">
                <option>请选择</option>
                <option>第1次</option>
                <option>第2次</option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn-primary">Q查询</button>
            <button class="btn-secondary">浮出</button>
          </div>
        </div>

        <!-- 子导航和图表选项 -->
        <div class="chart-controls">
          <div class="sub-nav">
            <button class="sub-tab active">单点曲线</button>
            <button class="sub-tab">多点曲线</button>
            <button class="sub-tab">关联曲线</button>
            <button class="sub-tab">表格数据</button>
          </div>
          
          <div class="chart-settings">
            <div class="setting-group">
              <label>窗口展示</label>
              <div class="display-icons">
                <button class="icon-btn active">📊</button>
                <button class="icon-btn">📈</button>
                <button class="icon-btn">📉</button>
              </div>
            </div>
            <div class="setting-group">
              <label>告警线</label>
              <select class="setting-select">
                <option>请选择</option>
                <option>预警线</option>
                <option>报警线</option>
              </select>
            </div>
            <div class="setting-group">
              <label>数据处理</label>
              <select class="setting-select">
                <option>请选择</option>
                <option>平滑处理</option>
                <option>滤波处理</option>
              </select>
            </div>
          </div>

          <div class="chart-actions">
            <button class="btn-outline">更改曲线</button>
            <button class="btn-close">×</button>
          </div>
        </div>

        <!-- 图表显示区域 -->
        <div class="chart-container">
          <div class="chart-title">应变监测4HJWD过程曲线</div>
          <div class="chart-area">
            <div class="chart-wrapper">
              <canvas id="strainChart" class="chart"></canvas>
              <canvas id="temperatureChart" class="chart"></canvas>
            </div>
          </div>
          
          <!-- 分页控制 -->
          <div class="pagination">
            <button class="page-btn">‹</button>
            <span class="page-info">1</span>
            <button class="page-btn">›</button>
            <span class="page-text">前往</span>
            <input type="number" value="1" class="page-input">
            <span class="page-text">页</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成采集系统内容
   */
  generateCollectionSystem() {
    return `
      <div class="overview-card">
        <h3>采集系统</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>系统版本：</strong>
            <span>v2.1.3</span>
          </div>
          <div class="info-row">
            <strong>数据库状态：</strong>
            <span class="status-indicator online"></span>
            <span>正常</span>
          </div>
          <div class="info-row">
            <strong>存储空间：</strong>
            <span>已使用 2.3GB / 10GB</span>
          </div>
          <div class="info-row">
            <strong>网络状态：</strong>
            <span class="status-indicator online"></span>
            <span>连接正常</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成告警信息内容
   */
  generateAlertInfo() {
    return `
      <div class="overview-card">
        <h3>告警信息</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>今日告警：</strong>
            <span>0 条</span>
          </div>
          <div class="info-row">
            <strong>本周告警：</strong>
            <span>2 条</span>
          </div>
          <div class="info-row">
            <strong>未处理告警：</strong>
            <span>0 条</span>
          </div>
          <div class="info-row">
            <strong>告警阈值：</strong>
            <span>已设置</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成数据分析内容
   */
  generateDataAnalysis() {
    return `
      <div class="overview-card">
        <h3>数据分析</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>数据总量：</strong>
            <span>1,234,567 条记录</span>
          </div>
          <div class="info-row">
            <strong>分析模型：</strong>
            <span>机器学习预测模型</span>
          </div>
          <div class="info-row">
            <strong>预测准确率：</strong>
            <span>95.6%</span>
          </div>
          <div class="info-row">
            <strong>趋势分析：</strong>
            <span>稳定</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成数据管理内容
   */
  generateDataManagement() {
    return `
      <div class="overview-card">
        <h3>数据管理</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>数据备份：</strong>
            <span class="status-indicator online"></span>
            <span>自动备份已启用</span>
          </div>
          <div class="info-row">
            <strong>最后备份：</strong>
            <span>${Utils.formatTime()}</span>
          </div>
          <div class="info-row">
            <strong>数据导出：</strong>
            <span>支持Excel、CSV格式</span>
          </div>
          <div class="info-row">
            <strong>数据清理：</strong>
            <span>自动清理90天前数据</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成权限管理内容
   */
  generatePermissionManagement() {
    return `
      <div class="overview-card">
        <h3>权限管理</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>当前用户：</strong>
            <span>管理员</span>
          </div>
          <div class="info-row">
            <strong>用户权限：</strong>
            <span>完全访问权限</span>
          </div>
          <div class="info-row">
            <strong>登录时间：</strong>
            <span>${Utils.formatTime()}</span>
          </div>
          <div class="info-row">
            <strong>会话状态：</strong>
            <span class="status-indicator online"></span>
            <span>活跃</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 生成默认内容
   */
  generateDefaultContent(moduleName) {
    return `
      <div class="overview-card">
        <h3>${moduleName}</h3>
        <div class="project-info">
          <div class="info-row">
            <strong>状态：</strong>
            <span>该模块正在建设中...</span>
          </div>
          <div class="info-row">
            <strong>预计完成：</strong>
            <span>敬请期待</span>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 处理退出登录
   */
  handleLogout() {
    if (confirm('确定要退出登录吗？')) {
      // 清除本地存储
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("remember");
      
      // 显示退出消息
      this.showLogoutMessage();
      
      // 延迟跳转
      setTimeout(() => {
        window.location.href = 'login.html'; 
      }, 1500);
    }
  }

  /**
   * 显示退出消息
   */
  showLogoutMessage() {
    const message = document.createElement('div');
    message.className = 'logout-message';
    message.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--white);
        padding: 20px 40px;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        text-align: center;
      ">
        <h3 style="color: var(--primary-color); margin-bottom: 10px;">正在退出...</h3>
        <p style="color: var(--text-secondary);">感谢使用智能监测云平台</p>
      </div>
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      document.body.removeChild(message);
    }, 1500);
  }

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      this.userInfo.textContent = `管理员：${savedUsername}`;
    }
  }

  /**
   * 初始化仪表板
   */
  initializeDashboard() {
    // 设置默认内容
    this.updateContent(this.currentModule);
  }

  /**
   * 添加响应式处理
   */
  addResponsiveHandlers() {
    // 移动端菜单处理
    if (window.innerWidth <= 768) {
      this.handleMobileMenu();
    }
  }

  /**
   * 处理移动端菜单
   */
  handleMobileMenu() {
    const menu = document.querySelector('.menu');
    const sidebar = document.querySelector('.sidebar');
    
    // 添加移动端菜单切换按钮
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '☰';
    menuToggle.style.cssText = `
      display: none;
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      background: var(--primary-color);
      color: var(--white);
      border: none;
      padding: 10px;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
    `;
    
    if (window.innerWidth <= 768) {
      menuToggle.style.display = 'block';
    }
    
    document.body.appendChild(menuToggle);
    
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });
  }

  /**
   * 添加键盘导航
   */
  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Alt + 数字键快速切换菜单
      if (e.altKey && e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key) - 1;
        if (this.menuItems[index]) {
          this.handleMenuClick(e, this.menuItems[index]);
        }
      }
      
      // Escape键退出登录
      if (e.key === 'Escape') {
        this.handleLogout();
      }

      // 箭头键导航菜单
      if (e.target.closest('.menu')) {
        this.handleMenuNavigation(e);
      }
    });

    // 为菜单项添加键盘支持
    this.menuItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleMenuClick(e, item);
        }
      });
    });
  }

  /**
   * 处理菜单导航
   */
  handleMenuNavigation(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.currentMenuItemIndex = Math.min(this.currentMenuItemIndex + 1, this.menuItems.length - 1);
        this.menuItems[this.currentMenuItemIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.currentMenuItemIndex = Math.max(this.currentMenuItemIndex - 1, 0);
        this.menuItems[this.currentMenuItemIndex].focus();
        break;
      case 'Home':
        e.preventDefault();
        this.currentMenuItemIndex = 0;
        this.menuItems[this.currentMenuItemIndex].focus();
        break;
      case 'End':
        e.preventDefault();
        this.currentMenuItemIndex = this.menuItems.length - 1;
        this.menuItems[this.currentMenuItemIndex].focus();
        break;
    }
  }

  /**
   * 处理窗口大小变化
   */
  handleResize() {
    this.addResponsiveHandlers();
  }

  /**
   * 处理页面可见性变化
   */
  handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      // 页面重新可见时刷新数据
      this.refreshData();
    }
  }

  /**
   * 刷新数据
   */
  refreshData() {
    // 这里可以添加数据刷新逻辑
    console.log('刷新数据...');
  }

  /**
   * 内容变化动画
   */
  animateContentChange() {
    this.dashboardContent.style.transition = 'all 0.3s ease-in-out';
  }

  /**
   * 更新页面标题
   */
  updatePageTitle(moduleName) {
    document.title = `智能监测云 - ${moduleName}`;
  }

  /**
   * 处理图片上传
   */
  handleImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('文件大小不能超过10MB');
          return;
        }
        
        // 这里可以添加上传逻辑
        console.log('上传文件:', file.name);
        alert('图片上传功能开发中...');
      }
    });
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  }

  /**
   * 初始化监控信息功能
   */
  initializeMonitoringFeatures() {
    // 绑定导航切换事件
    this.bindNavigationEvents();
    
    // 初始化图表
    this.initializeCharts();
    
    // 绑定筛选事件
    this.bindFilterEvents();
    
    // 初始化实时数据更新
    this.initRealTimeData();
    
    // 初始化告警系统
    this.initAlertSystem();
  }

  /**
   * 绑定导航切换事件
   */
  bindNavigationEvents() {
    // 主导航切换
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-tab')) {
        this.switchMainTab(e.target);
      }
      
      if (e.target.classList.contains('sub-tab')) {
        this.switchSubTab(e.target);
      }
    });

    // 窗口展示图标切换
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('icon-btn')) {
        this.switchDisplayMode(e.target);
      }
    });

    // 清除按钮
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('clear-btn')) {
        this.clearInput(e.target);
      }
    });
  }

  /**
   * 切换主导航标签
   */
  switchMainTab(clickedTab) {
    // 移除所有活动状态
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // 添加活动状态
    clickedTab.classList.add('active');
    
    // 根据标签切换内容
    const tabText = clickedTab.textContent.trim();
    if (tabText === '应变监测') {
      this.showStrainMonitoring();
    } else if (tabText === '测点曲线') {
      this.showCurveAnalysis();
    }
  }

  /**
   * 切换子导航标签
   */
  switchSubTab(clickedTab) {
    // 移除所有活动状态
    document.querySelectorAll('.sub-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // 添加活动状态
    clickedTab.classList.add('active');
    
    // 根据标签切换显示
    const tabText = clickedTab.textContent.trim();
    this.updateChartDisplay(tabText);
  }

  /**
   * 切换显示模式
   */
  switchDisplayMode(clickedIcon) {
    // 移除所有活动状态
    document.querySelectorAll('.icon-btn').forEach(icon => {
      icon.classList.remove('active');
    });
    
    // 添加活动状态
    clickedIcon.classList.add('active');
    
    // 根据图标切换布局
    const iconText = clickedIcon.textContent;
    this.changeChartLayout(iconText);
  }

  /**
   * 清除输入框
   */
  clearInput(clearBtn) {
    const inputGroup = clearBtn.closest('.filter-input-group');
    const input = inputGroup.querySelector('.filter-input');
    input.value = '';
    input.focus();
  }

  /**
   * 显示应变监测
   */
  showStrainMonitoring() {
    console.log('切换到应变监测模式');
    // 这里可以添加应变监测的具体内容
  }

  /**
   * 显示曲线分析
   */
  showCurveAnalysis() {
    console.log('切换到测点曲线模式');
    // 这里可以添加曲线分析的具体内容
  }

  /**
   * 更新图表显示
   */
  updateChartDisplay(mode) {
    console.log('更新图表显示模式:', mode);
    
    const chartTitle = document.querySelector('.chart-title');
    if (chartTitle) {
      switch (mode) {
        case '单点曲线':
          chartTitle.textContent = '应变监测4HJWD过程曲线';
          break;
        case '多点曲线':
          chartTitle.textContent = '多点应变监测对比曲线';
          break;
        case '关联曲线':
          chartTitle.textContent = '应变温度关联分析曲线';
          break;
        case '表格数据':
          chartTitle.textContent = '监测数据表格';
          break;
      }
    }
  }

  /**
   * 改变图表布局
   */
  changeChartLayout(layout) {
    console.log('改变图表布局:', layout);
    
    const charts = document.querySelectorAll('.chart');
    charts.forEach(chart => {
      chart.style.display = 'block';
    });
    
    // 根据布局模式调整显示
    switch (layout) {
      case '📊': // 单视图
        charts[1].style.display = 'none';
        break;
      case '📈': // 并排视图
        // 保持默认显示
        break;
      case '📉': // 网格视图
        // 可以添加网格布局逻辑
        break;
    }
  }

  /**
   * 初始化图表
   */
  initializeCharts() {
    // 模拟图表数据
    this.createMockCharts();
  }

  /**
   * 创建模拟图表
   */
  createMockCharts() {
    const strainChart = document.getElementById('strainChart');
    const temperatureChart = document.getElementById('temperatureChart');
    
    if (strainChart && temperatureChart) {
      // 创建应变图表
      this.drawStrainChart(strainChart);
      
      // 创建温度图表
      this.drawTemperatureChart(temperatureChart);
    }
  }

  /**
   * 绘制应变图表
   */
  drawStrainChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景网格
    this.drawGrid(ctx, width, height, '#f0f0f0');
    
    // 绘制Y轴标签
    this.drawYAxisLabels(ctx, height, [-600, -300, 0, 300, 600], '应变变化值(με)');
    
    // 绘制X轴标签
    this.drawXAxisLabels(ctx, width, height, [
      '2025-07-04 17:59',
      '2025-07-08 10:00',
      '2025-07-12 02:00',
      '2025-07-16 18:00',
      '2025-07-20 14:00',
      '2025-07-24 10:00'
    ]);
    
    // 绘制应变数据曲线
    this.drawDataLine(ctx, width, height, this.generateStrainData(), '#0066cc', 2);
  }

  /**
   * 绘制温度图表
   */
  drawTemperatureChart(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景网格
    this.drawGrid(ctx, width, height, '#f0f0f0');
    
    // 绘制Y轴标签
    this.drawYAxisLabels(ctx, height, [-100, -50, 0, 50, 100, 150], '温度(℃)');
    
    // 绘制X轴标签
    this.drawXAxisLabels(ctx, width, height, [
      '2025-07-04 17:59',
      '2025-07-08 10:00',
      '2025-07-12 02:00',
      '2025-07-16 18:00',
      '2025-07-20 14:00',
      '2025-07-24 10:00'
    ]);
    
    // 绘制温度数据曲线
    this.drawDataLine(ctx, width, height, this.generateTemperatureData(), '#ffcc00', 2);
  }

  /**
   * 绘制网格
   */
  drawGrid(ctx, width, height, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // 绘制水平网格线
    for (let i = 0; i <= 6; i++) {
      const y = (height / 6) * i;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();
    }
    
    // 绘制垂直网格线
    for (let i = 0; i <= 6; i++) {
      const x = 60 + ((width - 80) / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height - 20);
      ctx.stroke();
    }
  }

  /**
   * 绘制Y轴标签
   */
  drawYAxisLabels(ctx, height, labels, title) {
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    
    // 绘制标题
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(title, 0, 0);
    ctx.restore();
    
    // 绘制标签
    ctx.textAlign = 'right';
    labels.forEach((label, index) => {
      const y = (height / (labels.length - 1)) * index;
      ctx.fillText(label.toString(), 50, y + 4);
    });
  }

  /**
   * 绘制X轴标签
   */
  drawXAxisLabels(ctx, width, height, labels) {
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
      const x = 60 + ((width - 80) / (labels.length - 1)) * index;
      ctx.fillText(label, x, height - 5);
    });
  }

  /**
   * 绘制数据线
   */
  drawDataLine(ctx, width, height, data, color, lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = 60 + ((width - 80) / (data.length - 1)) * index;
      const y = height - 20 - (point / 600) * (height - 40); // 应变数据范围 -600 到 600
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
  }

  /**
   * 生成应变数据
   */
  generateStrainData() {
    const data = [];
    for (let i = 0; i < 50; i++) {
      // 生成模拟应变数据，范围在 -100 到 150 之间
      const value = Math.sin(i * 0.2) * 100 + Math.random() * 50 - 25;
      data.push(value);
    }
    return data;
  }

  /**
   * 生成温度数据
   */
  generateTemperatureData() {
    const data = [];
    for (let i = 0; i < 50; i++) {
      // 生成模拟温度数据，范围在 20 到 50 之间
      const value = Math.sin(i * 0.15) * 15 + 35 + Math.random() * 10 - 5;
      data.push(value);
    }
    return data;
  }

  /**
   * 绑定筛选事件
   */
  bindFilterEvents() {
    // 查询按钮
    document.addEventListener('click', (e) => {
      if (e.target.textContent === 'Q查询') {
        this.handleQuery();
      }
    });

    // 浮出按钮
    document.addEventListener('click', (e) => {
      if (e.target.textContent === '浮出') {
        this.handleFloatOut();
      }
    });
  }

  /**
   * 处理查询
   */
  handleQuery() {
    console.log('执行查询操作');
    // 这里可以添加实际的查询逻辑
    this.refreshCharts();
  }

  /**
   * 处理浮出
   */
  handleFloatOut() {
    console.log('浮出图表');
    // 这里可以添加浮出窗口的逻辑
    this.showFloatWindow();
  }

  /**
   * 显示浮出窗口
   */
  showFloatWindow() {
    // 创建浮出窗口
    const floatWindow = document.createElement('div');
    floatWindow.className = 'float-window';
    floatWindow.innerHTML = `
      <div class="float-header">
        <h3>应变监测4HJWD过程曲线</h3>
        <button class="close-float">×</button>
      </div>
      <div class="float-content">
        <canvas id="floatChart" width="800" height="400"></canvas>
      </div>
    `;
    
    floatWindow.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      z-index: 1000;
      padding: 20px;
    `;
    
    document.body.appendChild(floatWindow);
    
    // 绑定关闭事件
    floatWindow.querySelector('.close-float').addEventListener('click', () => {
      document.body.removeChild(floatWindow);
    });
    
    // 在浮出窗口中绘制图表
    setTimeout(() => {
      const floatChart = document.getElementById('floatChart');
      if (floatChart) {
        this.drawStrainChart(floatChart);
      }
    }, 100);
  }

  /**
   * 刷新图表
   */
  refreshCharts() {
    console.log('刷新图表数据');
    this.createMockCharts();
  }

  /**
   * 初始化实时数据更新
   */
  initRealTimeData() {
    // 模拟实时数据更新
    this.dataUpdateInterval = setInterval(() => {
      this.updateRealTimeData();
    }, 5000); // 每5秒更新一次数据
  }

  /**
   * 更新实时数据
   */
  updateRealTimeData() {
    // 更新图表数据
    if (document.getElementById('strainChart') && document.getElementById('temperatureChart')) {
      this.refreshCharts();
    }

    // 更新状态指示器
    this.updateStatusIndicators();
    
    // 更新统计信息
    this.updateStatistics();
  }

  /**
   * 更新状态指示器
   */
  updateStatusIndicators() {
    const indicators = document.querySelectorAll('.status-indicator');
    indicators.forEach(indicator => {
      // 模拟状态变化
      const isOnline = Math.random() > 0.1; // 90% 概率在线
      indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
    });
  }

  /**
   * 更新统计信息
   */
  updateStatistics() {
    // 更新项目概览中的动态数据
    const statusElements = document.querySelectorAll('.info-row span');
    statusElements.forEach(element => {
      if (element.textContent.includes('运行中') || element.textContent.includes('正常')) {
        // 保持状态不变，但可以添加闪烁效果
        element.style.animation = 'pulse 2s ease-in-out infinite';
        setTimeout(() => {
          element.style.animation = '';
        }, 2000);
      }
    });
  }

  /**
   * 初始化告警系统
   */
  initAlertSystem() {
    // 模拟告警检查
    this.alertCheckInterval = setInterval(() => {
      this.checkAlerts();
    }, 10000); // 每10秒检查一次告警
  }

  /**
   * 检查告警
   */
  checkAlerts() {
    // 模拟告警逻辑
    const alertProbability = 0.05; // 5% 概率产生告警
    
    if (Math.random() < alertProbability) {
      this.showAlert();
    }
  }

  /**
   * 显示告警
   */
  showAlert() {
    const alertTypes = [
      { type: 'warning', message: '监测点A数据异常', level: 'warning' },
      { type: 'error', message: '传感器连接中断', level: 'danger' },
      { type: 'info', message: '数据采集正常', level: 'info' }
    ];

    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    // 创建告警通知
    const alert = document.createElement('div');
    alert.className = `alert-notification alert-${randomAlert.level}`;
    alert.innerHTML = `
      <div class="alert-content">
        <span class="alert-icon">${this.getAlertIcon(randomAlert.type)}</span>
        <span class="alert-message">${randomAlert.message}</span>
        <button class="alert-close">×</button>
      </div>
    `;

    // 添加样式
    alert.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${this.getAlertColor(randomAlert.level)};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: slideInRight 0.3s ease-out;
      max-width: 300px;
    `;

    document.body.appendChild(alert);

    // 自动消失
    setTimeout(() => {
      alert.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    }, 5000);

    // 关闭按钮事件
    alert.querySelector('.alert-close').addEventListener('click', () => {
      alert.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert);
        }
      }, 300);
    });
  }

  /**
   * 获取告警图标
   */
  getAlertIcon(type) {
    const icons = {
      warning: '⚠️',
      error: '🚨',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * 获取告警颜色
   */
  getAlertColor(level) {
    const colors = {
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#17a2b8',
      success: '#28a745'
    };
    return colors[level] || '#17a2b8';
  }

  /**
   * 添加更多数据可视化组件
   */
  addDataVisualizationComponents() {
    // 在监控信息页面添加更多图表类型
    if (this.currentModule === '监控信息') {
      this.addGaugeChart();
      this.addHeatmapChart();
      this.addTrendChart();
    }
  }

  /**
   * 添加仪表盘图表
   */
  addGaugeChart() {
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'gauge-container';
    gaugeContainer.innerHTML = `
      <div class="gauge-title">实时监测状态</div>
      <div class="gauges-grid">
        <div class="gauge-item">
          <div class="gauge-chart" id="strainGauge"></div>
          <div class="gauge-label">应变监测</div>
        </div>
        <div class="gauge-item">
          <div class="gauge-chart" id="temperatureGauge"></div>
          <div class="gauge-label">温度监测</div>
        </div>
        <div class="gauge-item">
          <div class="gauge-chart" id="pressureGauge"></div>
          <div class="gauge-label">压力监测</div>
        </div>
      </div>
    `;

    // 插入到图表区域
    const chartArea = document.querySelector('.chart-area');
    if (chartArea) {
      chartArea.appendChild(gaugeContainer);
      this.drawGaugeCharts();
    }
  }

  /**
   * 绘制仪表盘图表
   */
  drawGaugeCharts() {
    const gauges = [
      { id: 'strainGauge', value: 75, max: 100, color: '#0b67ff', label: '应变值' },
      { id: 'temperatureGauge', value: 45, max: 60, color: '#28a745', label: '温度值' },
      { id: 'pressureGauge', value: 60, max: 80, color: '#ffc107', label: '压力值' }
    ];

    gauges.forEach(gauge => {
      const element = document.getElementById(gauge.id);
      if (element) {
        this.createGauge(element, gauge.value, gauge.max, gauge.color, gauge.label);
      }
    });
  }

  /**
   * 创建单个仪表盘
   */
  createGauge(element, value, max, color, label) {
    const canvas = document.createElement('canvas');
    canvas.width = 150;
    canvas.height = 150;
    element.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 60;

    // 绘制背景弧
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 20;
    ctx.stroke();

    // 绘制值弧
    const percentage = value / max;
    const angle = Math.PI + (percentage * Math.PI);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, angle);
    ctx.strokeStyle = color;
    ctx.lineWidth = 20;
    ctx.stroke();

    // 绘制数值文本
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(value, centerX, centerY + 8);

    // 绘制标签
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666';
    ctx.fillText(label, centerX, centerY + 30);
  }

  /**
   * 添加热力图
   */
  addHeatmapChart() {
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container';
    heatmapContainer.innerHTML = `
      <div class="heatmap-title">监测点热力图</div>
      <div class="heatmap-grid" id="heatmapGrid"></div>
    `;

    const chartArea = document.querySelector('.chart-area');
    if (chartArea) {
      chartArea.appendChild(heatmapContainer);
      this.drawHeatmap();
    }
  }

  /**
   * 绘制热力图
   */
  drawHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;

    // 创建5x5网格
    for (let i = 0; i < 25; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      
      // 随机生成热度值
      const intensity = Math.random();
      cell.style.background = `rgba(11, 103, 255, ${intensity})`;
      cell.style.opacity = 0.3 + intensity * 0.7;
      
      // 添加悬停效果
      cell.addEventListener('mouseenter', () => {
        cell.style.transform = 'scale(1.1)';
        cell.style.zIndex = '10';
      });
      
      cell.addEventListener('mouseleave', () => {
        cell.style.transform = 'scale(1)';
        cell.style.zIndex = '1';
      });

      grid.appendChild(cell);
    }
  }

  /**
   * 清理定时器
   */
  cleanup() {
    if (this.dataUpdateInterval) {
      clearInterval(this.dataUpdateInterval);
    }
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
    }
  }
}

/**
 * 工具函数
 */
const Utils = {
  /**
   * 防抖函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 格式化时间
   */
  formatTime(date = new Date()) {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};

/**
 * 页面加载完成后初始化
 */
document.addEventListener("DOMContentLoaded", function() {
  // 初始化首页管理器
  const homeManager = new HomeManager();
  
  // 添加全局错误处理
  window.addEventListener('error', (e) => {
    console.error('页面错误:', e.error);
  });
  
  // 添加未处理的Promise拒绝处理
  window.addEventListener('unhandledrejection', (e) => {
    console.error('未处理的Promise拒绝:', e.reason);
  });

  // 页面卸载时清理资源
  window.addEventListener('beforeunload', () => {
    homeManager.cleanup();
  });

  // 页面隐藏时暂停更新，显示时恢复
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      homeManager.cleanup();
    } else if (document.visibilityState === 'visible') {
      if (homeManager.currentModule === '监控信息') {
        homeManager.initRealTimeData();
        homeManager.initAlertSystem();
      }
    }
  });

  console.log('智能监测云平台首页已加载完成');
});