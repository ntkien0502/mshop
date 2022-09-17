using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.DL
{
    /// <summary>
    /// Lớp thực hiện các thao tác với bảng CalculationUnit trong DB
    /// </summary>
    public class CalculationUnitAccess:DataAccess<CalculationUnit>
    {

        #region Declaration


        #endregion

        #region CÓntructor


        #endregion

        #region Method

        /// <summary>
        /// Hàm lấy danh sách đơn vị tính
        /// </summary>
        /// <returns>Danh sách đơn vị tính</returns>
        /// created by ntkien   (04/05/2019)
        public List<CalculationUnit> GetListCalculationUnit()
        {
            // Lấy dữ liệu
            var listCalculationUnit = new DataAccess<CalculationUnit>();
            return listCalculationUnit.GetEntity("[dbo].[Proc_GetCalculationUnit]");
        }
        #endregion
    }
}
