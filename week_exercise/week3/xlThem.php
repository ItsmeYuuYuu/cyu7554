<?php
// Kiểm tra nếu form được gửi bằng phương thức POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lấy dữ liệu từ form
    $username = isset($_POST['nmUsername']) ? htmlspecialchars($_POST['nmUsername']) : '';
    $password = isset($_POST['nmPassword']) ? htmlspecialchars($_POST['nmPassword']) : '';
    $fullName = isset($_POST['nmFullName']) ? htmlspecialchars($_POST['nmFullName']) : '';
    $birthDate = isset($_POST['nmBirthDate']) ? htmlspecialchars($_POST['nmBirthDate']) : '';
    $gender = isset($_POST['nmGender']) ? htmlspecialchars($_POST['nmGender']) : '';
    $email = isset($_POST['nmEmailAdd']) ? htmlspecialchars($_POST['nmEmailAdd']) : '';
    $avatarURL = isset($_POST['nmURLAvatar']) ? htmlspecialchars($_POST['nmURLAvatar']) : '';
    $address = isset($_POST['nmAddress']) ? htmlspecialchars($_POST['nmAddress']) : '';
    $cellphone = isset($_POST['nmCellphone']) ? htmlspecialchars($_POST['nmCellphone']) : '';
    $privateQuestion = isset($_POST['nmPrivateQuestion']) ? htmlspecialchars($_POST['nmPrivateQuestion']) : '';
    $privateAnswer = isset($_POST['nmPrivateAnswer']) ? htmlspecialchars($_POST['nmPrivateAnswer']) : '';
    $fields = isset($_POST['nmFields']) ? $_POST['nmFields'] : [];

    // Hiển thị dữ liệu
    echo "<h2>Dữ liệu đã gửi:</h2>";
    echo "Tên đăng nhập: " . $username . "<br>";
    echo "Mật khẩu: " . $password . "<br>";
    echo "Họ tên: " . $fullName . "<br>";
    echo "Ngày sinh: " . $birthDate . "<br>";
    echo "Giới tính: " . $gender . "<br>";
    echo "Địa chỉ email: " . $email . "<br>";
    echo "URL hình đại diện: " . $avatarURL . "<br>";
    echo "Địa chỉ: " . $address . "<br>";
    echo "Điện thoại: " . $cellphone . "<br>";
    echo "Câu hỏi bí mật: " . $privateQuestion . "<br>";
    echo "Trả lời: " . $privateAnswer . "<br>";
    echo "Nhóm sản phẩm quan tâm: " . (count($fields) > 0 ? implode(", ", $fields) : "Không chọn") . "<br>";
} else {
    echo "Không có dữ liệu gửi đến.";
}
?>