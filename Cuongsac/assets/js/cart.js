// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Cart.js đã được nạp");
    
    // Cart data structure
    let cart = {
        items: [],
        totalPrice: 0
    };

    // DOM Elements
    const cartPopup = document.getElementById('cart-popup');
    const cartPopupItems = document.querySelector('.cart-popup-items');
    const cartPopupTotal = document.querySelector('.total-price');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const cartItemsList = document.querySelector('.cart-items-list');
    const checkoutButton = document.querySelector('.checkout-button');
    const minOrderWarning = document.querySelector('.min-order-warning');
    const cartSummaryPrice = document.querySelector('.price-summary .price');
    
    // Constants
    const MIN_ORDER_AMOUNT = 40000; // 40,000₫ minimum order

    // Load cart from localStorage if exists
    function loadCart() {
        console.log("Đang tải giỏ hàng từ localStorage");
        const savedCart = localStorage.getItem('cuongsacCart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                console.log("Đã tải giỏ hàng thành công:", cart);
                updateCartDisplay();
            } catch (e) {
                console.error("Lỗi khi phân tích giỏ hàng từ localStorage:", e);
                cart = { items: [], totalPrice: 0 };
                saveCart();
            }
        } else {
            console.log("Không có giỏ hàng trong localStorage, khởi tạo giỏ hàng mới");
            cart = { items: [], totalPrice: 0 };
            saveCart();
        }
        
        // Luôn cập nhật badge, kể cả khi giỏ hàng trống
        updateCartBadge(true);
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cuongsacCart', JSON.stringify(cart));
        console.log("Đã lưu giỏ hàng vào localStorage:", cart);
    }

    // Format price with comma separator and ₫ symbol
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '₫';
    }

    // Update cart badge (số hiển thị trên biểu tượng giỏ hàng)
    function updateCartBadge(showZero = false) {
        console.log("Đang cập nhật badge giỏ hàng");
        const totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
        console.log("Tổng số sản phẩm trong giỏ hàng:", totalItems);
        
        // Cập nhật badge trên các biểu tượng giỏ hàng
        const cartIcons = document.querySelectorAll('.action-item .fa-shopping-cart, .mobile-actions .fa-shopping-cart');
        console.log("Số lượng biểu tượng giỏ hàng tìm thấy:", cartIcons.length);
        
        cartIcons.forEach(icon => {
            // Tìm và xóa badge cũ nếu có
            const parentElement = icon.parentElement;
            const existingBadge = parentElement.querySelector('.cart-count-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Tạo badge mới nếu có sản phẩm hoặc showZero = true
            if (totalItems > 0 || showZero) {
                const badge = document.createElement('span');
                badge.className = 'cart-count-badge';
                badge.textContent = totalItems;
                parentElement.appendChild(badge);
                console.log("Đã thêm badge với số lượng:", totalItems);
            }
        });
    }

    // Update cart displays (both popup and cart page)
    function updateCartDisplay() {
        console.log("Đang cập nhật hiển thị giỏ hàng");
        
        // Update total price in cart popup
        if (cartPopupTotal) {
            cartPopupTotal.textContent = formatPrice(cart.totalPrice);
        }
        
        // Update cart popup items
        if (cart.items.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            if (cartPopupItems) {
                cartPopupItems.innerHTML = '<p class="empty-cart">Hiện chưa có sản phẩm</p>';
            }
            
            // Update cart page if we're on the cart page
            if (cartItemsList) {
                cartItemsList.style.display = 'none';
                const pageEmptyMessage = document.querySelector('.empty-cart-message');
                if (pageEmptyMessage) {
                    pageEmptyMessage.style.display = 'block';
                }
            }
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none';
            }
            
            // Update popup cart items
            if (cartPopupItems) {
                let popupItemsHTML = '';
                cart.items.forEach(item => {
                    popupItemsHTML += `
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <div class="cart-item-title">${item.name}</div>
                                <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                    <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                cartPopupItems.innerHTML = popupItemsHTML;
            }
            
            // Update cart page if we're on the cart page
            if (cartItemsList) {
                cartItemsList.style.display = 'block';
                let cartPageItemsHTML = '';
                cart.items.forEach(item => {
                    cartPageItemsHTML += `
                        <div class="cart-item" data-id="${item.id}">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                            <div class="cart-item-details">
                                <div class="cart-item-title">${item.name}</div>
                                <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                    <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                                    <button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                cartItemsList.innerHTML = cartPageItemsHTML;
                
                const pageEmptyMessage = document.querySelector('.empty-cart-message');
                if (pageEmptyMessage) {
                    pageEmptyMessage.style.display = 'none';
                }
            }
        }
        
        // Update cart page elements if on cart page
        if (cartSummaryPrice) {
            cartSummaryPrice.textContent = formatPrice(cart.totalPrice);
            
            // Enable/disable checkout button based on minimum order
            if (cart.totalPrice >= MIN_ORDER_AMOUNT) {
                checkoutButton.disabled = false;
                minOrderWarning.style.display = 'none';
            } else {
                checkoutButton.disabled = true;
                minOrderWarning.style.display = 'block';
            }
        }
        
        // Update cart badge
        updateCartBadge();
    }

    // Add item to cart
    function addToCart(product) {
        console.log("Thêm sản phẩm vào giỏ hàng:", product);
        
        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
            // If product exists, increment quantity
            cart.items[existingItemIndex].quantity += 1;
            console.log("Tăng số lượng sản phẩm đã có trong giỏ hàng");
        } else {
            // If product doesn't exist, add new item
            cart.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            console.log("Thêm sản phẩm mới vào giỏ hàng");
        }
        
        // Update total price
        updateCartTotal();
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart display
        updateCartDisplay();
        
        // Show cart popup
        showCartPopup();
        
        // Show toast notification
        try {
            console.log("Hiển thị thông báo toast");
            if (typeof showToast === 'function') {
                showToast('Đã thêm vào giỏ hàng');
            } else {
                console.error("Hàm showToast không được định nghĩa");
            }
        } catch (e) {
            console.error("Lỗi khi hiển thị thông báo:", e);
        }
    }

    // Update cart total price
    function updateCartTotal() {
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        console.log("Đã cập nhật tổng giá trị giỏ hàng:", cart.totalPrice);
    }

    // Remove item from cart
    function removeFromCart(productId) {
        console.log("Xóa sản phẩm khỏi giỏ hàng:", productId);
        cart.items = cart.items.filter(item => item.id !== productId);
        updateCartTotal();
        saveCart();
        updateCartDisplay();
    }

    // Update item quantity
    function updateItemQuantity(productId, newQuantity) {
        console.log("Cập nhật số lượng sản phẩm:", productId, "thành", newQuantity);
        const itemIndex = cart.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity = newQuantity;
            updateCartTotal();
            saveCart();
            updateCartDisplay();
        }
    }

    // Show cart popup
    function showCartPopup() {
        console.log("Hiển thị popup giỏ hàng");
        if (cartPopup) {
            cartPopup.style.display = 'block';
            
            // Hide popup after 3 seconds
            setTimeout(() => {
                if (cartPopup) {
                    cartPopup.style.display = 'none';
                }
            }, 3000);
        } else {
            console.error("Không tìm thấy popup giỏ hàng trong DOM");
        }
    }

    // Thêm event listener cho nút "Thêm vào giỏ hàng"
    console.log("Thêm event listener cho nút 'Thêm vào giỏ hàng'");
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    console.log("Số lượng nút thêm vào giỏ hàng tìm thấy:", addToCartButtons.length);
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định
            console.log("Đã nhấp vào nút 'Thêm vào giỏ hàng'");
            
            const productCard = this.closest('.product-card');
            if (!productCard) {
                console.error("Không tìm thấy thẻ product-card");
                return;
            }
            
            const productId = productCard.dataset.id || Math.floor(Math.random() * 1000); // Fallback for demo
            console.log("ID sản phẩm:", productId);
            
            let productName, productPrice, productImage;
            
            // Lấy tên sản phẩm
            const titleElement = productCard.querySelector('.product-title a');
            if (titleElement) {
                productName = titleElement.textContent;
            } else {
                const titleDirect = productCard.querySelector('.product-title');
                if (titleDirect) {
                    productName = titleDirect.textContent;
                } else {
                    console.error("Không tìm thấy tên sản phẩm");
                    productName = "Sản phẩm #" + productId;
                }
            }
            
            // Lấy giá sản phẩm
            const priceElement = productCard.querySelector('.current-price');
            if (priceElement) {
                const priceText = priceElement.textContent;
                productPrice = parseInt(priceText.replace(/\D/g, ''));
            } else {
                console.error("Không tìm thấy giá sản phẩm");
                productPrice = 100000; // Giá mặc định
            }
            
            // Lấy hình ảnh sản phẩm
            const imageElement = productCard.querySelector('.product-image img');
            if (imageElement) {
                productImage = imageElement.src;
            } else {
                console.error("Không tìm thấy ảnh sản phẩm");
                productImage = "/assets/images/logo.png"; // Ảnh mặc định
            }
            
            console.log("Thông tin sản phẩm:", {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            });
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            addToCart(product);
        });
    });

    // Toggle cart popup when clicking on cart icon (for desktop)
    const cartIcons = document.querySelectorAll('.actions .fa-shopping-cart, .mobile-actions .fa-shopping-cart');
    console.log("Số lượng biểu tượng giỏ hàng tìm thấy:", cartIcons.length);
    
    cartIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            const href = e.target.closest('a').getAttribute('href');
            if (href && (href.includes('/cart.html') || href.includes('/gio-hang') || href.includes('pages/cart.html'))) {
                // Don't prevent default if it's a link to the cart page
                console.log("Đây là liên kết đến trang giỏ hàng, không ngăn chặn hành vi mặc định");
                return;
            }
            
            e.preventDefault();
            console.log("Mở/đóng popup giỏ hàng");
            if (cartPopup) {
                cartPopup.style.display = cartPopup.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    // Close cart popup when clicking outside
    document.addEventListener('click', function(e) {
        if (cartPopup && cartPopup.style.display === 'block' && 
            !e.target.closest('.cart-popup') && 
            !e.target.closest('.fa-shopping-cart')) {
            console.log("Đóng popup giỏ hàng khi nhấp bên ngoài");
            cartPopup.style.display = 'none';
        }
    });

    // Add event listeners for cart quantity buttons and remove buttons (delegation)
    document.addEventListener('click', function(e) {
        // Plus button
        if (e.target.classList.contains('plus-btn')) {
            const productId = e.target.dataset.id;
            console.log("Nhấp vào nút tăng số lượng cho sản phẩm:", productId);
            const itemIndex = cart.items.findIndex(item => item.id == productId);
            if (itemIndex !== -1) {
                cart.items[itemIndex].quantity += 1;
                updateCartTotal();
                saveCart();
                updateCartDisplay();
            }
        }
        
        // Minus button
        if (e.target.classList.contains('minus-btn')) {
            const productId = e.target.dataset.id;
            console.log("Nhấp vào nút giảm số lượng cho sản phẩm:", productId);
            const itemIndex = cart.items.findIndex(item => item.id == productId);
            if (itemIndex !== -1) {
                if (cart.items[itemIndex].quantity > 1) {
                    cart.items[itemIndex].quantity -= 1;
                } else {
                    // If quantity would be less than 1, remove item
                    removeFromCart(productId);
                    return;
                }
                updateCartTotal();
                saveCart();
                updateCartDisplay();
            }
        }
        
        // Remove button
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const productId = e.target.dataset.id || e.target.closest('.remove-btn').dataset.id;
            console.log("Nhấp vào nút xóa sản phẩm:", productId);
            removeFromCart(productId);
        }
    });

    // Handle quantity input changes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value);
            console.log("Thay đổi số lượng cho sản phẩm:", productId, "thành", newQuantity);
            
            if (isNaN(newQuantity) || newQuantity < 1) {
                e.target.value = 1;
                updateItemQuantity(productId, 1);
            } else {
                updateItemQuantity(productId, newQuantity);
            }
        }
    });

    // Load cart on page load
    console.log("Bắt đầu tải giỏ hàng");
    loadCart();

    // For demo purposes - Add sample product to cart
    if (window.location.pathname.includes('/cart.html') && cart.items.length === 0) {
        // Add a sample product if cart is empty and we're on the cart page
        const sampleProducts = [
            {
                id: 'sample1',
                name: 'Sạc Dự Phòng Anker 535 PowerCore 20000 30W',
                price: 700000,
                image: '/assets/images/Anker_Powercore_20000_PowerIQ_2.0_before.png',
                quantity: 1
            }
        ];
        
        // Uncomment to add sample product for testing
        /*
        cart.items = sampleProducts;
        updateCartTotal();
        saveCart();
        updateCartDisplay();
        */
    }
}); 