// Hàm lấy tham số từ URL
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    const container = document.querySelector('.product-detail-container');
    container.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem;">
            <h2 style="color: #ff3300; margin-bottom: 1rem;">Có lỗi xảy ra</h2>
            <p style="margin-bottom: 1rem;">${message}</p>
            <a href="/Cuongsac/" style="display: inline-block; padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px;">Về trang chủ</a>
        </div>
    `;
}

// Hàm hiển thị sản phẩm liên quan
function loadRelatedProducts(currentProduct, allProducts) {
    // Lọc các sản phẩm cùng danh mục với sản phẩm hiện tại, loại bỏ sản phẩm hiện tại
    const relatedProducts = allProducts
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4); // Lấy tối đa 4 sản phẩm

    // Nếu không đủ 4 sản phẩm cùng danh mục, thêm các sản phẩm khác
    if (relatedProducts.length < 4) {
        const otherProducts = allProducts
            .filter(p => p.category !== currentProduct.category && p.id !== currentProduct.id)
            .slice(0, 4 - relatedProducts.length);
        
        relatedProducts.push(...otherProducts);
    }

    const relatedProductsContainer = document.getElementById('related-products-container');
    
    // Xóa skeleton loading
    relatedProductsContainer.innerHTML = '';

    // Hiển thị sản phẩm liên quan
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'related-product-card';
        
        productCard.innerHTML = `
            <div class="related-product-image">
                <span class="related-product-discount">-${product.discountPercent}%</span>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="related-product-info">
                <h3 class="related-product-title">
                    <a href="/Cuongsac/pages/products/product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="related-product-price">
                    <span class="related-product-current-price">${formatPrice(product.currentPrice)}</span>
                    <span class="related-product-original-price">${formatPrice(product.originalPrice)}</span>
                </div>
            </div>
        `;
        
        relatedProductsContainer.appendChild(productCard);
    });
}

// Hàm tải và hiển thị thông tin sản phẩm
async function loadProductDetails() {
    try {
        // Lấy ID sản phẩm từ URL
        const productId = getUrlParameter('id');
        if (!productId) {
            throw new Error('Vui lòng chọn một sản phẩm từ trang chủ hoặc danh mục sản phẩm');
        }

        // Tải dữ liệu sản phẩm từ API hoặc file JSON
        const response = await fetch('/Cuongsac/assets/data/products.json');
        if (!response.ok) {
            throw new Error(`Lỗi HTTP: ${response.status}`);
        }
        const products = await response.json();

        // Tìm sản phẩm theo ID
        const product = products.find(p => p.id === productId);
        if (!product) {
            throw new Error('Không tìm thấy thông tin sản phẩm này');
        }

        // Cập nhật tiêu đề trang
        document.title = `${product.name} - Cuồng Sạc`;

        // Cập nhật thông tin sản phẩm trên trang
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-title').textContent = product.name;
        document.getElementById('product-brand').textContent = product.brand;
        document.getElementById('main-product-image').src = product.image;
        document.getElementById('main-product-image').alt = product.name;
        document.getElementById('product-current-price').textContent = formatPrice(product.currentPrice);
        document.getElementById('product-original-price').textContent = formatPrice(product.originalPrice);
        
        // Hiển thị phần trăm giảm giá từ dữ liệu JSON
        document.getElementById('discount-corner').textContent = `-${product.discountPercent}%`;
        document.getElementById('product-discount').textContent = `-${product.discountPercent}%`;

        // Hiển thị tình trạng hàng
        const statusElement = document.getElementById('product-status');
        if (product.inStock) {
            statusElement.textContent = 'Còn hàng';
            statusElement.classList.add('in-stock');
            statusElement.classList.remove('out-of-stock');
        } else {
            statusElement.textContent = 'Hết hàng';
            statusElement.classList.remove('in-stock');
            statusElement.classList.add('out-of-stock');
        }

        // Cập nhật thông số kỹ thuật
        if (product.specifications) {
            document.getElementById('capacity').textContent = product.specifications.capacity || 'N/A';
            document.getElementById('power').textContent = product.specifications.power || 'N/A';
            document.getElementById('input-port').textContent = product.specifications.inputPort || 'N/A';
            document.getElementById('output-port').textContent = product.specifications.outputPort || 'N/A';
            document.getElementById('charging-tech').textContent = product.specifications.chargingTech || 'N/A';
        }

        // Cập nhật mô tả sản phẩm
        document.getElementById('product-description-content').innerHTML = product.description;

        // Cập nhật breadcrumb category
        document.getElementById('product-category').textContent = product.category;
        document.getElementById('product-category').href = `/Cuongsac/pages/categories/${product.categorySlug}`;
        
        // Hiển thị sản phẩm liên quan
        loadRelatedProducts(product, products);

    } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        showError(error.message);
    }
}

// Xử lý tăng giảm số lượng
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');

    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
            quantityInput.value = currentValue + 1;
        }
    });

    // Xử lý sự kiện mua ngay
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const productId = getUrlParameter('id');
            const quantity = parseInt(quantityInput.value);
            
            // Kiểm tra sản phẩm có tồn tại không
            if (!productId) {
                showToast('Sản phẩm không tồn tại', 'error');
                return;
            }
            
            // Kiểm tra trạng thái còn hàng
            const statusElement = document.getElementById('product-status');
            if (statusElement.classList.contains('out-of-stock')) {
                showToast('Sản phẩm đã hết hàng', 'error');
                return;
            }

            // Mô phỏng chuyển đến trang thanh toán (sẽ được thay thế bằng API thực tế sau)
            showToast('Đang chuyển đến trang thanh toán...', 'info');
            setTimeout(() => {
                // Chuyển đến trang thanh toán (giả lập)
                alert('Chức năng thanh toán đang được phát triển');
            }, 1500);
        });
    }

    // Tải thông tin sản phẩm khi trang được load
    loadProductDetails();
});

// Hàm hiển thị thông báo toast
function showToast(message, type = 'info') {
    // Tạo toast container nếu chưa tồn tại
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Tạo toast notification
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    
    // Tạo icon dựa vào loại thông báo
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-bell"></i>';
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    
    // Thêm toast vào container
    toastContainer.appendChild(toast);
    
    // Auto close sau 3 giây
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
    
    // Xử lý nút đóng
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
} 