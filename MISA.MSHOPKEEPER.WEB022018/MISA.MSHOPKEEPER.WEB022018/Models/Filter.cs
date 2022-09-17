using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MISA.MSHOPKEEPER.WEB022018.Models
{
    /// <summary>
    /// Lớp điều kiện lọc
    /// </summary>
    /// created by ntkien (10/05/2019)
    public class Filter
    {

        #region Declaration
        /// <summary>
        /// Điều kiện lọc
        /// </summary>
        public string FilterType { get; set; }

        /// <summary>
        /// Giá trị lọc
        /// </summary>
        public string FilterValue { get; set; }

        /// <summary>
        /// Cột dữ liệu
        /// </summary>
        public string FieldName { get; set; }
        #endregion

        /// <summary>
        /// Hàm xây dựng chuỗi điều kiện lọc để đưa vào truy vấn
        /// </summary>
        /// <param name="filters">Danh sách điều kiện lọc</param>
        /// <returns>Chuỗi điều kiện lọc</returns>
        /// created by ntkien (10/05/2019)
        public static string BuildWhereCondition(List<Filter> filters)
        {
            var where = string.Empty;
            foreach (var item in filters)
            {
                var fieldName = item.FieldName;
                var filterValue = item.FilterValue;
                var filterType = item.FilterType;
                switch (filterType)
                {
                    case "*":
                        where += String.Format(" AND {0} LIKE N'%{1}%'", fieldName, filterValue);
                        break;
                    case "+":
                        where += String.Format(" AND {0} LIKE N'{1}%'", fieldName, filterValue);
                        break;
                    case "-":
                        where += String.Format(" AND {0} LIKE N'%{1}'", fieldName, filterValue);
                        break;
                    case "!":
                        where += String.Format(" AND {0} NOT LIKE N'%{1}%'", fieldName, filterValue);
                        break;
                    case "<":
                        where += String.Format(" AND {0} < {1}", fieldName, filterValue);
                        break;
                    case ">":
                        where += String.Format(" AND {0} > {1}", fieldName, filterValue);
                        break;
                    case "<=":
                        where += String.Format(" AND {0} <= {1}", fieldName, filterValue);
                        break;
                    case ">=":
                        where += String.Format(" AND {0} >= {1}", fieldName, filterValue);
                        break;
                    default:
                        where += String.Format(" AND {0} = N'{1}'", fieldName, filterValue);
                        break;
                }
            }
            return where;
        }
    }
}
