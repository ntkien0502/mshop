using MISA.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.BL
{
    /// <summary>
    /// Lớp thực hiện các thao tác với bảng đơn vị tính
    /// </summary>
    /// created by ntkien   (04/05/2019)
     public class CalculationUnitBL
    {
        #region Declaration

        DL.CalculationUnitAccess _calculationUnitBL;

        #endregion

        #region Constructor
        public CalculationUnitBL()
        {
            _calculationUnitBL = new DL.CalculationUnitAccess();
        }

        #endregion

        #region Method

        /// <summary>
        /// Gọi hàm lấy danh sách đơn vị tính của tầng DL
        /// </summary>
        /// <returns>Danh sách đơn vị tính</returns>
        /// created by ntkien   (04/05/2019)
        public List<CalculationUnit> GetListCalculationUnit()
        {
            return _calculationUnitBL.GetListCalculationUnit();
        }
        #endregion
    }
}
