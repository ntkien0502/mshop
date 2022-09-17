using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entity
{
    /// <summary>
    /// Lớp miêu tả thông tin hàng hóa trong bảng dữ liệu
    /// </summary>
    /// created by ntkien (03/05/2019)
    /// modifeld by ntkien (09/05/2019) : Thêm property ColorTag; Thêm property SiseTag
    public class Product:EntityCommon
    {
        #region Property

        /// <summary>
        /// Khóa chính - mã hàng hóa
        /// </summary>
        public Guid ProductID { get; set; }

        /// <summary>
        /// Tên hàng hóa
        /// </summary>
        public string ProductName { get; set; }

        /// <summary>
        /// Mã SKU
        /// </summary>
        public string SKUCode { get; set; }

        /// <summary>
        /// Mã vạch
        /// </summary>
        public string BarCode { get; set; }

        /// <summary>
        /// Giá nhập vào
        /// </summary>
        public decimal PurchasePrice { get; set; }

        /// <summary>
        /// Giá bán ra
        /// </summary>
        public decimal SalePrice { get; set; }

        /// <summary>
        /// Đơn vị tính
        /// </summary>
        public Guid CalculationUnitID { get; set; }

        /// <summary>
        /// Tồn kho ban đầu
        /// </summary>
        public decimal InitialInventoryQuantity { get; set; }

        /// <summary>
        /// Tồn kho nhỏ nhất
        /// </summary>
        public decimal MinQuantity { get; set; }

        /// <summary>
        /// Tồn kho lớn nhất
        /// </summary>
        public decimal MaxQuantity { get; set; }

        /// <summary>
        /// Vị trí lưu trữ trong kho
        /// </summary>
        public string StockLocation { get; set; }

        /// <summary>
        /// Vị trí trưng bày
        /// </summary>
        public string DisplayLocation { get; set; }

        /// <summary>
        /// Trạng thái
        /// </summary>
        public int Status { get; set; }

        /// <summary>
        /// Hiển thị trên màn hình bán hàng
        /// </summary>
        public bool InActive { get; set; }

        /// <summary>
        /// Mô tả
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Nhóm hàng
        /// </summary>
        public Guid ProductGroupID { get; set; }

        /// <summary>
        /// Chuỗi Color tag
        /// </summary>
        public string ColorTag { get; set; }

        /// <summary>
        /// Chuỗi Size Tag
        /// </summary>
        public string SizeTag { get; set; }

        /// <summary>
        /// Hình ảnh minh họa
        /// </summary>
        public string Image { get; set; }

        /// <summary>
        /// Loại hàng
        /// </summary>
        public Guid ProductTypeID { get; set; }

        /// <summary>
        /// tên nhóm hàng hóa - theo khóa ngoại
        /// </summary>
        public string ProductGroupName { get; set; }

        /// <summary>
        /// Tên đơn vị tính - truy vấn theo khóa ngoại
        /// </summary>
        public string CalculationUnitName { get; set; }

        /// <summary>
        /// Tên loại hàng hóa - ttruy vấn theo khóa ngoại
        /// </summary>
        public string ProductTypeName { get; set; }

        /// <summary>
        /// Tên tài khoản người sửa - truy vấn theo khóa ngoại
        /// </summary>
        public string UserName { get; set; }


        #endregion

    }
}
