$(document).ready(function () {

});

/*
    Lớp ProductDialongJS thực hiện các kịch bản khi thao tác với Các dialog trong màn hình Product
    created by ntkien (19/04/2019)
*/
class ProductDialongJS {
    constructor() {
        this.initEvent();
    }
    // Hàm bắt sự kiện cho các nút trong dialog
    // created by ntkien (19/04/2019)
    initEvent() {
        //Sự kiện của các nút trong dialog xác nhận xóa
        $('#btndeleteproduct').on('click', function () {
            alert('delete');
        });
        $('#btncanceldeleteproduct').on('click', function () {
            $("#dialogconfirmdelete").dialog("close");
        });
        //
    }
}
var dialogProductJS = new ProductDialongJS();