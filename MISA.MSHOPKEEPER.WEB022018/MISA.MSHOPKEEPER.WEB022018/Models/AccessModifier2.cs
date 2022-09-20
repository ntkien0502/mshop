using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MISA.Entity;

namespace MISA.MSHOPKEEPER.WEB022018.Models
{
    /// <summary>
    /// AccessModifier2 kế thừa BaseAccess nhưng không cùng Assembly nên chỉ dùng được ProtectedAccess, ProtecedInternalAccess
    /// </summary>
    public class AccessModifier2 : BaseAccess
    {
        public void SetAccess()
        {
            ProtectedAccess = "";

            //InternalAccess = ""; // Mở dòng này ra sẽ báo lỗi

            ProtecedInternalAccess = "";
        }
    }

    /// <summary>
    /// AccessModifier3 không kế thừa BaseAccess và cũng không cùng Assembly nên không dùng được thuộc tính nào của BaseAccess
    /// </summary>
    public class AccessModifier3
    {
        public void SetAccess()
        {
            BaseAccess a = new BaseAccess();

            //a.ProtectedAccess = ""; // Mở dòng này ra sẽ báo lỗi

            //a.InternalAccess = ""; // Mở dòng này ra sẽ báo lỗi

            //a.ProtecedInternalAccess = "";// Mở dòng này ra sẽ báo lỗi
        }
    }
}