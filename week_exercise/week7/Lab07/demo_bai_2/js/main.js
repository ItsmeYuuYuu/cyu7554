'use strict';

(function ($) {

    /*------------------
        Preloader
    --------------------*/
    $(window).on('load', function () {
        $(".loader").fadeOut();
        $("#preloder").delay(200).fadeOut("slow");

        /*------------------
            Gallery filter
        --------------------*/
        $('.featured__controls li').on('click', function () {
            $('.featured__controls li').removeClass('active');
            $(this).addClass('active');
        });
        if ($('.featured__filter').length > 0) {
            var containerEl = document.querySelector('.featured__filter');
            var mixer = mixitup(containerEl);
        }
    });

    /*------------------
        Background Set
    --------------------*/
    $('.set-bg').each(function () {
        var bg = $(this).data('setbg');
        $(this).css('background-image', 'url(' + bg + ')');
    });

    //Humberger Menu
    $(".humberger__open").on('click', function () {
        $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").addClass("active");
        $("body").addClass("over_hid");
    });

    $(".humberger__menu__overlay").on('click', function () {
        $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
        $(".humberger__menu__overlay").removeClass("active");
        $("body").removeClass("over_hid");
    });

    /*------------------
		Navigation
	--------------------*/
    $(".mobile-menu").slicknav({
        prependTo: '#mobile-menu-wrap',
        allowParentLinks: true
    });


    $('.hero__categories__all').on('click', function(){
        $('.hero__categories ul').slideToggle(400);
    });

    /*-------------------
		Quantity change
	--------------------- */
    var proQty = $('.pro-qty');
    proQty.prepend('<span class="dec qtybtn">-</span>');
    proQty.append('<span class="inc qtybtn">+</span>');
    proQty.on('click', '.qtybtn', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find('input').val(newVal);
        updateTotal();
    });

    function updateTotal() {
        // Lấy giá trị số lượng
        var quantity = parseInt($('#quantity').val());
        
        // Lấy giá sản phẩm (76.300đ) và chuyển thành số
        var price = 76300; // Giá cố định của sản phẩm
        
        // Tính tổng
        var total = price * quantity;
        
        // Định dạng số với dấu phân cách hàng nghìn
        var formattedTotal = total.toLocaleString('vi-VN');
        
        // Cập nhật tổng tiền vào phần tử có id="total"
        $('#total').text(formattedTotal + ' đ');
        
        // Cập nhật tổng phụ và tổng trong phần checkout
        $('.shoping__checkout ul li:first-child span').text(formattedTotal + ' đ');
        $('.shoping__checkout ul li:last-child span').text(formattedTotal + ' đ');
    }

    // Gọi updateTotal lần đầu để khởi tạo giá trị
    $(document).ready(function() {
        updateTotal();
    });

})(jQuery);