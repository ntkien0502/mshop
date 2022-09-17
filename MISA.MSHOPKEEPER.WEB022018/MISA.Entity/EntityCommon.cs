using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entity
{
    /// <summary>
    /// Các thông tin chung của các bảng trong DB
    /// </summary>
    /// created by ntkien   (03/05/2019)
    public class EntityCommon
    {
        #region Declartion


        #endregion

        #region Property

        /// <summary>
        /// Ngày tạo
        /// </summary>
        public DateTime CreatedDate { get; set; }

        /// <summary>
        /// Người sửa
        /// </summary>
        public Guid CreatedBy { get; set; }

        /// <summary>
        /// Ngày sửa
        /// </summary>
        public DateTime ModifiedDate { get; set; }

        #endregion



    }
}
