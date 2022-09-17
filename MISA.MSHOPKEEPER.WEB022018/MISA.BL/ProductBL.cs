using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.BL
{
    /// <summary>
    /// Lớp thực hiện các thao tác với bảng hàng hóa
    /// </summary>
    /// created by ntkien   (03/05/2019)
    public class ProductBL
    {
        #region Declaration
        DL.ProductAccess _productBL;
        #endregion

        #region Constructor

        public ProductBL()
        {
            _productBL = new DL.ProductAccess();
        }

        #endregion

        #region Method

        /// <summary>
        /// Gọi hàm thực hiện lấy danh sách hàng hóa
        /// </summary>
        /// <returns>Danh sách hàng hóa</returns>
        /// created by ntkien   (04/05/2019)
        public List<Product> GetListProduct()
        {
            var listProduct = _productBL.GetListProduct();
            return listProduct;
        }

        /// <summary>
        /// Hàm gọi phương thức lấy danh sách hàng hóa theo điều kiện lọc và phân trang
        /// </summary>
        /// <param name="pageNumber">Số trang</param>
        /// <param name="pageSize">Số bản ghi trên trang</param>
        /// <param name="where">Điều kiện lọc</param>
        /// <returns>Danh sách hàng hóa phù hợp</returns>
        /// created by ntkien (10/05/2019)
        public List<Product> GetProductPaging(int pageNumber, int pageSize, string where)
        {
            var productPaging = _productBL.GetProductPaging(pageNumber, pageSize, where);
            return productPaging;
        }

        /// <summary>
        /// Gọi hàm thực hiện thêm mới hàng hóa
        /// </summary>
        /// <param name="newProduct">Thông tin mặt hàng mới</param>
        /// created by ntkien   (06/05/2019)
        public Guid InsertProduct(Product newProduct)
        {
            SetDefaultInsertProduct(newProduct);
            if (ValidateProduct(newProduct))
            {
                return _productBL.InsertProduct(newProduct);
            }
            else
            {
                return Guid.Empty;
            }
        }

        /// <summary>
        /// Hàm gọi phương thức lấy hàng hóa theo ID
        /// </summary>
        /// <param name="productID">ID hàng hóa muốn lấy</param>
        /// <returns>Hàng hóa có ID tương ứng</returns>
        /// created by ntkien (08/05/2019)
        public Product GetProductByID(Guid productID)
        {
            return _productBL.GetProductByID(productID);
        }

        /// <summary>
        /// Hàm gọi phương thức Update hàng hóa
        /// </summary>
        /// <param name="updateProduct">Thông tin mới của hàng hóa</param>
        /// <returns></returns>
        /// created by ntkien (08/05/2019)
        public bool UpdateProduct(Product updateProduct)
        {
            SetDefaultUpdateproduct(updateProduct);
            if (ValidateProduct(updateProduct))
            {
                _productBL.UpdateProduct(updateProduct);
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Hàm gọi phương thức xóa hàng hóa
        /// </summary>
        /// <param name="productID">ID hàng hóa muốn xóa</param>
        /// created by ntkien (08/05/2019)
        public void DeleteProduct(Guid productID)
        {
            _productBL.DeleteProduct(productID);
        }

        /// <summary>
        /// Hàm thực hiện validate thông tin hàng hóa thêm mới
        /// </summary>
        /// <param name="product">Thông tin mặt hàng mới</param>
        /// <returns>true : Thông tin hợp lê. False : Thông tin không hợp lệ</returns>
        /// created by ntkien   (07/05/2019)
        private bool ValidateProduct(Product product)
        {
            if (product.ProductName != null && product.ProductName.Length <= 255 && product.CalculationUnitID != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// Hàm gán các dữ liệu mặc định khi thêm mới hàng hóa
        /// </summary>
        /// <param name="product">Đối tượng hàng hóa</param>
        /// created by ntkien       (07/05/2019)
        private void SetDefaultInsertProduct(Product product)
        {
            product.CreatedDate = DateTime.Now;
        }

        /// <summary>
        /// Hàm gán các dữ liệu mặc định khi sửa thông tin hàng hóa
        /// </summary>
        /// <param name="product">Đối tượng hàng hóa</param>
        /// created by ntkien       (08/05/2019)
        private void SetDefaultUpdateproduct(Product product)
        {
            product.ModifiedDate = DateTime.Now;
        }

        /// <summary>
        /// Hàm gọi phương thức lấy ra ID hàng có mã SKU tương ứng
        /// </summary>
        /// <param name="skuCode">Mã SKU</param>
        /// <returns>Mã hàng hóa</returns>
        /// created by ntkien (09/05/2019)
        public object CheckProductCode(string skuCode)
        {
            return _productBL.CheckProductCode(skuCode);
        }

        #endregion

    }
}
