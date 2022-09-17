$(document).ready(function () {
    $('#txtproductname').focus();
});

// Biến nhận biết Mã SKU code có hợp lệ hay không
var isBarcodeMap = true;
// Biến nhận biết kiểm tra mã để thêm mới hay để sinh mã mới
var checkOrAddCode;
// Chỉ số phía sau của mã hàng hóa tự sinh
var suffixNumberCode = 1;

// Lớp ProductDetail làm việc với màn hình ProductDetail
// Created by ntkien (15/04/2019)
class ProductDetail {

    // Hàm khởi tạo
    constructor() {
        this.initEvent();
    }
    // Hàm Gán các sự kiện
    // created by ntkien (15/04/2019)
    initEvent() {
        // Nhấn nút hủy bỏ => Hiển thị lại danh sách và lấy lại trạng thái một số control
        $('#btnProductTopCancel').on('click', function () {
            clearDetailTable();
            refreshDetailControl();
        });
        $('#btnProductBottomCancel').on('click', function () {
            clearDetailTable();
            refreshDetailControl();
        });

        // Nhấn nút thêm mới / sửa hàng hóa
        $('#btnProductBottomSave').on('click', function () {
            if (task === "add") {
                checkOrAddCode = "add";
                if ($('#txtproductname').val().trim() === "" || isBarcodeMap === false) {
                    if ($('#txtproductname').val().trim() === "") {
                        $('#txtproductname').focus();
                    }
                    if (isBarcodeMap === false) {
                        $('#txtproductbarcode').focus();
                    }
                }
                else {
                    productDetail.isExistProductCode();
                }
            }
            else {
                productDetail.editProduct();
            }
        });
        $('#btnProductTopSave').on('click', function () {
            if (task === "add") {
                checkOrAddCode = "add";
                if ($('#txtproductname').val().trim() === "" || isBarcodeMap === false) {
                    if ($('#txtproductname').val().trim() === "") {
                        $('#txtproductname').focus();
                    }
                    if (isBarcodeMap === false) {
                        $('#txtproductbarcode').focus();
                    }
                }
                else {
                    productDetail.isExistProductCode();
                }
            }
            else {
                productDetail.editProduct();
            }
        });

        // Đồng ý đóng dialog thông báo trùng mã
        $('#btnconfirmcheck').on('click', function () {
            $("#dialogdupplicaeproductcode").dialog("close");
        });
        //========================================= Thêm chi tiết khi có thẻ tag hoặc size ===========================================
        // Thêm thẻ tag Color sau khi nhấn enter
        $('#txtColorInput').on('keyup', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            var nameValue = $('#txtproductname').val();
            //Tạo mảng chứa các giá trị đã có
            var colorValue = $('#txtColorInput').val().replace(/\\/g, '');
            var sizeValue = "";
            if (keycode == '13') {
                if (colorTagList.includes(colorValue) === false) {
                    // Đẩy giá trị vào mảng
                    colorTagList.push(colorValue);
                    // Set danh sách ColorTag khi thêm mới
                    productAddColor = "";
                    $.each(colorTagList, function (index, item) {
                        productAddColor += (item.concat(','));
                    });
                    // Tạo thẻ tag
                    var colorNode =
                        '<li class="input-property-tag-item" colortagtext = "' + colorValue + '" onclick=productDetail.removeColorTag(this,"' + colorValue + '","' + detailRowIndex + '")>'
                        + '<div class="input-property-tag-item-content">'
                            + '<span>' + colorValue + '</span>'
                            + '<span class="input-property-tag-item-dispose"></span>'
                        + '</div></li>';
                    $('#inputcolorlist').append(colorNode);
                    $('#txtColorInput').val('');
                    // Giá trị giá nhập của hàng hóa
                    var purchasePrice = $('#txtproductimportprice').val();
                    var salePriceValue = $('#txtproductsellprice').val();
                    // Nếu chưa có size thì thêm dòng chỉ có màu
                    if (sizeTagList.length === 0) {
                        // Sinh mã code
                        var colorCode = colorValue.slice(0, 2).toUpperCase();
                        var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(colorCode));
                        //Thêm dòng vào bảng chi tiết
                        var detailRow =
                            '<div class="detail-product-table-row" rowindex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                                + '<div class="pro-detail-row-column pro-detail-header-productname">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + colorValue + ")" + '" fieldData ="DetailName" datatype="string" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-sku">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-importprice">'
                                + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="number" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                                + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="number" />'
                                + '<span class="row-column-input-price-option"></span>'
                            + '</div>'
                            + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>'
                            + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")>'
                                + '<div class="table-detail-task-delete-icon">'
                            + '</div></div></div>';
                        $('.detail-product-table-body').append(detailRow);
                        detailRowIndex += 1;
                    }
                        // Nếu có size rồi thì tạo vòng lặp thêm màu và size
                    else {
                        for (var i = 0; i < sizeTagList.length; i++) {
                            // Xóa các dòng cùng màu nhưng chưa có size
                            productDetail.removeRowWithoutSize(colorValue);
                            //Thêm dòng vào bảng chi tiết
                            sizeValue = sizeTagList[i];
                            // Sinh mã code
                            var sizeCode = sizeValue.toUpperCase();
                            var colorCode = colorValue.slice(0, 2).toUpperCase();
                            var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(colorCode), '-', changeStringToSlug(sizeCode));
                            var itemColorSize = colorValue + sizeValue;
                            var detailRow =
                                '<div class="detail-product-table-row" rowIndex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                                + '<div class="pro-detail-row-column pro-detail-header-productname">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + colorValue + '/' + sizeTagList[i] + ")" + '" fieldData ="DetailName" datatype="string" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-sku">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-importprice">'
                                 + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="string" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                                    + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="string" />'
                                    + '<span class="row-column-input-price-option"></span>'
                                + '</div>'
                                + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>'
                                + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")><div class="table-detail-task-delete-icon">'
                                + '</div></div></div>';
                            // Nếu chưa tồn tại màu và size thì thêm vào
                            if (listItemValue.includes(itemColorSize) === false) {
                                $('.detail-product-table-body').append(detailRow);
                                listItemValue.push(itemColorSize);
                            }
                            detailRowIndex += 1;
                            sizeValue = "";
                        }
                    }
                }
                else {
                    $('#txtColorInput').val('');
                }
                if ($('#tblproductdetail').css('display') === 'none') {
                    $('#tblproductdetail').css('display', 'flex');
                }
            }
        });
        // Thêm thẻ tag Size khi nhấn enter
        $('#txtSizeInput').on('keyup', function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            var nameValue = $('#txtproductname').val();
            //Tạo mảng chứa các giá trị đã có
            var sizeValue = $('#txtSizeInput').val().replace(/\\/g, '');
            var colorValue = "";
            if (keycode == '13') {
                if (sizeTagList.includes(sizeValue) === false) {
                    // Đẩy giá trị vào mảng
                    sizeTagList.push(sizeValue);
                    productAddSize = "";
                    $.each(sizeTagList, function (index, item) {
                        productAddSize += (item.concat(','));
                    });
                    // Tạo thẻ tag
                    var colorNode =
                        '<li class="input-property-tag-item" sizetagtext = "' + sizeValue + '" onclick=productDetail.removeSizeTag(this,"' + sizeValue + '","' + detailRowIndex + '")>'
                        + '<div class="input-property-tag-item-content">'
                            + '<span>' + sizeValue + '</span>'
                            + '<span class="input-property-tag-item-dispose"></span>'
                        + '</div></li>';
                    $('#inputsizelist').append(colorNode);
                    $('#txtSizeInput').val('');
                    // Giá trị giá nhập của hàng hóa
                    var salePriceValue = $('#txtproductsellprice').val();
                    var purchasePrice = $('#txtproductimportprice').val();
                    if (colorTagList.length === 0) {
                        // Sinh mã code
                        var sizeCode = sizeValue.toUpperCase();
                        var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(sizeCode));
                        //Thêm dòng vào bảng chi tiết
                        var detailRow =
                            '<div class="detail-product-table-row" rowindex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                            + '<div class="pro-detail-row-column pro-detail-header-productname">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + sizeValue + ")" + '" fieldData ="DetailName" datatype="string" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-sku">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                                + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-importprice">'
                                + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="number" />'
                            + '</div>'
                            + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                                + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="number" />'
                                + '<span class="row-column-input-price-option"></span>'
                            + '</div>'
                            + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới">'
                            + '</div>'
                            + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")><div class="table-detail-task-delete-icon">'
                            + '</div></div></div>';
                        $('.detail-product-table-body').append(detailRow);
                        detailRowIndex += 1;
                    }
                    else {
                        for (var i = 0; i < colorTagList.length; i++) {
                            // Xóa các dòng không có size hoặc color
                            productDetail.removeRowWithoutSize(colorValue);
                            //Thêm dòng vào bảng chi tiết
                            colorValue = colorTagList[i];
                            // Sinh mã code
                            var sizeCode = sizeValue.toUpperCase();
                            var colorCode = colorValue.slice(0, 2).toUpperCase();
                            var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(colorCode), '-', changeStringToSlug(sizeCode));
                            var itemColorSize = colorValue + sizeValue;
                            var detailRow =
                                '<div class="detail-product-table-row" rowindex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                                + '<div class="pro-detail-row-column pro-detail-header-productname">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + colorValue + '/' + sizeValue + ')" fieldData ="DetailName" datatype="string" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-sku">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                                    + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-importprice">'
                                    + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="number" />'
                                + '</div>'
                                + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                                    + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="number" />'
                                    + '<span class="row-column-input-price-option"></span>'
                                + '</div>'
                                + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>'
                                + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")><div class="table-detail-task-delete-icon"></div>'
                                + '</div></div>';
                            if (listItemValue.includes(itemColorSize) === false) {
                                $('.detail-product-table-body').append(detailRow);
                                listItemValue.push(itemColorSize);
                            }
                            detailRowIndex += 1;
                            colorValue = "";
                        }
                    }
                }
                else {
                    $('#txtSizeInput').val('');
                }
                if ($('#tblproductdetail').css('display') === 'none') {
                    $('#tblproductdetail').css('display', 'flex');
                }
            }
        });

        //==================================================================================================================================
        // Focus vào các ô nhập liệu
        $('.row-detail-input').on('focusin', function () {
            $('input').parents(".row-input-div").css('border-color', '#ccc');
            $(this).parents(".row-input-div").css("border-color", '#77b0e2');
        });
        $('.row-detail-input').on('focusout', function () {
            $('input').parents(".row-input-div").css('border-color', '#ccc');
        });
        $('#txtproductname').on('focusin', function () {
            $('#txtproductname').parents(".row-input-div-productname").css('border-color', '#77b0e2');
        });
        $('#txtproductname').on('focusout', function () {
            // Sinh mã tự động không trùng
            productDetail.autoCreateProductCode();
        });
        // Khi click vào ô nhập liệu thì tự động bôi đen giá trọ trong ô đó
        $('.row-detail-input').on('focus', function () {
            $(this).select();
        });
        $('.row-input-div-manyinput-content-input').on('focus', function () {
            $(this).select();
        });

        // Ô nhập liệu màu sắc và size
        $('.input-colour-property').on('focusin', function () {
            $('input').parents(".row-input-div-manyinput-content").css('border-color', '#ccc');
            $(this).parents(".row-input-div-manyinput-content").css("border", '1px solid #77b0e2');
        });
        $('.input-colour-property').on('focusout', function () {
            $('input').parents(".row-input-div-manyinput-content").css('border-color', '#ccc');
        });

        // Lựa chọn nhóm hàng hóa
        //$('#divcategoryoption li').hover(function () {
        //    if ($('.input-category-option-block li').index(this) != currentGroupIndex) {
        //        $(this).css("background-color", "#026b97");
        //    }
        //}, function () {
        //    if ($('.input-category-option-block li').index(this) != currentGroupIndex) {
        //        $(this).css("background-color", "white");
        //    }
        //    });

        $('#divcategoryoption').on('mouseover', 'li', function () {
            if ($('.input-category-option-block li').index(this) != currentGroupIndex) {
                $(this).css("background-color", "#026b97");
            }
        });
        $('#divcategoryoption').on('mouseout', 'li', function () {
            if ($('.input-category-option-block li').index(this) != currentGroupIndex) {
                $(this).css("background-color", "white");
            }
        });

        $('#divcategoryoption').on('click', 'li', function () {

            var currentText = this.textContent;
            $('.input-category-option-block li').css('background-color', '#ffffff');
            // Gán index item hiện tại đang được lựa chọn
            currentGroupIndex = $('.input-category-option-block li').index(this);
            $('.input-category-option-block li:eq(' + currentGroupIndex + ')').css('background-color', '#77b0e2');
            $('#txtproductcategory').val(currentText);
            $('#txtproductcategory').focus();
            selectedProductGroup = $(this).attr('unitvalue');

        });

        //$('#divcategoryoption li').on('click', function () {
        //    var currentText = this.textContent;
        //    $('.input-category-option-block li').css('background-color', '#ffffff');
        //    // Gán index item hiện tại đang được lựa chọn
        //    currentGroupIndex = $('.input-category-option-block li').index(this);
        //    $('.input-category-option-block li:eq(' + currentGroupIndex + ')').css('background-color', '#77b0e2');
        //    $('#txtproductcategory').val(currentText);
        //    $('#txtproductcategory').focus();
        //});

        $('#cbocategoryoption').on('click', function () {
            $('#divcategoryoption').toggle();
            $('.input-list-option-block').focus();
        });
        $(document).on('click', function (e) {
            if (!e.target.closest('#cbocategoryoption') && !e.target.closest('#cbocounteroption')) {
                $('.input-list-option').css('display', 'none');
            }
        });

        // Lựa chọn đơn vị tính
        //$('#divcounteroption li').hover(function () {
        //    if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
        //        $(this).css("background-color", "#026b97");
        //    }
        //}, function () {
        //    if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
        //        $(this).css("background-color", "white");
        //    }
        //});
        $('#divcounteroption').on('mouseover', 'li', function () {
            if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
                $(this).css("background-color", "#026b97");
            }
        });
        $('#divcounteroption').on('mouseout', 'li', function () {
            if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
                $(this).css("background-color", "white");
            }
        });
        //$('#divcounteroption li').hover(function () {
        //    if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
        //        $(this).css("background-color", "#026b97");
        //    }
        //}, function () {
        //    if ($('.input-counter-option-block li').index(this) != currentUnitIndex) {
        //        $(this).css("background-color", "white");
        //    }
        //});
        $('#cbocounteroption').on('click', function () {
            $('#divcounteroption li').css('display', 'list-item');
            $('#divcounteroption').toggle();
        });
        $('#divcounteroption').on('click', 'li', function () {
            var currentText = this.textContent;
            $('.input-counter-option-block li').css('background-color', '#ffffff');
            currentUnitIndex = $('.input-counter-option-block li').index(this);
            $('.input-counter-option-block li:eq(' + currentUnitIndex + ')').css('background-color', '#77b0e2');
            $('#txtcounterproduct').val(currentText);
            $('#txtcounterproduct').focus();
            // Xác định mã của đơn vị tính đang được lựa chọn
            selectedCalculationUnit = $(this).attr('unitvalue');
        });
        //$('#divcounteroption li').on('click', function () {
        //    var currentText = this.textContent;
        //    $('.input-counter-option-block li').css('background-color', '#ffffff');
        //    currentUnitIndex = $('.input-counter-option-block li').index(this);
        //    $('.input-counter-option-block li:eq(' + currentUnitIndex + ')').css('background-color', '#77b0e2');
        //    $('#txtcounterproduct').val(currentText);
        //    $('#txtcounterproduct').focus();
        //});
        //============================================================= Các hàm validate dữ liệu ======================================
        // Validate tên hàng hóa
        $('#txtproductname').on('focusout', function () {
            if ($('#txtproductname').val() === "") {
                $('#row-input-div-productname').css('border', 'none');
                $('#txtproductname').css('border', '1px solid red');
                $('#errorproductname').css('display', 'block');
            }
        });
        $('#txtproductname').on('keyup', function () {
            if ($('#txtproductname').val() === "") {
                $('#row-input-div-productname').css('border', 'none');
                $('#txtproductname').css('border', '1px solid red');
                $('#errorproductname').css('display', 'block');
            }
            else {
                $('#row-input-div-productname').css('border', '1px solid #77b0e2');
                $('#txtproductname').css('border', 'none');
                $('#errorproductname').css('display', 'none');
            }
        });

        // validate mã vạch
        $('#txtproductbarcode').on('keyup', isNumberInput);

        // Validate chỉ nhập số trong ô giá
        $('#txtproductimportprice').on('keypress', onlyNumberInput);
        $('#txtproductsellprice').on('keypress', onlyNumberInput);
        $('#txtfirstquantity').on('keypress', onlyNumberInput);
        $('#txtminquantity').on('keypress', onlyNumberInput);
        $('#txtmaxquantity').on('keypress', onlyNumberInput);



        //Nhập vào là tiền
        $('.row-detail-input-number').on('keyup', function () {
            var p = /^[0-9\.]*$/g;
            //kiểm tra nhập vào là số và có dấu chấm
            if (p.test($(this).val())) {
                var value = Number($(this).val().split('.').join('')).formatMoney();
                if (value == 0 || value == '0') {
                    $(this).val('');
                } else {
                    $(this).val(value);
                }
            } else {
                $(this).val('');
            }
        });

        $('#txtsalepricesearch').on('keypress', onlyNumberInput);

        // Autocomplete combobox
        $('#txtcounterproduct').on('keyup', function () {
            // Hiển thị những hàng hóa giống chuỗi nhập vào
            var lis = $('.input-counter-option-block li');
            var count = 0;
            //
            $.each(lis, function (index, item) {
                if (item.innerText.toLowerCase().search($('#txtcounterproduct').val().toLowerCase()) != -1) {
                    $('#divcounteroption').css('display', 'block');
                    $(item).css('display', 'list-item');
                } else {
                    $('#divcounteroption').css('display', 'block');
                    $(item).css('display', 'none');
                }
            });
        });
        $('#txtproductcategory').on('keyup', function () {
            // Hiển thị những hàng hóa giống chuỗi nhập vào
            var lis = $('.input-category-option-block li');
            $.each(lis, function (index, item) {
                if (item.innerText.toLowerCase().search($('#txtproductcategory').val().toLowerCase()) != -1) {
                    $('#divcategoryoption').css('display', 'block');
                    $(item).css('display', 'list-item');
                } else {
                    $('#divcategoryoption').css('display', 'block');
                    $(item).css('display', 'none');
                }
            });
        });
        // Lựa chọn ảnh minh họa
        $('#fileLoader').change(function () {
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#imgproduct').css('display', 'block');
                    $('#imgproduct').attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        // Hủy bỏ hình ảnh minh họa
        $('#btndisposeimage').on('click', function () {
            $('#imgproduct').css('display', 'none');
            $('#imgproduct').attr('src', '');
        });
    }

    //============================================================================== Các hàm sự kiện==============================================

    // Hàm xóa thẻ tag color
    // created by ntkien (15/04/2019)
    removeColorTag(element, colorValue, detailRowIndex) {
        // Xóa thẻ tag
        var itemIndex = colorTagList.indexOf(colorValue);
        colorTagList.splice(itemIndex, 1);
        productAddColor = "";
        $.each(colorTagList, function (index, item) {
            productAddColor += (item.concat(','));
        });
        element.remove();
        // Xóa dòng trong bảng chi tiết
        // Xóa các dòng có màu tương ứng
        $('.detail-product-table-row[colorvalue="' + colorValue + '"]').remove();
        for (var i = 0; i < sizeTagList.length; i++) {
            var itemColorSize = colorValue + sizeTagList[i];
            var itemColorSizeIndex = listItemValue.indexOf(itemColorSize);
            listItemValue.splice(itemColorSizeIndex, 1);
        }
        //Nếu xóa hết màu mà size vẫn còn => Thêm lại dòng cho các size
        if (colorTagList.length === 0 && sizeTagList.length != 0) {
            var nameValue = $('#txtproductname').val();
            colorValue = "";
            // Giá trị giá nhập của hàng hóa
            var salePriceValue = $('#txtproductsellprice').val();
            var purchasePrice = $('#txtproductimportprice').val();
            for (var j = 0; j < sizeTagList.length; j++) {
                var sizeValue = sizeTagList[j];
                // Sinh mã code
                var sizeCode = sizeValue.toUpperCase();
                var colorCode = colorValue.slice(0, 2).toUpperCase();
                var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(colorCode), '-', changeStringToSlug(sizeCode));

                var detailRow =
                    '<div class="detail-product-table-row" rowIndex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                    + '<div class="pro-detail-row-column pro-detail-header-productname">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + colorValue + '/' + sizeTagList[j] + ')" fieldData ="DetailName" datatype="string" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-sku">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-importprice">'
                        + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="number" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                        + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="number" />'
                        + '<span class="row-column-input-price-option"></span>'
                    + '</div>'
                    + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>'
                    + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")>'
                    + '<div class="table-detail-task-delete-icon"></div>'
                    + '</div></div>';
                $('.detail-product-table-body').append(detailRow);
                detailRowIndex += 1;
            }
        }
        $('#txtColorInput').focus();
        // Ẩn bảng nếu như đã xóa hết
        if (colorTagList.length === 0 && sizeTagList.length === 0) {
            $('#tblproductdetail').css('display', 'none');
        }
    }

    // Hàm xóa thẻ tag size
    // created by ntkien (15/04/2019)
    removeSizeTag(element, sizeValue, detailRowIndex) {
        // Xóa thẻ tag
        var itemIndex = colorTagList.indexOf(sizeValue);
        sizeTagList.splice(itemIndex, 1);
        productAddSize = "";
        $.each(sizeTagList, function (index, item) {
            productAddSize += (item.concat(','));
        });
        element.remove();
        // Xóa dòng trong bảng chi tiết
        // Xóa tất cả các dòng có size tương ứng
        $('.detail-product-table-row[sizevalue="' + sizeValue + '"]').remove();
        for (var i = 0; i < colorTagList.length; i++) {
            var itemColorSize = colorTagList[i] + sizeValue;
            var itemColorSizeIndex = listItemValue.indexOf(itemColorSize);
            listItemValue.splice(itemColorSizeIndex, 1);
        }
        // Nếu xóa hết size mà màu vẫn còn thì vẽ lại các dòng của color
        if (colorTagList.length != 0 && sizeTagList.length === 0) {
            var nameValue = $('#txtproductname').val();
            sizeValue = "";
            // Giá trị giá nhập của hàng hóa
            var salePriceValue = $('#txtproductsellprice').val();
            var purchasePrice = $('#txtproductimportprice').val();
            for (var j = 0; j < colorTagList.length; j++) {
                var colorValue = colorTagList[j];
                // Sinh mã code
                var sizeCode = sizeValue.toUpperCase();
                var colorCode = colorValue.slice(0, 2).toUpperCase();
                var colorEndcode = $('#txtskucode').val().concat('-', changeStringToSlug(colorCode), '-', changeStringToSlug(sizeCode));
                var detailRow =
                    '<div class="detail-product-table-row" rowIndex="' + detailRowIndex + '" colorvalue ="' + colorValue + '" sizevalue ="' + sizeValue + '">'
                    + '<div class="pro-detail-row-column pro-detail-header-productname">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="255" value="' + nameValue + "(" + colorValue + '/' + sizeValue + ')" fieldData ="DetailName" datatype="string" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-sku">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="20" fieldData="DetailSKUCode" datatype="string" value = "' + colorEndcode + '" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-barcode">'
                        + '<input class="pro-detail-row-column-input" type="text" maxlength="20" onkeypress="onlyNumberInput(event)" fieldData="DetailBarcode" datatype="string" />'
                    + '</div><div class="pro-detail-row-column pro-detail-header-importprice">'
                        + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + purchasePrice + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailPurchasePrice" datatype="number" />'
                    + '</div>'
                    + '<div class="pro-detail-row-column pro-detail-header-price" title="Áp dụng chính sách giá">'
                        + '<input class="pro-detail-row-column-input pro-detail-input-number" onfocus="autoSelectOnFocus(this)" type="text" value="' + salePriceValue + '" maxlength="14" onkeyup="autoCurrencyInput(this)" fieldData="DetailSalePrice" datatype="number" />'
                        + '<span class="row-column-input-price-option"></span>'
                    + '</div>'
                    + '<div class="pro-detail-row-column table-detail-task-copy" title="Sao chép giá mua, giá bán và bảng giá xuống các dòng dưới"></div>'
                    + '<div class="pro-detail-row-column table-detail-task-delete" onclick=productDetail.deleteDetailRow("' + detailRowIndex + '","' + colorValue + '","' + sizeValue + '")>'
                    + '<div class="table-detail-task-delete-icon"></div>'
                    + '</div></div>';
                $('.detail-product-table-body').append(detailRow);
                detailRowIndex += 1;
            }
        }
        $('#txtSizeInput').focus();
        // Ẩn bảng nếu như đã xóa hết
        if (colorTagList.length === 0 && sizeTagList.length === 0) {
            $('#tblproductdetail').css('display', 'none');
        }
    }

    //Hàm xóa các dòng có màu nhưng chưa có size
    // created by ntkien (15/02/2019)
    removeRowWithoutSize(colorValue) {
        $('.detail-product-table-row[sizevalue=""]').remove();
        $('.detail-product-table-row[colorvalue=""]').remove();
    }

    // Hàm xóa dòng ProductDetail khi thêm mới
    // created by ntkien (13/05/2019)
    deleteDetailRow(rowIndex, colorValue, sizeValue) {
        // Xóa dòng dữ liệu
        $('.detail-product-table-row[rowindex="' + rowIndex + '"]').remove();
        // Xóa giá trị Color tương ứng
        //var itemColorIndex = colorTagList.indexOf(colorValue);
        //colorTagList.splice(itemColorIndex, 1);
        // Xóa giá trị Size tương ứng
        //var itemSizeIndex = sizeTagList.indexOf(sizeValue);
        //sizeTagList.splice(itemSizeIndex, 1);
        // Xóa giá trị trong mảng Color/Size tương ứng
        var itemColorSize = colorValue + sizeValue;
        var itemColorSizeIndex = listItemValue.indexOf(itemColorSize);
        listItemValue.splice(itemColorSizeIndex, 1);
        // Xóa thẻ tag nếu đã hết giá trị
        var includeColor = 0;
        var includeSize = 0;
        for (var i = 0; i < listItemValue.length; i++) {
            if (listItemValue[i].includes(colorValue) === true) {
                includeColor += 1;
            }
            if (listItemValue[i].endsWith(sizeValue) === true) {
                includeSize += 1;
            }
        }
        if (includeColor == 0) {
            var itemColorIndex = colorTagList.indexOf(colorValue);
            colorTagList.splice(itemColorIndex, 1);
            // 
            productAddColor = "";
            $.each(colorTagList, function (index, item) {
                productAddColor += (item.concat(','));
            });
            // Xóa thẻ color Tag có màu tương ứng
            var removeTag = $('li[colortagtext="' + colorValue + '"]');
            removeTag.remove();
        }
        if (includeSize == 0) {
            var itemSizeIndex = sizeTagList.indexOf(sizeValue);
            sizeTagList.splice(itemSizeIndex, 1);
            //
            productAddSize = "";
            $.each(sizeTagList, function (index, item) {
                productAddSize += (item.concat(','));
            });
            // Xóa thẻ size tag
            var removeTag = $('li[sizetagtext="' + sizeValue + '"]');
            removeTag.remove();
        }
    }

    // Hàm sinh mã tự động không trùng 
    // created by ntkien (11/05/2019)
    autoCreateProductCode() {
        $('#txtproductname').parents(".row-input-div-productname").css('border-color', '#ccc');
        // Sau khi thay đổi tên hàng hóa => Các hàng hóa trong bảng chi tiết cũng thay đổi
        //$('.pro-detail-row-column-input').val("A");
        checkOrAddCode = "check";
        // Tự sinh mã hàng hóa theo tên hàng hóa
        var productNameValue = $('#txtproductname').val().trim();
        if (productNameValue != "" && task === "add") {
            var skuCodeArray = "";
            // Cắt lấy chữ cái đầu của mỗi chữ
            var listCharacter = productNameValue.split(' ');
            $.each(listCharacter, function (index, item) {
                var firstCharacter = item.slice(0, 1).toUpperCase();
                skuCodeArray += firstCharacter;
            })
            // Gộp lại thành mã tự sinh
            var nameCode = changeStringToSlug(skuCodeArray);
            $('#txtskucode').val(nameCode.concat('0', suffixNumberCode));
            // Kiểm tra trùng mã. Nếu trùng thì tăng chữ số lên 1
            productDetail.isExistProductCode();
        }
    }

    //================================================================== Các hàm thao tác dữ liệu============================================
    addNewProduct() {
        var fields = $('.row-detail').find('[fieldData]');
        var obj = {};
        $.each(fields, function (index, item) {
            var fielData = item.attributes.fieldData.value;
            var dataType = item.attributes.typedata.value;
            switch (dataType) {
                // Gán các dữ liệu kiểu chuỗi
                case "string":
                    obj[fielData] = (item.value ? item.value : "");
                    break;
                    // Gán các dữ liệu kiểu checkbox cho DisplayOnScreen
                case "checkbox":
                    if ($('#chkdisplayonscreen').prop("checked") == true) {
                        obj[fielData] = true;
                    }
                    else {
                        obj[fielData] = false;
                    }
                    break;
                case "number":
                    var numberCustom = item.value.replace(/\./g, '');
                    obj[fielData] = Number(numberCustom);
                    break;
                default:
                    obj[fielData] = (item.value ? item.value : "");
                    break;
            }
        });
        obj["ColorTag"] = productAddColor;
        obj["SizeTag"] = productAddSize;
        // Các trường có giá trị mặc định khi thêm mới
        obj["Status"] = 1;
        obj["ProductGroupID"] = selectedProductGroup;
        obj["CalculationUnitID"] = selectedCalculationUnit;
        //Set ID loại hàng mặ định là hàng hóa
        obj["ProductTypeID"] = "15027954-ccc2-4c76-9128-b656ae00f755";
        obj["Description"] = $('#txtDescription').val();
        // Gọi API 
        $.ajax({
            type: "POST",
            url: '/products/new',
            dataType: 'json',
            data: obj,
            success: function (response) {
                if (response.Success === true) {
                    lastestProductID = response.Data;
                    // Gọi hàm thêm chi tiết hàng hóa
                    var listProductDetail = $('.detail-product-table-body .detail-product-table-row');
                    if (listProductDetail.length > 0) {
                        productDetail.addProductDetail();
                    }
                    clearDetailTable();
                    //Load lại dữ liệu
                    $('tbody').empty();
                    $('.content-product-detail').css('display', 'none');
                    $('.content-product').css('display', 'block');
                    $('.panel-back').css('display', 'flex');
                    $('.row-detail-firstquantity').css('display', 'none');
                    refreshDetailControl();
                    // File Product.js phải load trước file ProductDetail.js
                    productJS.loadData();
                }
                else {
                    alert(response.Messenger);
                }
            },
            error: function () {
                alert('Có lỗi sảy ra, vui lòng thử lại sau !');
            },
            fail: function () {
                alert('fail');
            }
        });
    }

    // Hàm thêm chi tiết hàng hóa sau khi đã thêm hàng hóa
    //created by ntkien (09/05/2019)
    addProductDetail() {
        var listProductDetail = [];
        var numberOfDetail = $('.detail-product-table-body .detail-product-table-row');
        var fields = $('.detail-product-table-body').find('[fieldData]');
        var productDetailEntity = {};
        $.each(fields, function (index, item) {
            var fielData = item.attributes.fieldData.value;
            var dataType = item.attributes.datatype.value;
            switch (dataType) {
                case "string":
                    productDetailEntity[fielData] = (item.value ? item.value : "");
                    break;
                case "number":
                    var numberCustom = item.value.replace(/\./g, '');
                    productDetailEntity[fielData] = Number(numberCustom);
                    break;
            }
            if (fielData == "DetailSalePrice") {
                productDetailEntity["ProductID"] = lastestProductID;
                listProductDetail.push(productDetailEntity);
                productDetailEntity = {};
            }
        });
        // Gọi API thêm chi tiết hàng hóa
        $.ajax({
            type: 'POST',
            url: '/productdetails/listDetail',
            data: { '': listProductDetail },
            dataType: 'json',
            success: function () {

            },
            fail: function () {
                alert('fail');

            },
            error: function () {
                alert('error');
            }
        });
    }

    // Hàm thự hiện sửa hàng hóa
    // created by ntkien (23/04/2019)
    editProduct() {
        var fields = $('.row-detail').find('[fieldData]');
        var obj = {};
        obj["ProductID"] = currentID;
        $.each(fields, function (index, item) {
            var fielData = item.attributes.fieldData.value;
            var dataType = item.attributes.typedata.value;
            switch (dataType) {
                // Gán các dữ liệu kiểu chuỗi
                case "string":
                    obj[fielData] = item.value;
                    break;
                    // Gán các dữ liệu kiểu checkbox cho DisplayOnScreen
                case "checkbox":
                    if ($('#chkdisplayonscreen').prop("checked") == true) {
                        obj[fielData] = true;
                    }
                    else {
                        obj[fielData] = false;
                    }
                    break;
                case "number":
                    var numberCustom = item.value.replace(/\./g, '');
                    debugger;
                    obj[fielData] = Number(numberCustom);
                    break;
                default:
                    obj[fielData] = item.value;
                    break;
            }
        });
        // các trường có giá trị không bằng text
        if ($('#rdosellingstatus').prop("checked") == true) {
            obj["Status"] = 1;
        }
        if ($('#rdostopsellingstatus').prop("checked") == true) {
            obj["Status"] = 2;
        }
        obj["ProductTypeID"] = "15027954-ccc2-4c76-9128-b656ae00f755";
        obj["Description"] = $('#txtDescription').val();
        obj["CalculationUnitID"] = selectedCalculationUnit;
        obj["ProductGroupID"] = selectedProductGroup;
        // Gọi API sửa dữ liệu
        $.ajax({
            url: '/products/edit',
            type: 'PUT',
            dataType: 'json',
            data: obj,
            success: function () {
                clearDetailTable();
                $('tbody').empty();
                //Load lại dữ liệu
                refreshDetailControl();
                // File Product.js phải load trước file ProductDetail.js
                productJS.loadData();
            }, fail: function () {
                alert('fail');

            }, error: function () {
                alert('error');
            }
        });
    }

    // Hàm kiểm tra mã SKU của hàng hóa đã tồn tại hay chưa
    //created by ntkien (09/05/2019)
    isExistProductCode() {
        var skuCode = $('#txtskucode').val().trim();
        $.ajax({
            type: 'POST',
            url: '/products/' + skuCode,
            dataType: 'json',
            success: function (response) {
                if (response.Success === true) {
                    if (checkOrAddCode === "add") {
                        productDetail.addNewProduct();
                    }
                    if (checkOrAddCode === "check") {
                        // Sinh mã mới
                        return suffixNumberCode;
                    }
                }
                else {
                    if (checkOrAddCode === "add") {
                        $('#dialog-dupplicate-productcode').text(skuCode);
                        $("#dialogdupplicaeproductcode").dialog("open");
                    }
                    if (checkOrAddCode === "check") {
                        // Sinh mã mới
                        suffixNumberCode += 1;
                        productDetail.autoCreateProductCode();
                    }
                }
            },
            fail: function () {
                alert('fail');
            },
            error: function () {
                alert('error');
            }
        });
    }
}
var productDetail = new ProductDetail();

//================================================ Các hàm bổ trợ  =========================================================
// Hàm chỉ cho nhập số trong input
//created by ntkien (198/04/2019)
function onlyNumberInput(evt) {
    var char = String.fromCharCode(evt.which);
    if (!(/[0-9]/.test(char)) && (evt.which != 13)) {
        evt.preventDefault();
    }
}

// Hàm chỉ cho nhập số trong ô mã vạch
// Created by ntkien (23/04/2019)
function isNumberInput(evt) {
    var inputValue = $('#txtproductbarcode').val();
    if (!Number.isInteger(Number(inputValue))) {
        $('#row-input-div-barcode').css('border', 'none');
        $('#txtproductbarcode').css('border', '1px solid red');
        $('#errorbarcode').css('display', 'block');
        isBarcodeMap = false;
    }
    else {
        $('#row-input-div-barcode').css('border', '1px solid #77b0e2');
        $('#txtproductbarcode').css('border', 'none');
        $('#errorbarcode').css('display', 'none');
        isBarcodeMap = true;
    }
}

// Hàm xóa bảng chi tiết khi thực thực hiện hủy hoặc đã thêm mới hàng hóa
// created by ntkien (09/05/2019)
function clearDetailTable() {
    // Empty và ẩn bảng Chi tiết hàng hóa
    $('.detail-product-table-body').empty();
    $('#tblproductdetail').css('display', 'none');
    // Xóa các thẻ tag
    while (colorTagList.length > 0) {
        colorTagList.pop();
    }
    while (sizeTagList.length > 0) {
        sizeTagList.pop();
    }
    while (listItemValue.length > 0) {
        listItemValue.pop();
    }
    $('#inputsizelist').empty();
    $('#inputcolorlist').empty();
}

// Hàm lấy lại trạng thái một số control khi nhấn nút hủy
// Created by ntkien (18/04/2019)
function refreshDetailControl() {
    // Mở lại danh sách
    $('.content-product-detail').css('display', 'none');
    $('.content-product').css('display', 'block');
    $('.panel-back').css('display', 'flex');
    $('.row-detail-firstquantity').css('display', 'none');
    // Hiển thị lại trạng thái ban đầu của một số control
    $('.panel-title-text-catalog').css('color', '#212121');
    $('.panel-title-text-task').css('display', 'none');
    $('.row-input-div-productname').css('border', '1px solid #77b0e2');
    $('#txtproductname').css('border', 'none');
    $('.row-detail-input-error').css('display', 'none');
    $('#txtproductbarcode').css('background-color', '#ffffff');
    $('#txtproductimportprice').css('background-color', '#ffffff');
    $('#txtproductsellprice').css('background-color', '#ffffff');
    $('#txtproductbarcode').attr('placeholder', 'Hệ thống tự sinh khi bỏ trống');
    $('#txtproductbarcode').removeAttr('disabled');
    $('#txtproductimportprice').removeAttr('disabled');
    $('#txtproductsellprice').removeAttr('disabled');
    // Set giá trị của các ô nhập liệu về giá trị ban đầu
    document.getElementById("txtDescription").value = "";
    var clearField = $('.row-detail').find('[typedata]');
    $.each(clearField, function (index, item) {
        var dataType = item.attributes.typedata.value;
        switch (dataType) {
            case "number":
                item.value = "0";
                break;
            case "string":
                item.value = "";
                break;
                //case "checkbox":
                //    item.attr('checked', 'checked');
                //    break;
        }
    });
    // Gán các giá trị đã chọn về trạng thái ban đầu
    selectedProductGroup = null;
    selectedCalculationUnit = null;
}
// Hàm select dữ liệu trong input text khi focus vào
// Created by ntkien (23/04/2019)
function autoSelectOnFocus(element) {
    element.focus();
    element.select();
}
// Hàm tự động chuyển giá trị ô nhập về định dạng tiền tệ
// created by ntkien (23/04/2019)
function autoCurrencyInput(element) {
    var p = /^[0-9\.]*$/g;
    //kiểm tra nhập vào là số và có dấu chấm
    if (p.test($(element).val())) {
        var value = Number($(element).val().split('.').join('')).formatMoney();
        if (value == 0 || value == '0') {
            $(element).val('');
        } else {
            $(element).val(value);
        }
    } else {
        $(element).val('');
    }
}

// Hàm chuyển ký tự có dấu thành không giấu
// created by ntkien (09/05/2019)
function changeStringToSlug(inputString) {
    var slug = inputString;
    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'A');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'E');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'I');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'O');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'U');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'Y');
    slug = slug.replace(/đ/gi, 'D');
    return slug;
}

// Hàm tự động sinh mã chi tiết dựa theo mã hàng hóa
// created by ntkien (10/05/2019)
function autoCreatedProductDetailCode(productSkucode) {

}
// Hàm mở dialog chọn file
// created by ntkien (13/05/2019)
function openfileDialog() {
    $("#fileLoader").click();
}
