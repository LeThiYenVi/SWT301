# SWT301
CodeCeptJS_AI Testing

	NHÓM 6 - CONCEPTJS AI TESTING
 LƯU Ý: NẾU CLONE CODE NÀY VỀ THÌ BẠN CẦN XÓA FOLDER DEMO CÓ TRONG CODE TRƯỚC
 RỒI TIẾP TỤC LÀM CÁC BƯỚC BÊN DƯỚI
1.Tạo folder Demo

2.cd đến Demo

3.Chạy các lệnh sau ở terminal 

-npm init -y	//Tạo package.json để quản lý project

-npm install codeceptjs --save-dev	//Cài CodeceptJS để viết & chạy test
					//CodeceptJS là gì?
					//Đây là framework viết test tự động (End-to-End test) hiện đại, dễ đọc, hỗ trợ nhiều engine như WebDriver, 						//Puppeteer, Playwright,...
					//Dùng để viết test theo kiểu “ngôn ngữ tự nhiên”: I.amOnPage(), I.fillField(), I.click(), ...

-npm install playwright --save-dev	//Cài Playwright để chạy test trên browser
					//Là công cụ để tự động điều khiển trình duyệt như Chrome, Firefox, WebKit.
					//Giúp chạy test thật trên trình duyệt để kiểm tra giao diện, chức năng.

-npx codeceptjs init			//Tạo file cấu hình và khởi động project test
					
					Khi chạy lệnh này, bạn sẽ được hỏi:
					Chọn helper nào? → chọn Playwright
					Nơi lưu test? → tests
					URL trang web? → http://localhost:3000
					Có hiện log không? → Yes
					Thư mục lưu screenshot/log? → output

					Sau khi init, CodeceptJS sẽ tạo các file:
					codecept.conf.js – file cấu hình chính
					steps_file.js – nơi có thể định nghĩa bước dùng lại
					//tests – chứa các file test như datetime_test.js
					//output – chứa log, screenshot nếu test fail


4.Bỏ code vào datetime_test.js (trong folder mới tạo):

//Code mẫu Check DateTime
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

Scenario('Check an invalid date', async ({ I }) => {
I.amOnPage('/');
I.click('Reset');

I.fillField('#day', '31');
I.fillField('#month', '2');
I.fillField('#year', '2025');

I.click('Check');

I.waitForText('is not a valid date time', 5);
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


5.Tiếp tục chạy các lệnh sau ở terminal

-node server.js //(chạy ở terminal mới)			//Chạy backend/frontend để test tương tác
//(cd đến Demo rồi chạy tiếp)	
-npx playwright install 
-npx codeceptjs run --steps 	//Chạy toàn bộ test và hiển thị chi tiết từng bước


