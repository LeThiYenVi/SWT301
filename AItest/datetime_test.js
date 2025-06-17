Feature('Date Time Checker');

Scenario('Check a valid date', async ({ I }) => {
I.amOnPage('/'); // Trang gốc, tương đương http://localhost:3000 nếu config đúng
I.see('Date Time Checker');

// Điền dữ liệu hợp lệ
I.fillField('#day', '15');
I.fillField('#month', '6');
I.fillField('#year', '2025');

// Nhấn nút kiểm tra
I.click('Check');

// Đợi kết quả hiển thị
I.waitForText('is a valid date time', 5);
});



Scenario('Validate input errors', async ({ I }) => {
I.amOnPage('/');
I.click('Reset');

// Trường hợp: để trống day
I.fillField('#month', '12');
I.fillField('#year', '2025');
I.click('Check');
I.waitForText('Day input is required', 5);

// Trường hợp: nhập sai định dạng
I.click('Reset');
I.fillField('#day', 'abc');
I.fillField('#month', '5');
I.fillField('#year', '2024');
I.click('Check');
I.waitForText('Day input is not a number', 5);
});