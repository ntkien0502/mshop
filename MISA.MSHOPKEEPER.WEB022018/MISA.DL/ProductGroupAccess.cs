using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.DL
{
    /// <summary>
    /// Lớp thực hiện thao tác với bảng ProductGroup trong DB
    /// </summary>
    /// created by ntkien   (07/05/2019)
    public class ProductGroupAccess :DataAccess<ProductGroup>
    {
        #region Declaration

        #endregion

        #region Constructor

        #endregion

        #region Method

        /// <summary>
        /// Hàm lấy danh sách nhóm hàng hóa
        /// </summary>
        /// created by ntkien (07/05/2019)
        public List<ProductGroup> GetListProductGroup()
        {
            // Lấy dữ liệu
            var listProductGroup = new DataAccess<ProductGroup>();
            return listProductGroup.GetEntity("[dbo].[Proc_GetProductGroup]");
        }
        #endregion
    }
}
