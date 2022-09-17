using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.BL
{
    /// <summary>
    /// Lớp thực hiện gọi các thao tác với bảng Nhóm hàng hóa
    /// </summary>
    /// created by ntkien   (07/05/2019)
    public class ProductGroupBL
    {
        #region Declaration
        DL.ProductGroupAccess _productGroupBL;
        #endregion

        #region Constructor

        public ProductGroupBL()
        {
            _productGroupBL = new DL.ProductGroupAccess();
        }
        #endregion

        #region Method

        /// <summary>
        /// Hàm gọi phương thức lấy danh sách nhóm hàng
        /// </summary>
        /// <returns>Danh sách nhóm hàng hóa</returns>
        /// created by ntkien   (07/05/2019)
        public List<ProductGroup> GetListProductGroup()
        {
            return _productGroupBL.GetListProductGroup();
        }

        #endregion

    }
}
