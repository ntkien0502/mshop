using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.DL
{
    /// <summary>
    /// Lớp thực hiện các thao tác với bảng Product trong DB
    /// </summary>
    /// created by ntkien (07/05/2019)
    public class ProductAccess : DataAccess<Product>
    {
        #region Declaration


        #endregion

        #region Constructor

        #endregion

        #region Method

        /// <summary>
        /// Hàm lấy danh sách hàng hóa
        /// </summary>
        /// <returns>Danh sách hàng hóa</returns>
        /// created by ntkien (03/05/2019)
        public List<Product> GetListProduct()
        {
            // Lấy dữ liệu
            var listProduct = new DataAccess<Product>();
            return listProduct.GetEntity("[dbo].[Proc_GetListProduct]");
        }

        /// <summary>
        /// Hàm lấy danh sách hàng háo theo điều kiện lọc
        /// </summary>
        /// <param name="pageNumber">Số trang</param>
        /// <param name="pageSize">Số bản ghi treen trang</param>
        /// <param name="where">Điều kiện lọc</param>
        /// <returns>Danh sách hàng hóa phù hợp</returns>
        /// created by ntkien (10/05/2019)
        public List<Product> GetProductPaging(int pageNumber, int pageSize, string where)
        {
            var listProduct = new List<Product>();
            // Lấy dữ liệu
            _sqlCommand.CommandText = "[dbo].[Proc_SelectProductPaging]";
            _sqlCommand.Parameters.AddWithValue("@PageNumber", pageNumber);
            _sqlCommand.Parameters.AddWithValue("@PageSize", pageSize);
            _sqlCommand.Parameters.AddWithValue("@Where", where);
            var sqlDataReader = _sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                var product = new Product();
                for (int i = 0; i < sqlDataReader.FieldCount; i++)
                {
                    var fieldName = sqlDataReader.GetName(i);
                    var fieldValue = sqlDataReader[i];
                    var property = product.GetType().GetProperty(fieldName);
                    if (property != null && fieldValue != System.DBNull.Value)
                    {
                        property.SetValue(product, fieldValue);
                    }
                }
                listProduct.Add(product);
            }
            // Trả lại dữ liệu
            return listProduct;
        }

        /// <summary>
        /// Hàm Thêm mới hàng hóa
        /// </summary>
        /// <param name="newProduct">Đối tượng hàng háo</param>
        /// created by ntkien   (07/05/2019)
        /// modifield by ntkien (09/05/2019) : Đổi dữ liệu trả về
        /// modifield by ntkien (13/05/2019) : Gọi base thay cho viết lại hàm
        public Guid InsertProduct(Product newProduct)
        {
            //_sqlCommand.CommandText = "[dbo].[Proc_InsertProduct]";
            //SqlCommandBuilder.DeriveParameters(_sqlCommand);
            //foreach (SqlParameter p in _sqlCommand.Parameters)
            //{
            //    if (_sqlCommand.Parameters.IndexOf(p) != 0)
            //    {
            //        var property = p.ParameterName.Replace("@", "");
            //        var value = newProduct.GetType().GetProperty(property).GetValue(newProduct);
            //        p.Value = value == null ? DBNull.Value : value;
            //    }
            //}
            //var lastID = (Guid)_sqlCommand.ExecuteScalar();
            //return lastID;
            var product = new DataAccess<Product>();
            return product.InsertEntityReturnID(newProduct, "[dbo].[Proc_InsertProduct]");
        }

        /// <summary>
        /// Hàm gọi Store lấy hàng hóa theo ID từ DB
        /// </summary>
        /// <param name="productID">ID hàng hóa muốn lấy</param>
        /// <returns>Hàng hóa có ID tương ứng</returns>
        /// created by ntkien (08/05/2019)
        /// modifield by ntkien (13/05/2019) : Gọi base thay cho viết lại hàm
        public Product GetProductByID(Guid productID)
        {
            //// Lấy dữ liệu
            //_sqlCommand.CommandText = "[dbo].[Proc_GetProductByID]";
            //_sqlCommand.Parameters.AddWithValue("@ID", productID);
            //var sqlDataReader = _sqlCommand.ExecuteReader();
            //var product = new Product();
            //while (sqlDataReader.Read())
            //{
            //    for (int i = 0; i < sqlDataReader.FieldCount; i++)
            //    {
            //        var fieldName = sqlDataReader.GetName(i);
            //        var fieldValue = sqlDataReader[i];
            //        var property = product.GetType().GetProperty(fieldName);
            //        if (property != null && fieldValue != System.DBNull.Value)
            //        {
            //            property.SetValue(product, fieldValue);
            //        }
            //    }
            //}
            //// Trả lại dữ liệu
            //return product;
            var mapProduct = new DataAccess<Product>();
            return mapProduct.GetEntityByID(productID, "[dbo].[Proc_GetProductByID]");
        }

        /// <summary>
        /// Hàm gọi store update hàng hóa
        /// </summary>
        /// <param name="updateProduct">Thông tin mới của  hàng hóa</param>
        /// created by ntkien (11/05/2019)
        /// modifield by ntkien (13/05/2019) : Gọi hàm base thay cho viết từ đầu
        public void UpdateProduct(Product updateProduct)
        {
            //_sqlCommand.CommandText = "[dbo].[Proc_UpdateProduct]";
            var product = new DataAccess<Product>();
            product.UpdateEntity(updateProduct, "[dbo].[Proc_UpdateProduct]");
        }

        /// <summary>
        /// Hàm thực hiện gọi store xóa hàng hóa trong DB
        /// </summary>
        /// <param name="productID">ID hàng muốn xóa</param>
        /// created by ntkien (08/05/2019)
        public void DeleteProduct(Guid productID)
        {
            _sqlCommand.CommandText = "[dbo].[Proc_DeleteProduct]";
            _sqlCommand.Parameters.AddWithValue("@ProductID", productID);
            _sqlCommand.ExecuteNonQuery();
            _sqlCommand.Parameters.Clear();
        }

        /// <summary>
        /// Hàm gọi Store lấy danh sách SKU Code ra để kiểm tra có trùng hay không
        /// </summary>
        /// created by ntkien (09/05/2019)
        public object CheckProductCode(string skuCode)
        {
            _sqlCommand.CommandText = "[dbo].[Proc_GetProductBySkucode]";
            _sqlCommand.Parameters.AddWithValue("@SKUCode", skuCode);
            var mapID = _sqlCommand.ExecuteScalar();
            return mapID;
        }
        #endregion
    }
}
