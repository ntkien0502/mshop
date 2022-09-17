/*
    Xây dựng các phương thức định dạng dữ liệu
*/

//Hàm định dạng ngày tháng theo kiểu ngày tháng năm
//created by ntkien (25/04/2019)
Date.prototype.formatddMMyyyy = function () {
    var day = this.getDate();
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    return day + '/' + month + '/' + year;
}
//Hàm format hiển thị số kiểu tiền tệ
//created by ntkien (25/04/2019)
Number.prototype.formatMoney = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}

// Số nhập vào có định dạng tiền tệ
//created by ntkien (25/04/2019)
Number.prototype.formatMoney = function () {
    return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
}