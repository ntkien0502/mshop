using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entity
{
    /// <summary>
    /// Lớp mô tả bảng dữ liệu ProductDetail trong DB
    /// </summary>
    /// created by ntkien   (08/05/2019)
    public class ProductDetail : EntityCommon
    {
        #region Declaration

        #endregion

        #region Property

        /// <summary>
        /// Khóa chính
        /// </summary>
        public Guid ProductDetailID { get; set; }

        /// <summary>
        /// Khóa ngoại - Mã hàng hóa
        /// </summary>
        public Guid ProductID { get; set; }

        /// <summary>
        /// Tên hàng chi tiết
        /// </summary>
        public string DetailName { get; set; }

        /// <summary>
        /// Mã SKU chi tiết
        /// </summary>
        public string DetailSKUCode { get; set; }

        /// <summary>
        /// Mã vạch chi tiết
        /// </summary>
        public string DetailBarcode { get; set; }

        /// <summary>
        /// Giá nhập chi tiết
        /// </summary>
        public decimal DetailPurchasePrice { get; set; }

        /// <summary>
        /// Giá bán chi tiết
        /// </summary>
        public decimal DetailSalePrice { get; set; }

        /// <summary>
        /// Tồn kho ban đầu chi tiết
        /// </summary>
        public decimal DetailInitialInventoryQuantity { get; set; }

        #endregion

        #region Constructor 

        #endregion

        #region Method



        #endregion
    }
}
