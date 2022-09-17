using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entity
{
    /// <summary>
    /// Lớp làm việc với bảng Calculation trong DB
    /// </summary>
    /// created by ntkien   (04/05/2019)
    public class CalculationUnit
    {
        #region Property

        /// <summary>
        /// Mã đơn vị tính - Khóa chính
        /// </summary>
        public Guid CalculationUnitID { get; set; }

        /// <summary>
        /// Tên đơn vị tính
        /// </summary>
        public string CalculationUnitName { get; set; }

        /// <summary>
        /// Mô tả
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Ngày tạo
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Người tạo
        /// </summary>
        public Guid CreatedBy { get; set; }

        /// <summary>
        /// Ngày chỉnh sửa
        /// </summary>
        public DateTime ModifiedDate { get; set; }


        #endregion

    }
}
