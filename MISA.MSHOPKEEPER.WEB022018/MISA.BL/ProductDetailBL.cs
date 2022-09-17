using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MISA.DL;
using MISA.Entity;

namespace MISA.BL
{
    /// <summary>
    /// Lớp thực hiện các thao tác với bảng ProductDetail trong DB
    /// </summary>
    /// created by ntkien (08/05/2019)
    public class ProductDetailBL
    {
        #region Declaration
        ProductDetailAccess _productDetail;
        #endregion

        #region Constructor
        public ProductDetailBL()
        {
            _productDetail = new ProductDetailAccess();
        }

        #endregion

        #region Method

        /// <summary>
        /// Hàm gọi phương thức lấy danh sách chi tiết hàng hóa theo ID hàng hóa truyền vào
        /// </summary>
        /// <param name="productID">ID hàng hóa</param>
        /// <returns>Chi tiết hàng hóa</returns>
        /// created by ntkien   (08/05/2019)
        public List<ProductDetail> GetProductDetailByID(Guid productID)
        {
            return _productDetail.GetProductDetailByID(productID);
        }

        /// <summary>
        /// Hàm gọi phương thức thêm mới chi tiết hàng hóa
        /// </summary>
        /// <param name="productDetail">Đối tượng chi tiết hàng hóa</param>
        /// created by ntkien (09/05/2019)
        public void InsertProductDetail(ProductDetail productDetail)
        {
            SetDefaultInsertProductDetail(productDetail);
            _productDetail.InsertProductDetail(productDetail);
        }

        /// <summary>
        /// Hàm gán các giá trị mặc định của ProductDetail khi thêm mới
        /// </summary>
        /// <param name="newProductDetail">Đối tượng chi tiết hàng hóa</param>
        /// created by ntkien (09/05/2019)
        private void SetDefaultInsertProductDetail(ProductDetail newProductDetail)
        {
            newProductDetail.CreatedDate = DateTime.Now;
        }
        #endregion
    }
}
