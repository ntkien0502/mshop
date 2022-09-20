using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MISA.Entity
{
    public class BaseAccess
    {
        /// <summary>
        /// Các lớp kế thừa BaseAccess, dù cùng Assembly hay không thì đều truy cập được ProtectedAccess
        /// </summary>
        protected string ProtectedAccess;

        /// <summary>
        /// Các lớp cùng Assembly, dù có kế thừa BaseAccess hay không thì cũng truy cập được InternalAccess
        /// </summary>
        internal string InternalAccess;

        /// <summary>
        /// Các lớp cùng Assembly (dù có kế thừa BaseAccess hay không) và các lớp kế thừa BaseAccess ngoài Assembly thì truy cập được ProtecedInternalAccess
        /// </summary>
        protected internal string ProtecedInternalAccess;
    }

    /// <summary>
    /// AccessModifier kế thừa BaseAccess => dùng được cả 3 thuộc tính
    /// </summary>
    public class AccessModifier : BaseAccess
    {

        public void SetAccess()
        {
            ProtectedAccess = "";
            InternalAccess = "";
            ProtecedInternalAccess = "";
        }
    }

    /// <summary>
    /// AccessModifier1 không kế thừa BaseAccess nhưng cùng Assembly nên có thể dùng được InternalAccess, ProtecedInternalAccess
    /// </summary>
    public class AccessModifier1
    {

        public void SetAccess()
        {
            BaseAccess a = new BaseAccess();
            //a.ProtectedAccess = ""; // Mở dòng này ra sẽ báo lỗi
            a.InternalAccess = "";
            a.ProtecedInternalAccess = "";
        }
    }
}
