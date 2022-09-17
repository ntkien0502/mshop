$(document).ready(function () {
    //Load dữ liệu vào gridview
    productJS.loadDataByCondition();
    // Khởi tạo dialog
    addCustomerDialog = new Dialog("#dialog-addproduct-content", 742, "auto", true);
    addCustomerDialog = new Dialog("#dialogconfirmdelete", 400, "auto", true);
    dupplicateProductCodeDialog = new Dialog("#dialogdupplicaeproductcode", 400, "auto", true);
})
var detailRowIndex = 0;
// Biến nhận biết ID của dòng đang được chọn (phục vụ fill data vào dialog sửa)
var currentID = "";
// Biến nhận biết hàng hóa người dùng đang chọn tên là gì
var currentProductName = "";
// Biến nhận biết dialog mở lên dạng sửa hay thêm mới
var currentBussineesID = "";
var task = "";
// Biến nhận biết mã businees của hàng hóa đang chọn
// Biến chứa các dòng đã được chọn để chuẩn bị thao tác
var selectedRow = [];
// Biến nhận biết muốn xóa 1 hay nhiều bản ghi
var typeDelete = 0;
// Biến nhận biết index của đơn vị tính đang được lựa chọn
var currentUnitIndex = null;
// Biến nhận biết đơn vị tính nào đang được lựa chọn
var selectedCalculationUnit = null;
// Biến nhận biết index của nhóm hàng đang được lựa chọn
var currentGroupIndex = null;
// Biến nhận biết Nhóm hàng nào đang được lựa chọn
var selectedProductGroup = null;
//Biến nhận biết danh sách các thẻ tag màu sắc
var colorTagList = [];
//Biến nhận biết danh sách các thẻ tag size
var sizeTagList = [];
// Biến nhận biết màu sắc/size đang có
var listItemValue = [];
// Biến nhận biết mã của loại hàng vừa được thêm mới
var lastestProductID = null;
// Biến chứa các mã của hàng hóa và chi tiết gửi lên server
var listRequestID = [];
// Chuỗi màu sắc khi thêm mới hàng hóa
var productAddColor = "";
// Chuỗi size khi thêm mới hàng hóa
var productAddSize = "";
// Biến nhận biết số bản ghi trên 1 trang
var rowNumberOnPage = 15;
// Biến nhận biết trang hiển thị
var pageNumber = 1;
// Biến nhận biết người dùng đang muốn lọc ở cột nào
var currentFilterColumn;

// Lớp filter - đối tượng điều kiện lọc
//created by ntkien (10/05/2019)

class Filter {
    constructor(filterType, value, fieldName) {
        this.FilterType = filterType;
        this.FilterValue = value;
        this.FieldName = fieldName;
    }
}


// Lớp ProductIS làm việc với màn hình hàng hóa
// Created by ntkien (05/04/2019)
class ProductJS {
    constructor() {
        this.initEvents();
    }
    // Hàm gán sự kiện cho các nút
    //Created by ntkien (05/04/2019)
    initEvents() {
        
        //==================================================================== Đóng, mở các màn hình theo tác vụ=====================
        // Nhấn nút thêm => Hiển thị vùng thêm dữ liệu
        $("#btnAddProduct").on("click", addProductClick);

        // Nhân nút nhân bản => lấy dữ liệu muốn nhân bản và hiển thị vùng chỉnh sửa
        $('#btnDuplicateProduct').on('click', dupplicateProductCick);

        //Nhấn nút sửa => Lấy dữ liệu đổ vào các control
        $("#btnEditProduct").on("click", editProductCick);

        // Nhấn nút xóa => Mở dialog Confirm xóa dữ liệu
        $('#btnDeleteProduct').on('click', function () {
            if (currentID != "" || selectedRow.length != 0) {
                if (selectedRow.length <= 1) {
                    $('.dialog-message-text-deletemany').css('display', 'none');
                    $('.dialog-message-text-delete').css('display', 'block');
                    $('#dialog-delete-productname').text(currentProductName);
                    $('#dialog-delete-sku').text("(" + currentBussineesID + ")");
                    $("#dialogconfirmdelete").dialog("open");
                    typeDelete = 1; // Xóa 1 bản ghi
                }
                else {
                    $('.dialog-message-text-deletemany').css('display', 'block');
                    $('.dialog-message-text-delete').css('display', 'none');
                    $("#dialogconfirmdelete").dialog("open");
                    typeDelete = 2; // Xóa nhiều bản ghi
                }
            }
        });

        // Nhấn nút nạp => Nạp lại dữ liệu. Trong lúc nạp thì hiển thị progess
        $('#btnRefresh').on('click', function () {
            $('tbody').empty();
            productJS.loadDataByCondition();
        });

        // ================================================================== Hiển thị các lựa chọn trên header=======================
        $('.panel-account').on('click', function () {
            var conditionOffset = $(this).offset();
            $('.combobox-account-option').toggle();
            $('.combobox-account-option').offset({ top: conditionOffset.top + 32, left: conditionOffset.left - 22 });
        });
        $('.panel-shop').on('click', function () {
            var conditionOffset = $(this).offset();
            $('.combobox-shop-option').toggle();
            $('.combobox-shop-option').offset({ top: conditionOffset.top + 32, left: conditionOffset.left });
        });

        //=================================================================== Hiển thị các lựa chọn của các cột danh sách=================
        //Focus grid header ô nhập liệu dạng combobox
        $('.grid-header-column-combobox-input').on('focusin', function () {
            $(this).parents('.grid-header-column-combobox-input').css('border-color', '#5aa9ff');
        });
        $('.grid-header-column-combobox-input').on('focusout', function () {
            $('.grid-header-column-combobox-input').parents('.grid-header-column-combobox-input').css('border-color', '#ccc');
        });

        // Nhấn nút lựa chọn điều kiện lọc trong các input combobox
        $('.displayoscreen-condition-search').on('click', function () {
            currentFilterColumn = this;
            $('.filter-nomal-option').css('display', 'none');
            $('.filter-price-option').css('display', 'none');
            $('.filter-category-option').css('display', 'none');
            $('.filter-status-option').css('display', 'none');
            //Hiện lựa chọn lọc
            var conditionOffset = $(this).parents('.grid-header-column-combobox-input').offset();
            $('.filter-displayonscreen-option').toggle();
            $('.filter-displayonscreen-option').offset({ top: conditionOffset.top + 31, left: conditionOffset.left });
        });
        $('.category-condition-search').on('click', function () {
            currentFilterColumn = this;
            $('.filter-nomal-option').css('display', 'none');
            $('.filter-price-option').css('display', 'none');
            $('.filter-displayonscreen-option').css('display', 'none');
            $('.filter-status-option').css('display', 'none');
            //Hiện lựa chọn lọc
            var conditionOffset = $(this).parents('.grid-header-column-combobox-input').offset();
            $('.filter-category-option').toggle();
            $('.filter-category-option').offset({ top: conditionOffset.top + 31, left: conditionOffset.left });
        });
        $('.status-condition-search').on('click', function () {
            currentFilterColumn = this;
            $('.filter-option').css('display', 'none');
            $('.filter-price-option').css('display', 'none');
            $('.filter-displayonscreen-option').css('display', 'none');
            $('.filter-category-option').css('display', 'none');
            //Hiện lựa chọn lọc
            var conditionOffset = $(this).parents('.grid-header-column-combobox-input').offset();
            $('.filter-status-option').toggle();
            $('.filter-status-option').offset({ top: conditionOffset.top + 31, left: conditionOffset.left });
        });

        // Ẩn, hiện các lựa chọn lọc thường
        $('.nomal-condition-search').on('click', function () {
            var conditionOffset = $(this).offset();
            currentFilterColumn = this;
            $('.filter-price-option').css('display', 'none');
            $('.filter-category-option').css('display', 'none');
            $('.filter-displayonscreen-option').css('display', 'none');
            $('.filter-status-option').css('display', 'none');
            //alert("Top: " + conditionOffset.top + " Left: " + conditionOffset.left);
            $('.filter-nomal-option').toggle();
            $('.filter-nomal-option').offset({ top: conditionOffset.top + 31, left: conditionOffset.left + 2 });
        });

        // Hiển thị điều kiện lọc cho giá
        $('.price-condition-search').on('click', function () {
            var conditionOffset = $(this).offset();
            currentFilterColumn = this;
            $('.filter-option').css('display', 'none');
            $('.filter-category-option').css('display', 'none');
            $('.filter-displayonscreen-option').css('display', 'none');
            //alert("Top: " + conditionOffset.top + " Left: " + conditionOffset.left);
            $('.filter-price-option').toggle();
            $('.filter-price-option').offset({ top: conditionOffset.top + 31, left: conditionOffset.left + 2 });
        });

        //// Focus các input trong dialog
        //$(":text").on("focusin", this.focusInputInDialog).on("focusout", this.focusInputOutDialog);

        // Validate dữ liệu trong dialog Thêm sửa
        $('#txtBarCode').on('keyup', function () {
            var productnameValue = $('#txtBarCode').val();
            var valueToNumber = Number(productnameValue);
            if (Number.isInteger(valueToNumber) === false) {
                $('#txtBarCode').parents(".dialog-row-infor-input").addClass("border-error");
                //$('#txtBarCode').css('background-color', 'red');
            }
            else {
                $('#txtBarCode').parents(".dialog-row-infor-input").removeClass("border-error");
            }
        });
        $('#txtImportPrice').on('keyup', function () {
            var productnameValue = $('#txtImportPrice').val();
            var valueToNumber = Number(productnameValue);
            if (Number.isInteger(valueToNumber) === false) {
                $('#txtImportPrice').parents(".dialog-row-infor-input").addClass("border-error");
            }
            else {
                if (valueToNumber >= 0) {
                    $('#txtImportPrice').parents(".dialog-row-infor-input").removeClass("border-error");
                }
                else {
                    $('#txtImportPrice').parents(".dialog-row-infor-input").addClass("border-error");
                }
            }
        });
        $('#txtSellPrice').on('keyup', function () {
            var productnameValue = $('#txtSellPrice').val();
            var valueToNumber = Number(productnameValue);
            if (Number.isInteger(valueToNumber) === false) {
                $('#txtSellPrice').parents(".dialog-row-infor-input").addClass("border-error");
            }
            else {
                if (valueToNumber >= 0) {
                    $('#txtSellPrice').parents(".dialog-row-infor-input").removeClass("border-error");
                }
                else {
                    $('#txtSellPrice').parents(".dialog-row-infor-input").addClass("border-error");
                }
            }
        });
        $('#txtFirstQuantity').on('keyup', function () {
            var productnameValue = $('#txtFirstQuantity').val();
            var valueToNumber = Number(productnameValue);
            if (Number.isInteger(valueToNumber) === false) {
                $('#txtFirstQuantity').parents(".dialog-row-infor-input").addClass("border-error");
            }
            else {
                if (valueToNumber >= 0) {
                    $('#txtFirstQuantity').parents(".dialog-row-infor-input").removeClass("border-error");
                }
                else {
                    $('#txtFirstQuantity').parents(".dialog-row-infor-input").addClass("border-error");
                }
            }
        });
        $('#txtProductName').on('focusout', function () {
            var productnameValue = $('#txtProductName').val();
            var valueToNumber = Number(productnameValue);
            if (productnameValue === "") {
                $('#txtProductName').parents(".dialog-row-infor-input").addClass("border-error");
            }
            else {
                $('#txtProductName').parents(".dialog-row-infor-input").removeClass("border-error");
            }
        });
        $('#txtProductName').on('keyup', function () {
            var productnameValue = $('#txtProductName').val();
            var valueToNumber = Number(productnameValue);
            if (productnameValue === "") {
                $('#txtProductName').parents(".dialog-row-infor-input").addClass("border-error");
            }
            else {
                $('#txtProductName').parents(".dialog-row-infor-input").removeClass("border-error");
                $('#txtProductName').parents(".dialog-row-infor-input").removeClass("border-error");

            }
        });

        // Đưa chuột vào vùng scroll thì các lựa chọn ẩn đi
        $('.grid-body').mouseover(function () {
            $('.filter-nomal-option').css('display', 'none');
            $('.filter-price-option').css('display', 'none');
            $('.filter-category-option').css('display', 'none');
            $('.filter-displayonscreen-option').css('display', 'none');
            $('.filter-status-option').css('display', 'none');
            $('.filter-status-option').css('display', 'none');
            $('.combobox-account-option').css('display', 'none');
            $('.combobox-shop-option').css('display', 'none');
        });
        $('.grid').on('scroll', function () {
            $('.filter-option').css('display', 'none');
        });

        // Click ra ngoài vùng lựa chọn lọc thì ẩn các lựa chọn lọc đi
        $(document).on('click', function (e) {
            if (!e.target.closest('.condition-search') && !e.target.closest('.panel-account') && !e.target.closest('.panel-shop')) {
                $('.filter-nomal-option').css('display', 'none');
                $('.filter-price-option').css('display', 'none');
                $('.filter-category-option').css('display', 'none');
                $('.filter-displayonscreen-option').css('display', 'none');
                $('.filter-status-option').css('display', 'none');
            }
            $('.product-contextmenu').css('display', 'none');
        });


        // Lựa chọn giá trị cho điều kiện lọc
        $('.filter-option-item-combobox').on('click', function () {
            currentFilterColumn.previousElementSibling.value = this.firstElementChild.textContent;
        });
        //
        $('.filter-option-item-nomal').on('click', function () {
            currentFilterColumn.firstElementChild.textContent = this.firstElementChild.textContent;
            productJS.loadDataByCondition();
        });
        $('.filter-option-item-price').on('click', function () {
            currentFilterColumn.firstElementChild.textContent = this.firstElementChild.textContent;
            // Gán giá trị lọc cho cột
            currentFilterColumn.attributes["fieldtype"].textContent = this.attributes["filtertype"].textContent;
            productJS.loadDataByCondition();
        });
        $('.filter-option-item-combobox-inactive').on('click', function () {
            currentFilterColumn.attributes["filtervalue"].textContent = $(this).attr('filtertype');
            productJS.loadDataByCondition();
        });
        $('.filter-option-item-combobox-category').on('click', function () {
            currentFilterColumn.attributes["filtervalue"].textContent = $(this).attr('filtertype');
        });
        $('.filter-option-item-combobox-status').on('click', function () {
            currentFilterColumn.attributes["filtervalue"].textContent = $(this).attr('filtertype');
            productJS.loadDataByCondition();
        });

        // Lựa chọn giá trị trong contextmenu
        $('.product-contextmenu-option-add').on('click', addProductClick);
        $('.product-contextmenu-option-dupplicate').on('click', dupplicateProductCick);
        $('.product-contextmenu-option-edit').on('click', editProductCick);
        $('.product-contextmenu-option-delete').on('click', function () {
            if (currentID != "" || selectedRow.length != 0) {
                if (selectedRow.length <= 1) {
                    $('.dialog-message-text-deletemany').css('display', 'none');
                    $('.dialog-message-text-delete').css('display', 'block');
                    $('#dialog-delete-productname').text(currentProductName);
                    $('#dialog-delete-sku').text("(" + currentBussineesID + ")");
                    $("#dialogconfirmdelete").dialog("open");
                    typeDelete = 1; // Xóa 1 bản ghi
                }
                else {
                    $('.dialog-message-text-deletemany').css('display', 'block');
                    $('.dialog-message-text-delete').css('display', 'none');
                    $("#dialogconfirmdelete").dialog("open");
                    typeDelete = 2; // Xóa nhiều bản ghi
                }
            }
        });
        $('.product-contextmenu-option-refresh').on('click', function () {
            $('tbody').empty();
            productJS.loadDataByCondition();
        });

        // Lựa chọn tất cả các hàng hóa khi nhân icon chọn tất cả
        $('.grid-header-checkcolumn-icon').on('click', function () {
            // Nếu đang là chọn tất cả thì bỏ chọn
            if ($('.grid-header-checkcolumn-icon').hasClass('grid-body-row-checkbox-icon-checked') === true) {
                $('.grid-header-checkcolumn-icon').removeClass('grid-body-row-checkbox-icon-checked');
                $('.grid-body-row').css('background-color', 'white');
                $('.grid-body-row-even').css('background-color', '#f6f6f6');
                $('table .grid-body-row-checkbox-icon').removeClass('grid-body-row-checkbox-icon-checked');
                // Xóa tất cả các mã có trong mảng selectedRow
                while (selectedRow.length > 0) {
                    selectedRow.pop();
                }
                currentID = "";
                $('#btnDuplicateProduct').removeClass('toolbar-button-disable-event');
                $('#btnEditProduct').removeClass('toolbar-button-disable-event');
            }
            else {
                // Nếu đang là không chọn tất cả thì chọn tất cả
                $('.grid-header-checkcolumn-icon').addClass('grid-body-row-checkbox-icon-checked');
                $('table tr').css('background-color', '#c3ecff');
                $('table .grid-body-row-checkbox-icon').addClass('grid-body-row-checkbox-icon-checked');
                // Làm rỗng lại mảng và  Thêm tất cả mã của các dòng hàng hóa vào mảng selectedRow
                while (selectedRow.length > 0) {
                    selectedRow.pop();
                }
                var listProductID = $('tr .column-procuct-id');
                $.each(listProductID, function (index) {
                    selectedRow.push(listProductID[index].innerHTML);
                });
                currentID = "";
                $('#btnDuplicateProduct').addClass('toolbar-button-disable-event');
                $('#btnEditProduct').addClass('toolbar-button-disable-event');
            }
        });
        // Lựa chọn số bản ghi trên 1 dòng
        $('.paging-record-select').change(function () {
            rowNumberOnPage = Number($('.paging-record-select').val());
            $('#pagingnumberinput').val(pageNumber);
            productJS.loadDataByCondition();
        });
        // Lựa chọn trang dữ liệu
        $('#pagingnumberinput').change(function () {
            pageNumber = Number($('#pagingnumberinput').val());
            productJS.loadDataByCondition();
        });
        // Next sang trang tiếp theo
        $('#btnnextpage').on('click', function () {
            pageNumber += 1;
            $('#pagingnumberinput').val(pageNumber);
            productJS.loadDataByCondition();
        });
        // Trở về trang dữ liệu trước
        $('#btnpreviouspage').on('click', function () {
            if (pageNumber > 1) {
                pageNumber -= 1;
                $('#pagingnumberinput').val(pageNumber);
                productJS.loadDataByCondition();
            }
        });

        //============================================================================= Thực hiện các tác vụ=============================================
        // Lưu hàng hóa
        //if (task==="add") {
        //    $("#btnSaveProduct").on("click", this.addProduct);
        //}
        //if (task === "edit") {
        //    $("#btnSaveProduct").on("click", this.editProduct);
        //}

        // Bắt sự kiện nút Đóng dialog
        $("#btnCancel").on("click", function () {
            $("#dialog-addproduct-content").dialog("close");
        });

        // Xác nhận xóa hàng hóa
        $('#btnconfirmdelete').on('click', function () {
            if (typeDelete === 1) {
                productJS.deleteProduct();
            }
            if (typeDelete === 2) {
                productJS.deleteMultipeProduct();
            }
        });

        // Hủy bỏ xóa hàng hóa
        $('#btncanceldelete').on('click', function () {
            $("#dialogconfirmdelete").dialog("close");
        });

        // Lấy đối tượng lọc
        $('input.grid-header-column-input').change(function () {
            productJS.loadDataByCondition();
        });
    }

    //===================================================================================Các hàm thao tác dữ liệu=================================
    // Hàm lấy danh sách theo điều kiện
    // Created by ntkien (10/05/2019)
    loadDataByCondition() {
        $('tbody').empty();
        var filters = [];
        // Lấy ra các thuộc tính của đối tượng lọc theo text
        var filterItems = $('.grid-header-column');
        $.each(filterItems, function (index, filterItem) {
            var filterType = $(filterItem).find('.grid-header-column-option').text();
            var filterValue = $(filterItem).find('input.grid-header-column-input').val();
            var fieldName = filterItem.attributes["fielddata"].textContent;
            if (filterValue && fieldName != "SalePrice") {
                var filter = new Filter(filterType, filterValue, fieldName);
                filters.push(filter);
            }
        });
        // Lấy đối tượng lọc theo giá
        var priceItem = $('#salepricesearchcolumn');
        var filterType = priceItem.find('a.price-condition-search').attr("fieldtype");
        var filterValue = priceItem.find('#txtsalepricesearch').val();
        var fieldName = priceItem.attr('fielddata');
        if (filterValue) {
            var filter = new Filter(filterType, filterValue, fieldName);
            filters.push(filter);
        }
        // Lấy đối tượng lọc trong combobox
        var comboboxItems = $('.grid-header-column-combobox');
        $.each(comboboxItems, function (index, comboboxItem) {
            var comboboxType = $(comboboxItem).find('a.condition-search-combobox').attr("fieldtype");
            var comboboxValue = $(comboboxItem).find('a.condition-search-combobox').attr("filtervalue");
            var comboboxName = $(comboboxItem).attr('fieldData');
            if (comboboxValue) {
                var filter = new Filter(comboboxType, comboboxValue, comboboxName);
                filters.push(filter);
            }
        });
        
        // Gọi API lấy dữ liệu theo điều kiện
        currentID = "";
        $.ajax({
            method: "POST",
            data: JSON.stringify(filters),
            dataType: 'json',
            contentType: 'application/json',
            url: "/products/" + pageNumber + "/" + rowNumberOnPage,
            // Nếu thành công thì đổ dữ liệu ra Grid theo định dạng
            success: function (response) {
                if (response.Data.length > 0) {
                    // Hiển thị progess
                    $('.grid-body').css('opacity', '0.2');
                    $('.grid-body').css('background-color', 'black');
                    $('.progess-reload').css('display', 'block');
                    $('.progess-reload').show('fast').delay(1000).hide('fast', function () {
                        $('.grid-body').css('opacity', '1');
                    });
                    var data = response.Data;
                    // Đổ dữ liệu
                    $.each(data, function (index, item) {
                        var fields = $('.grid-header-column[fieldData]');
                        var productID = item["ProductID"];
                        var productName = item["ProductName"];
                        //var divHTML = '<div class="grid-body-row" onclick="setCurrentID("' + productID + '")"></div>';
                        var divHTML = '<tr class="grid-body-row" onclick=productJS.setCurrentID("' + productID + '",' + index + ',this) ondblclick=productJS.dbclickToEdit("' + productID + '",' + index + ') oncontextmenu=productJS.contextMenu("' + productID + '",' + index + ',this)>' + '</tr > ';
                        var currentRowIndex = index + 1;
                        if (currentRowIndex % 2 == 0) {
                            divHTML = '<tr class="grid-body-row-even" onclick=productJS.setCurrentID("' + productID + '",' + index + ',this) ondblclick=productJS.dbclickToEdit("' + productID + '",' + index + ') oncontextmenu=productJS.contextMenu("' + productID + '",' + index + ',this)>' + '</tr > ';
                        }
                        divHTML = $(divHTML).append('<td class="grid-body-row-checkbox" onclick=productJS.chooseRowCheckbox("' + productID + '",' + index + ')><span class="grid-body-row-checkbox-icon"></span></td>');

                        $.each(fields, function (index, field) {
                            var fieldName = $(field).attr('fieldData');
                            var dataType = $(field).attr('dataType');
                            dataType = dataType ? dataType.toLowerCase() : null;
                            var value = item[fieldName] ? item[fieldName] : "";
                            var typeData = jQuery.type(value);
                            switch (dataType) {
                                case "money":
                                    var moneyString = "0";
                                    if (value != 0) {
                                        moneyString = value.formatMoney();
                                    }
                                    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-price">' + moneyString + '</td>');
                                    break;
                                case "boolean":
                                    if (fieldName == "InActive") {
                                        if (value === true) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen">Có</td>');
                                        }
                                        else {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen">Không</td>');
                                        }
                                    }
                                    break;
                                case "number":
                                    if (fieldName == "Status") {
                                        if (value === 1) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="Đang kinh doanh">Đang kinh doanh</td>');
                                        }
                                        if (value === 2) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="Ngừng kinh doanh">Ngừng kinh doanh</td>');
                                        }
                                    }
                                    break;
                                    // Default : string
                                default:
                                    if (fieldName === "ProductID") {
                                        divHTML = $(divHTML).append('<td class="column-procuct-id" style="display:none !important;">' + value + '</td>');
                                    }
                                    if (fieldName === "SKUCode") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-sku" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "ProductName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-productname" title="' + value + '"><a href="">' + value + '</a></td>');
                                    }
                                    if (fieldName === "ProductGroupName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-groupproduct" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "CalculationUnitName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-counter" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "SalePrice") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-price" title="' + value + '">' + value + '</td>');
                                    }
                                    //if (fieldName === "InActive") {
                                    //    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen" title="' + value + '">' + value + '</td>');
                                    //}
                                    if (fieldName === "ProductTypeName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-category" title="' + value + '">' + value + '</td>');
                                    }
                                    //if (fieldName === "Status") {
                                    //    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="' + value + '">' + value + '</td>');
                                    //}
                                    break;
                            }
                        });
                        $('tbody').append(divHTML);

                    });
                    // Tắt progess
                    $('.grid-body').css('background-color', '#e5e6eb');
                    //$('.progess-loading').css('display', 'none');
                }
            },
            //Nếu không thành công thì hiện thông báo không thành công
            fail: function (response) {
                alert(response.Messenger);
            },
            //Nếu lỗi thì hiện thông báo lỗi
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }
    // Hàm đổ dữ liệu lên gridview
    // Created by ntkien (05/04/2019)
    loadData() {
        currentID = "";
        // Gọi API lấy dữ liệu
        $.ajax({
            url: "/products",
            method: "GET",
            // Nếu thành công thì đổ dữ liệu ra Grid theo định dạng
            success: function (response) {
                if (response.Data.length > 0) {
                    // Hiển thị progess
                    $('.grid-body').css('opacity', '0.2');
                    $('.grid-body').css('background-color', 'black');
                    $('.progess-reload').css('display', 'block');
                    $('.progess-reload').show('fast').delay(1000).hide('fast', function () {
                        $('.grid-body').css('opacity', '1');
                    });
                    var data = response.Data;
                    // Đổ dữ liệu
                    $.each(data, function (index, item) {
                        var fields = $('.grid-header-column[fieldData]');
                        var productID = item["ProductID"];
                        var productName = item["ProductName"];
                        //var divHTML = '<div class="grid-body-row" onclick="setCurrentID("' + productID + '")"></div>';
                        var divHTML = '<tr class="grid-body-row" onclick=productJS.setCurrentID("' + productID + '",' + index + ',this) ondblclick=productJS.dbclickToEdit("' + productID + '",' + index + ') oncontextmenu=productJS.contextMenu("' + productID + '",' + index + ',this)>' + '</tr > ';
                        var currentRowIndex = index + 1;
                        if (currentRowIndex % 2 == 0) {
                            divHTML = '<tr class="grid-body-row-even" onclick=productJS.setCurrentID("' + productID + '",' + index + ',this) ondblclick=productJS.dbclickToEdit("' + productID + '",' + index + ') oncontextmenu=productJS.contextMenu("' + productID + '",' + index + ',this)>' + '</tr > ';
                        }
                        divHTML = $(divHTML).append('<td class="grid-body-row-checkbox" onclick=productJS.chooseRowCheckbox("' + productID + '",' + index + ')><span class="grid-body-row-checkbox-icon"></span></td>');

                        $.each(fields, function (index, field) {
                            var fieldName = $(field).attr('fieldData');
                            var dataType = $(field).attr('dataType');
                            dataType = dataType ? dataType.toLowerCase() : null;
                            var value = item[fieldName] ? item[fieldName] : "";
                            var typeData = jQuery.type(value);
                            switch (dataType) {
                                case "money":
                                    var moneyString = "0";
                                    if (value != 0) {
                                        moneyString = value.formatMoney();
                                    }
                                    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-price">' + moneyString + '</td>');
                                    break;
                                case "boolean":
                                    if (fieldName == "InActive") {
                                        if (value === true) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen">Có</td>');
                                        }
                                        else {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen">Không</td>');
                                        }
                                    }
                                    break;
                                case "number":
                                    if (fieldName == "Status") {
                                        if (value === 1) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="Đang kinh doanh">Đang kinh doanh</td>');
                                        }
                                        if (value === 2) {
                                            divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="Ngừng kinh doanh">Ngừng kinh doanh</td>');
                                        }
                                    }
                                    break;
                                    // Default : string
                                default:
                                    if (fieldName === "ProductID") {
                                        divHTML = $(divHTML).append('<td class="column-procuct-id" style="display:none !important;">' + value + '</td>');
                                    }
                                    if (fieldName === "SKUCode") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-sku" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "ProductName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-productname" title="' + value + '"><a href="">' + value + '</a></td>');
                                    }
                                    if (fieldName === "ProductGroupName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-groupproduct" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "CalculationUnitName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-counter" title="' + value + '">' + value + '</td>');
                                    }
                                    if (fieldName === "SalePrice") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-price" title="' + value + '">' + value + '</td>');
                                    }
                                    //if (fieldName === "InActive") {
                                    //    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-displayscreen" title="' + value + '">' + value + '</td>');
                                    //}
                                    if (fieldName === "ProductTypeName") {
                                        divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-category" title="' + value + '">' + value + '</td>');
                                    }
                                    //if (fieldName === "Status") {
                                    //    divHTML = $(divHTML).append('<td class="grid-body-colum row-colum-status" title="' + value + '">' + value + '</td>');
                                    //}
                                    break;
                            }
                        });
                        $('tbody').append(divHTML);

                    });
                    // Tắt progess
                    $('.grid-body').css('background-color', '#e5e6eb');
                    //$('.progess-loading').css('display', 'none');
                }
            },
            //Nếu không thành công thì hiện thông báo không thành công
            fail: function (response) {
                alert(response.Messenger);
            },
            //Nếu lỗi thì hiện thông báo lỗi
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }

    // Hàm lấy thông tin hàng hóa theo ID
    // created by ntkien (22/04/2019)
    // modifield by ntkien (09/05/2019) : Load và hiển thị các thẻ tag
    getProductByID() {
        // Hiển thị progess khi load dữ liệu
        $('.content-product-detail').css('opacity', '0.2');
        $('.content-product-detail').css('background-color', 'black');
        $('.progess-loading').css('display', 'block');
        $('.progess-loading').show('fast').delay(1000).hide('fast', function () {
            $('.content-product-detail').css('opacity', '1');
        });
        // Lấy dữ liệu hiển thị lên các control
        $.ajax({
            url: '/products/' + currentID,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                if (response.Data != null) {
                    if (response.Data["Status"] === 1) {
                        $('#rdostopsellingstatus').removeAttr('checked');
                        $('#rdosellingstatus').attr('checked', 'checked');
                    }
                    if (response.Data["Status"] === 2) {
                        $('#rdosellingstatus').removeAttr('checked');
                        $('#rdostopsellingstatus').attr('checked', 'checked');
                    }
                    var fields = $('.row-detail input[fieldData]');
                    $.each(fields, function (index, item) {
                        var fieldName = $(item).attr('fieldData');
                        var resValue = response.Data[fieldName] ? response.Data[fieldName] : "";
                        var dataType = $(item).attr('typedata');
                        switch (dataType) {
                            case "string":
                                item.value = resValue;
                                break;
                            case "number":
                                var numberString = "0";
                                if (resValue != "") {
                                    numberString = resValue.formatMoney();
                                }
                                item.value = numberString;
                                break;
                            case "money":
                                var moneyString = resValue.formatMoney();
                                item.value = moneyString;
                                break;
                            case "checkbox":
                                if (resValue === true) {
                                    document.getElementById("chkdisplayonscreen").checked = true;
                                }
                                else {
                                    document.getElementById("chkdisplayonscreen").checked = false;
                                }
                                break;
                        }
                    });
                    // Gán các trường không phải là input
                    document.getElementById("txtDescription").value = response.Data["Description"];
                    // Sinh các thẻ tag
                    // Cắt chuỗi danh sách thẻ
                    productAddColor = response.Data["ColorTag"];
                    productAddSize = response.Data["SizeTag"];
                    var colors = response.Data["ColorTag"].split(',');
                    var sizes = response.Data["SizeTag"].split(',');
                    // Sinh thẻ tag
                    $.each(colors, function (index, item) {
                        if (item != "") {
                            // Tạo thẻ tag
                            var colorNode = '<li class="input-property-tag-item" onclick=productDetail.removeColorTag(this,"' + item + '","' + detailRowIndex + '")><div class="input-property-tag-item-content"><span>' + item + '</span><span class="input-property-tag-item-dispose"></span></div></li>';
                            detailRowIndex += 1;
                            $('#inputcolorlist').append(colorNode);
                            $('#txtColorInput').val('');
                            // Gán giá trị thẻ vào các mảng
                            if (colorTagList.includes(item) === false) {
                                // Đẩy giá trị vào mảng
                                colorTagList.push(item);
                            }
                            // Thêm vào mảng các đối tượng Color/Size
                            $.each(sizes, function (index, sizeItem) {
                                if (sizeItem != "") {
                                    var itemColorSize = item.concat(sizeItem);
                                    if (listItemValue.includes(itemColorSize) === false) {
                                        listItemValue.push(itemColorSize);
                                    }
                                }
                            });
                        }
                    });
                    $.each(sizes, function (index, item) {
                        if (item != "") {
                            // Tạo thẻ tag
                            var colorNode = '<li class="input-property-tag-item" onclick=productDetail.removeSizeTag(this,"' + item + '","' + detailRowIndex + '")><div class="input-property-tag-item-content"><span>' + item + '</span><span class="input-property-tag-item-dispose"></span></div></li>';
                            detailRowIndex += 1;
                            $('#inputsizelist').append(colorNode);
                            $('#txtSizeInput').val('');
                            // Gán giá trị thẻ vào các mảng
                            if (sizeTagList.includes(item) === false) {
                                // Đẩy giá trị vào mảng
                                sizeTagList.push(item);
                            }
                        }
                    });
                    // Gán các giá trị đơn vị tính và nhóm hàng hóa
                    selectedCalculationUnit = response.Data["CalculationUnitID"];
                    selectedProductGroup = response.Data["ProductGroupID"];
                }
            },
            fail: function (response) {
                alert(response.Messenger);
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });
        // Ấn progess khi load xong
        $('.content-product-detail').css('background-color', 'white');

    }

    // Hàm lấy chi tiết hàng hóa theo ID
    // created by ntkien (08/05/2019)
    // modifield by ntkien (12/05/2019) : Thêm sự kiện xóa dòng
    getProductDetailByID() {
        $.ajax({
            type: 'GET',
            url: '/productdetails/' + currentID,
            dataType: 'json',
            success: function (response) {
                if (response.Data.length > 0) {
                    // Hiển thị bảng chi tiết
                    $('#tblproductdetail').css('display', 'flex');
                    // Đổ dữ liệu vào bảng chi tiết
                    var data = response.Data;
                    $.each(data, function (index, item) {
                        var html = '<div class="detail-product-table-row" rowindex="' + detailRowIndex + '" detailID = "' + item["ProductDetailID"] + '"></div>';

                        html = $(html).append('<div class="pro-detail-row-column pro-detail-header-productname"><input class="pro-detail-row-column-input" type= "text" maxlength= "255" value = "' + item["DetailName"] + '" fieldData ="DetailName" datatype="string" /></div>');
                        html = $(html).append('<div class="pro-detail-row-column pro-detail-header-sku"><input class="pro-detail-row-column-input" type= "text" maxlength= "20" value = "' + item["DetailSKUCode"] + '" maxlength="20" fieldData="DetailSKUCode" datatype="string" /></div>');
                        html = $(html).append('<div class="pro-detail-row-column pro-detail-header-barcode"><input class="pro-detail-row-column-input" type= "text" maxlength= "20" onkeypress= "onlyNumberInput(event)" value = "' + item["DetailBarcode"] + '" fieldData="DetailBarcode" datatype="string" /></div>');
                        html = $(html).append('<div class="pro-detail-row-column pro-detail-header-importprice"><input class="pro-detail-row-column-input pro-detail-input-number" type= "text" onkeyup= "autoCurrencyInput(this)" maxlength= "14" value = "' + item["DetailPurchasePrice"].formatMoney() + '" fieldData="DetailPurchasePrice" datatype="number" /></div>');
                        html = $(html).append('<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá"><input class="pro-detail-row-column-input pro-detail-input-number" type= "text" onkeyup= "autoCurrencyInput(this)" maxlength= "14" value = "' + item["DetailSalePrice"].formatMoney() + '" fieldData="DetailSalePrice" datatype="number" /><span class="row-column-input-price-option"></span></div>');
                        html = $(html).append('<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>');
                        html = $(html).append('<div class="pro-detail-row-column table-detail-task-delete" >'
                                + '<div class="table-detail-task-delete-icon" ></div>'
                            + '</div>');

                        $('.detail-product-table-body').append(html);
                    });
                }
            },
            fail: function (response) {
                alert(response.Messenger);
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }

    // Hàm xóa sàn phẩm
    // created by ntkien (22/04/2019)
    // modifield by ntkien : Sửa ajax type từ POST thành DELETE
    deleteProduct() {
        $.ajax({
            type: 'DELETE',
            url: '/products/' + currentID,
            dataType: 'json',
            success: function (response) {
                $('tbody').empty();
                //Load lại dữ liệu
                $("#dialogconfirmdelete").dialog("close");
                productJS.loadDataByCondition();
                // Xóa currentID
                currentID = "";
            },
            fail: function (response) {
                alert('fail');
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }

    // Hàm xóa nhiều sản phẩm cùng lúc theo mảng ID truyền vào
    // created by ntkien (25/04/2019)
    // modifield by ntkien (08/05/2019) : Sửa kiểu truyền dữ liệu
    deleteMultipeProduct() {
        var listProductID = new Array();
        $.each(selectedRow, function (index) {
            listProductID.push(selectedRow[index]);
        });
        $.ajax({
            type: 'POST',
            url: '/products/listid',
            data: { '': listProductID },
            dataType: 'json',
            success: function (response) {
                // Hiển thị lại các nút bị disable
                $('#btnDuplicateProduct').removeClass('toolbar-button-disable-event');
                $('#btnEditProduct').removeClass('toolbar-button-disable-event');
                $('tbody').empty();
                //Load lại dữ liệu
                $("#dialogconfirmdelete").dialog("close");
                productJS.loadDataByCondition();
            },
            fail: function (response) {
                alert('fail');
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });

    }

    // Hàm lấy danh sách đơn vị tính
    //Created by ntkien (04/05/2019)
    getCalculationUnit() {
        selectedCalculationUnit = null;
        $.ajax({
            url: '/calculationunits',
            method: 'GET',
            success: function (response) {
                if (response.Data.length > 0) {
                    var listUnit = $('.input-counter-option-block');
                    var value;
                    var calculationName;
                    $(listUnit).empty();
                    // Đổ dữ liệu vào danh sách đơn vị tính
                    $.each(response.Data, function (index, item) {
                        value = item["CalculationUnitID"];
                        calculationName = item["CalculationUnitName"];
                        //
                        $(listUnit).append('<li unitvalue ="' + value + '">' + calculationName + '</li>')
                    });
                    // Gán đơn vị tính mặc định
                    selectedCalculationUnit = response.Data[0].CalculationUnitID;
                    $('#txtcounterproduct').val(response.Data[0].CalculationUnitName);
                }
            },
            fail: function () {
                alert('fail');
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }

    // Hàm lấy danh sách nhóm hàng
    // created by ntkien    (07/05/2019)
    getGroupProduct() {
        selectedProductGroup = null;
        $.ajax({
            url: '/productgroups',
            method: 'GET',
            success: function (response) {
                if (response.Data.length > 0) {
                    var listUnit = $('.input-category-option-block');
                    var value;
                    var calculationName;
                    $(listUnit).empty();
                    // Đổ dữ liệu vào danh sách nhóm hàng
                    $.each(response.Data, function (index, item) {
                        value = item["ProductGroupID"];
                        calculationName = item["ProductGroupName"];
                        //
                        $(listUnit).append('<li unitvalue ="' + value + '">' + calculationName + '</li>')
                    });
                }
            },
            fail: function (response) {
                alert(response.Messenger);
            },
            error: function (response) {
                alert(response.Messenger);
            }
        });
    }

    // Hàm set currentID khi click vào 1 dòng
    // Created by ntkien (07/04/2019)
    // Modifed by ntkien (17/04/2019) : Sửa màu dòng chẵn, lử khi click vào dòng bất kỳ
    setCurrentID(productID, rowIndex, element) {
        //Đổi màu dòng khi click
        $('.grid-body-row').css('background-color', 'white');
        $('.grid-body-row-even').css('background-color', '#f6f6f6');
        $('table tr:eq(' + rowIndex + ')').css('background-color', '#c3ecff');
        // Lấy ID
        currentID = productID;
        currentProductName = $(element).find('.row-colum-productname a').text();
        currentBussineesID = $(element).find('.row-colum-sku').text();
    }

    // Hàm show contextmenu từng dòng của danh sách dữ liệu
    // created by ntkien (25/04/2019)
    contextMenu(productID, rowIndex, element) {
        //Đổi màu dòng khi click
        $('.grid-body-row').css('background-color', 'white');
        $('.grid-body-row-even').css('background-color', '#f6f6f6');
        $('table tr:eq(' + rowIndex + ')').css('background-color', '#c3ecff');
        // Lấy ID
        currentID = productID;
        currentProductName = $(element).find('.row-colum-productname a').text();
        currentBussineesID = $(element).find('.row-colum-sku').text();
        // Hiển thị contextmenu
        event.preventDefault();
        var positionX = event.clientX;
        var positionY = event.clientY;
        $('.product-contextmenu').css({
            display: 'block'
        });
        $('.product-contextmenu').offset({ top: positionY, left: positionX });
    }

    // Hàm nhấn đúp vào dòng dữ liệu nhảy vào trang sửa hàng hóa
    // created by ntkien (22/04/2019)
    dbclickToEdit(productID, rowIndex) {
        // set currentID là ID của hàng hóa vừa click
        currentID = productID;
        // Nhảy vào trang sửa hàng hóa
        // Hiển thị vùng sửa dữ liệu
        task = "edit";
        $('.panel-title-text-catalog').css('color', '#5490ae');
        $('.panel-title-text-task').text('/ Sửa');
        $('.panel-title-text-task').css('display', 'flex');
        $('.content-product').css('display', 'none');
        $('.content-product-detail').css('display', 'block');
        $('.panel-back').css('display', 'none');
        $('.content-status-option').css('display', 'flex');
        $('#txtproductimportprice').css('background-color', '#e5e6eb');
        $('#txtproductimportprice').attr('disabled', 'disabled');
        $('#txtproductsellprice').css('background-color', '#e5e6eb');
        $('#txtproductsellprice').attr('disabled', 'disabled');
        $('#txtproductbarcode').css('background-color', '#e5e6eb');
        $('#txtproductbarcode').attr('placeholder', '');
        $('#txtproductbarcode').attr('disabled', 'disabled');
        $('#txtproductname').focus();
        // Lấy dữ liệu đổ vào trang sửa
        productJS.getCalculationUnit();
        productJS.getGroupProduct();
        productJS.getProductByID();
        productJS.getProductDetailByID();
    }

    // Hàm lựa chọn dòng khi click vào checkbox đầu dòng
    // Created by ntkien (18/04/2019)
    chooseRowCheckbox(productID, rowIndex) {
        //Đổi màu dòng khi click
        $('.grid-body-row').css('background-color', 'white');
        $('.grid-body-row-even').css('background-color', '#f6f6f6');
        $('table tr:eq(' + rowIndex + ')').css('background-color', '#c3ecff');
        // Đổi icon của dòng được chọn
        if ($('table .grid-body-row-checkbox-icon:eq(' + rowIndex + ')').hasClass('grid-body-row-checkbox-icon-checked') === true) {
            $('table .grid-body-row-checkbox-icon:eq(' + rowIndex + ')').removeClass('grid-body-row-checkbox-icon-checked');
            // Xóa ID của hàng hóa trong danh sách các mặt hàng đang chọn
            var dropRowIDIndex = selectedRow.indexOf(productID);
            selectedRow.splice(dropRowIDIndex, 1);
            // Khi bỏ chọn 1 dòng bất kì thì checkbox chọn tất cả phải là đang không chọn tất cả
            if ($('.grid-header-checkcolumn-icon').hasClass('grid-body-row-checkbox-icon-checked') === true) {
                $('.grid-header-checkcolumn-icon').removeClass('grid-body-row-checkbox-icon-checked');
            }
        }
        else {
            $('table .grid-body-row-checkbox-icon:eq(' + rowIndex + ')').addClass('grid-body-row-checkbox-icon-checked');
            // Thêm ID của hàng hóa vào danh sách các mặt hàng đang chọn
            selectedRow.push(productID);
            // Nếu tất cả các dòng đã được chọn thì đổi icon của checkbox chọn tất cả
        }
        // Nếu đang chọn nhiều dòng thì không cho thực hiện nhân bản hoặc sửa
        if (selectedRow.length > 1) {
            $('#btnDuplicateProduct').addClass('toolbar-button-disable-event');
            $('#btnEditProduct').addClass('toolbar-button-disable-event');
        }
        else {
            $('#btnDuplicateProduct').removeClass('toolbar-button-disable-event');
            $('#btnEditProduct').removeClass('toolbar-button-disable-event');
        }
        // Lấy ID
        currentID = productID;
    }

    // Thay đổi màu div khi focusin vào input trong dialong
    // created by ntkien (06/04/2019)
    focusInputInDialog() {
        $('input').parents(".dialog-row-infor-input").removeClass("border-focus");
        $(this).parents(".dialog-row-infor-input").addClass("border-focus");
    }
    // Thay đổi màu div khi focusout khỏi input trong dialong
    // created by ntkien (06/04/2019)
    focusInputOutDialog() {
        $('input').parents(".dialog-row-infor-input").removeClass("border-focus");
    }
}

// Khởi tạo đối tượng JS
var productJS = new ProductJS();

//============================================================================ Các hàm bổ trợ=======================

// Hàm thao tác khi nhấn nút thêm mới hàng hóa hoặc chọn thêm mới trong contextmenu
// created by ntkien (25/04/2019)
function addProductClick() {
    task = "add";
    //$("#dialog-addproduct-content").dialog("open");
    $('.content-product').css('display', 'none');
    $('.panel-title-text-catalog').css('color', '#5490ae');
    $('.panel-title-text-task').text('/ Thêm mới');
    $('.panel-title-text-task').css('display', 'flex');
    $('.content-product-detail').css('display', 'block');
    $('.panel-back').css('display', 'none');
    $('.content-status-option').css('display', 'none');
    $('.row-detail-firstquantity').css('display', 'flex');
    document.getElementById("chkdisplayonscreen").checked = true;
    $('#txtproductname').focus();
    productJS.getCalculationUnit();
    productJS.getGroupProduct();
}

// Hàm thao tác khi nhấn nút nhân bản hoặc chọn nhân bản trong contextmenu
// created by ntkien (25/04/2019)
function dupplicateProductCick() {
    // Lấy dữ liệu

    // Hiển thị vùng nhân bản
    $('.content-product').css('display', 'none');
    $('.panel-title-text-catalog').css('color', '#5490ae');
    $('.panel-title-text-task').text('/ Thêm mới');
    $('.panel-title-text-task').css('display', 'flex');
    $('.content-product-detail').css('display', 'block');
    $('.panel-back').css('display', 'none');
    $('.content-status-option').css('display', 'none');
    $('.row-detail-firstquantity').css('display', 'flex');
    $('#txtproductbarcode').css('background-color', '#e5e6eb');
    $('#txtproductimportprice').css('background-color', '#e5e6eb');
    $('#txtproductimportprice').attr('disabled', 'disabled');
    $('#txtproductsellprice').css('background-color', '#e5e6eb');
    $('#txtproductsellprice').attr('disabled', 'disabled');
    $('#txtproductbarcode').attr('placeholder', '');
    $('#txtproductbarcode').attr('disabled', 'disabled');
    $('#txtproductname').focus();
}

// Hàm thao tác khi nhấn nút sửa hàng hóa hoặc chọn sửa trong contextmenu
// created by ntkien (25/04/2019)
function editProductCick() {
    task = "edit";
    // Hiển thị vùng sửa dữ liệu
    $('.panel-title-text-catalog').css('color', '#5490ae');
    $('.panel-title-text-task').text('/ Sửa');
    $('.panel-title-text-task').css('display', 'flex');
    $('.content-product').css('display', 'none');
    $('.content-product-detail').css('display', 'block');
    $('.panel-back').css('display', 'none');
    $('.content-status-option').css('display', 'flex');
    $('#txtproductimportprice').css('background-color', '#e5e6eb');
    $('#txtproductimportprice').attr('disabled', 'disabled');
    $('#txtproductsellprice').css('background-color', '#e5e6eb');
    $('#txtproductsellprice').attr('disabled', 'disabled');
    $('#txtproductbarcode').css('background-color', '#e5e6eb');
    $('#txtproductbarcode').attr('placeholder', '');
    $('#txtproductbarcode').attr('disabled', 'disabled');
    $('#txtproductname').focus();
    // Lấy dữ liệu đổ vào trang sửa
    productJS.getCalculationUnit();
    productJS.getGroupProduct();
    productJS.getProductByID();
    productJS.getProductDetailByID();
}
