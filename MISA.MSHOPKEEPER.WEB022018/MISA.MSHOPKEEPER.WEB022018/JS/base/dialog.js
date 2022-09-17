$(document).ready(function () {

    // Khởi tạo các dialog
    //addCustomerCategoryDialog = new Dialog("#dialog-addcustomercategory", 450, "auto", false);
})

// Lớp Dialog làm việc với những dialog có sử dụng trong chương trình
// Created by ntkien (05/04/2019)
class Dialog {
    constructor(element, width, height, useClose) {
        $(function () {
            $(element).dialog({
                resizable: false,
                height: height,
                width: width,
                autoOpen: false,
                modal: true,
                open: function () {
                    //if (useClose == false) {
                    //    $(this).siblings('.ui-dialog-titlebar').children('.ui-dialog-titlebar-close').hide();
                    //}
                },
                close: function () {

                }
            });
        });
        this.initEvents();
    }
    // Tạo event cho các control trong content dialog
    initEvents() {
        
        // Sửa hàng hóa
    }
}
