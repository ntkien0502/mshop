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
    /// Lớp thực hiện các thao tác với bảng ProductDetail trong DB
    /// </summary>
    /// created by ntkien (08/05/2019)
    public class ProductDetailAccess : DataAccess<ProductDetail>
    {
        #region Declaration

        #endregion

        #region Constructor

        #endregion

        #region Method

        /// <summary>
        /// Hàm gọi Store lấy danh sách chi tiết hàng hóa theo ID hàng hóa truyền vào
        /// </summary>
        /// <param name="productID">ID hàng hóa</param>
        /// <returns>Danh sách các chi tiết hàng hóa</returns>
        /// created by ntkien (08/05/2019)
        /// modifield bt ntkien (13/05/2019) : Gọi base thay cho viết lại hàm
        public List<ProductDetail> GetProductDetailByID(Guid productID)
        {
            //var listDetail = new List<ProductDetail>();
            //// Lấy dữ liệu
            //_sqlCommand.CommandText = "[dbo].[Proc_GetProductDetailByID]";
            //_sqlCommand.Parameters.AddWithValue("@ID", productID);
            //var sqlDataReader = _sqlCommand.ExecuteReader();
            //while (sqlDataReader.Read())
            //{
            //    var detail = new ProductDetail();
            //    for (int i = 0; i < sqlDataReader.FieldCount; i++)
            //    {
            //        var fieldName = sqlDataReader.GetName(i);
            //        var fieldValue = sqlDataReader[i];
            //        var property = detail.GetType().GetProperty(fieldName);
            //        if (property != null && fieldValue != System.DBNull.Value)
            //        {
            //            property.SetValue(detail, fieldValue);
            //        }
            //    }
            //    listDetail.Add(detail);
            //}
            //// Trả lại dữ liệu
            //return listDetail;
            var listDetailByID = new DataAccess<ProductDetail>();
            return listDetailByID.GetListEntityByID(productID, "[dbo].[Proc_GetProductDetailByID]");
        }

        /// <summary>
        /// Hàm gọi Srore thêm chi tiết hàng hóa
        /// </summary>
        /// <param name="productDetail">Đối tượng chi tiết hàng hóa</param>
        /// created by ntkien (09/05/2019)
        /// modifield by ntkien (13/05/2019) : Gọi base thay cho viết lại hàm
        public void InsertProductDetail(ProductDetail productDetail)
        {
            var newProductDetail = new DataAccess<ProductDetail>();
            newProductDetail.InsertLoopEntity(productDetail, "[dbo].[Proc_InsertProductDetail]");

        }

        #endregion
    }
}
