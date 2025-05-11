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

// Lấy danh mục sản phẩm từ URL hoặc mặc định là power-banks
let currentCategory = 'power-banks';

// Biến lưu trữ thông tin sắp xếp hiện tại
let currentSortOption = 'default';

// Hàm xử lý lỗi khi ảnh không tải được
function handleImageError(img) {
    console.error('Không thể tải ảnh:', img.src);
    img.src = '/Cuongsac/assets/images/logo.png';
    img.classList.add('image-error');
}

// Hàm đảm bảo tỷ lệ chuẩn cho ảnh
function handleImageLoad(img) {
    // Xóa các class lỗi nếu có
    img.classList.remove('image-error');
    
    // Đảm bảo ảnh lấp đầy khung hiển thị
    img.style.objectFit = 'cover';
    img.style.width = '100%';
    img.style.height = '100%';
    
    // Thêm hiệu ứng mờ nhẹ cho ảnh nền (nếu cần)
    const container = img.closest('.product-image');
    if (container) {
        // Đảm bảo ảnh căn giữa theo tỷ lệ thích hợp
        container.style.overflow = 'hidden';
    }
}

// Hàm sắp xếp sản phẩm dựa trên tùy chọn
function sortProducts(products, sortOption) {
    let sortedProducts = [...products]; // Tạo bản sao để không ảnh hưởng đến dữ liệu gốc
    
    switch(sortOption) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Giữ nguyên thứ tự mặc định
            break;
    }
    
    return sortedProducts;
}

// Lấy dữ liệu sản phẩm và render ra trang danh mục
async function loadCategoryProducts() {
    try {
        // Hiển thị trạng thái loading
        const productContainer = document.getElementById('category-products');
        
        // Lấy dữ liệu từ file JSON
        const response = await fetch('/Cuongsac/assets/data/products.json');
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu sản phẩm');
        }
        const products = await response.json();
        
        // Lọc sản phẩm theo danh mục
        let categoryProducts = products.filter(product => product.categorySlug === currentCategory);
        
        // Sắp xếp sản phẩm theo tùy chọn hiện tại
        categoryProducts = sortProducts(categoryProducts, currentSortOption);
        
        // Xóa skeleton loading
        productContainer.innerHTML = '';
        
        // Nếu không có sản phẩm nào, hiển thị thông báo
        if (categoryProducts.length === 0) {
            productContainer.innerHTML = `
                <div class="no-products">
                    <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
                </div>
            `;
            return;
        }
        
        // Render sản phẩm ra trang
        categoryProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            // Xác định trạng thái hết hàng
            const stockStatus = product.inStock 
                ? '' 
                : '<div class="out-of-stock-badge">Hết hàng</div>';
            
            // Lấy đường dẫn ảnh từ sản phẩm
            const imagePath = product.image;
            
            productCard.innerHTML = `
                <div class="product-image">
                    ${stockStatus}
                    <img src="${imagePath}" alt="${product.name}" onerror="handleImageError(this);" onload="handleImageLoad(this);">
                </div>
                <div class="product-info">
                    <h3 class="product-title">
                        <a href="/Cuongsac/pages/products/product-detail.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-price">
                        <div class="price-row">
                            <span class="current-price">${formatPrice(product.currentPrice)}</span>
                            <span class="discount-badge">-${product.discountPercent}%</span>
                        </div>
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <button class="add-to-cart-btn" ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        <span>${product.inStock ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}</span>
                    </button>
                </div>
            `;
            
            productContainer.appendChild(productCard);
        });
        
        // Đảm bảo tất cả ảnh đều có xử lý lỗi và tải
        const productImages = document.querySelectorAll('.product-image img');
        productImages.forEach(img => {
            img.addEventListener('error', function() {
                handleImageError(this);
            });
            img.addEventListener('load', function() {
                handleImageLoad(this);
            });
        });
        
        // Thêm sự kiện cho các nút "Thêm vào giỏ"
        setupAddToCartButtons();
        
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu sản phẩm:', error);
        const productContainer = document.getElementById('category-products');
        productContainer.innerHTML = `
            <div class="error-message">
                <p>Đã xảy ra lỗi khi tải dữ liệu sản phẩm. Vui lòng thử lại sau.</p>
            </div>
        `;
    }
}

// Hàm thiết lập sự kiện cho các nút "Thêm vào giỏ"
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        // Bỏ qua các nút đã bị vô hiệu hóa (hết hàng)
        if (button.hasAttribute('disabled')) return;
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Lấy thông tin sản phẩm
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title a').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productLink = productCard.querySelector('.product-title a').getAttribute('href');
            const productId = productLink.split('id=')[1];
            
            // Thêm vào giỏ hàng
            addToCart(productId, productTitle, productPrice);
            
            // Hiển thị thông báo
            showToast('Đã thêm vào giỏ hàng');
        });
    });
}

// Hàm setup dropdown menu sắp xếp
function setupSortDropdown() {
    // Xác định các tùy chọn sắp xếp
    const sortOptions = [
        { value: 'default', text: 'Mặc định' },
        { value: 'price-asc', text: 'Giá tăng dần' },
        { value: 'price-desc', text: 'Giá giảm dần' },
        { value: 'name-asc', text: 'Tên A-Z' },
        { value: 'name-desc', text: 'Tên Z-A' }
    ];
    
    // Tìm phần tử filter-options
    const filterOptions = document.querySelector('.filter-options');
    if (!filterOptions) return;
    
    // Xóa select cũ nếu có
    const oldSortBy = filterOptions.querySelector('.sort-by');
    if (oldSortBy) {
        filterOptions.removeChild(oldSortBy);
    }
    
    // Tạo phần tử sort-dropdown mới
    const sortDropdown = document.createElement('div');
    sortDropdown.className = 'sort-by sort-dropdown';
    
    // Tạo button dropdown
    const dropdownButton = document.createElement('button');
    dropdownButton.className = 'sort-dropdown-button';
    dropdownButton.textContent = 'Sắp xếp: ' + (sortOptions.find(opt => opt.value === currentSortOption)?.text || 'Mặc định');
    sortDropdown.appendChild(dropdownButton);
    
    // Tạo nội dung dropdown
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'sort-dropdown-content';
    
    // Thêm các tùy chọn sắp xếp
    sortOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'sort-dropdown-option';
        if (option.value === currentSortOption) {
            optionElement.classList.add('active');
        }
        optionElement.textContent = option.text;
        optionElement.dataset.value = option.value;
        
        optionElement.addEventListener('click', function() {
            // Cập nhật tùy chọn sắp xếp hiện tại
            currentSortOption = this.dataset.value;
            
            // Cập nhật text trên button
            dropdownButton.textContent = 'Sắp xếp: ' + this.textContent;
            
            // Đóng dropdown
            dropdownContent.classList.remove('show');
            
            // Tải lại sản phẩm với bộ lọc mới
            loadCategoryProducts();
            
            // Cập nhật trạng thái active
            document.querySelectorAll('.sort-dropdown-option').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
        });
        
        dropdownContent.appendChild(optionElement);
    });
    
    sortDropdown.appendChild(dropdownContent);
    
    // Thêm sự kiện click cho button để hiển thị/ẩn dropdown
    dropdownButton.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
    });
    
    // Thêm sự kiện click outside để đóng dropdown
    document.addEventListener('click', function(e) {
        if (!sortDropdown.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });
    
    // Thêm dropdown vào filter-options
    filterOptions.appendChild(sortDropdown);
}

// Khi trang đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // Setup dropdown sắp xếp
    setupSortDropdown();
    
    // Tải sản phẩm
    loadCategoryProducts();
    
    // Bắt lỗi cho tất cả ảnh trong trang
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        img.addEventListener('load', function() {
            handleImageLoad(this);
        });
    });
}); 