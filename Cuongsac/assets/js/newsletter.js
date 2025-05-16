document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-form .input-group');
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const submitButton = newsletterForm.querySelector('button');

    // Tạo tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'email-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <i class="fas fa-exclamation-circle"></i>
            <span>Vui lòng điền email của bạn</span>
        </div>
    `;
    newsletterForm.appendChild(tooltip);

    // Thêm styles cho tooltip và các trạng thái
    const style = document.createElement('style');
    style.textContent = `
        .newsletter-form .input-group {
            position: relative;
        }
        .email-tooltip {
            position: absolute;
            top: -45px;
            left: 0;
            background: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            display: none;
            z-index: 100;
            animation: tooltipFadeIn 0.3s ease;
        }
        .email-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 15px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #fff;
        }
        .tooltip-content {
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
        }
        .tooltip-content i {
            color: #ff3300;
        }
        @keyframes tooltipFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .newsletter-form .input-group input.error {
            border: 2px solid #ff3300;
        }
    `;
    document.head.appendChild(style);

    // Hàm validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    // Hàm hiển thị tooltip
    function showTooltip(message) {
        tooltip.querySelector('span').textContent = message;
        tooltip.style.display = 'block';
        emailInput.classList.add('error');
    }

    // Hàm ẩn tooltip
    function hideTooltip() {
        tooltip.style.display = 'none';
        emailInput.classList.remove('error');
    }

    // Xử lý sự kiện click vào nút đăng ký
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Reset trạng thái
        hideTooltip();

        // Validate email
        if (!email) {
            showTooltip('Vui lòng điền email của bạn');
            return;
        }

        if (!validateEmail(email)) {
            showTooltip('Email không hợp lệ');
            return;
        }

        // Giả lập gửi request đến server
        submitButton.disabled = true;
        submitButton.textContent = 'LOADING...';

        setTimeout(() => {
            alert('Đăng ký nhận bản tin thành công! Cảm ơn bạn đã quan tâm đến Cuồng Sạc');
            emailInput.value = '';
            submitButton.disabled = false;
            submitButton.textContent = 'ĐĂNG KÝ';
        }, 1500);
    });

    // Xử lý sự kiện input để reset trạng thái lỗi
    emailInput.addEventListener('input', function() {
        hideTooltip();
    });

    // Ẩn tooltip khi click ra ngoài
    document.addEventListener('click', function(e) {
        if (!newsletterForm.contains(e.target)) {
            hideTooltip();
        }
    });
}); 