document.addEventListener('DOMContentLoaded', function() {
    //为导航按钮添加点效果
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            //添加点击波纹效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(11, 103, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                anmination: ripple-effect 600ms ease-out;
                pointer-events: none;
            `;
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    //添加统计数字动画
    const statNumbers = document.querySelectorAll('.stat-number');
    constobserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                anmimateNumber(target,finalValue);
                observer.unobserve(target);
            }
        });
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });

    //添加功能卡片悬停效果
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translate(8px) scale(1)' ;
        });
    });
});

//数字动画函数
function animateNumber(element, finalValue) {
    const isPercentage = finalValue.includes('%');
    const isPlus = finalValue.includes('+');
    const isSlash = finalValue.includes('/');

    letnumericValue;
    if (isPercentage) {
        numericValue = parseFloat(finalValue);
    }else if (isPlus) {
        numericValue = parseInt(finalValue);
    }else if (isSlash) {
        numericValue = finalValue; //保持原样
    }else {
        numericValue = parseInt(finalValue);
    }

    if (typeof numericValue === 'number') {
        let current = 0;
        const increment = numericValue / 50; //动画步长
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                current = numericValue;
                clearInterval(timer);
            }

            if (isPercentage) {
                element.textContent = current.toFixed(1) + '%';
            }else if (isPlus) {
                element.textContent = Math.floor(current) + '+';
            }else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
}

//添加CSS动画
const style = document.createElement('style');
style.textContent = `
@keyframes ripple-effect {
    to {
        transform: scale(2);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);




