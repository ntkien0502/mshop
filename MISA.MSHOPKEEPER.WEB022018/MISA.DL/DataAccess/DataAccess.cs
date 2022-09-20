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
    /// Lớp kết nối cơ sở dữ liệu thực thi Interface IDisposable
    /// </summary>
    /// created by ntkien   (03/05/2019)
    public class DataAccess<T> : IDisposable
    {
        #region Declaration

        protected SqlConnection _sqlConnection;
        protected SqlCommand _sqlCommand;
        protected string _connectionString = @"Data Source=NTKIEN2\MISASME2021;Initial Catalog=MISA.Mshopkeeper.NTKIEN_Development;Integrated Security=True";

        #endregion

        #region Hàm khởi tạo

        /// <summary>
        /// Khởi tạo các đối tượng cần thiết để thực hiện kết nối
        /// </summary>
        /// created by ntkien (04/05/2019)
        public DataAccess()
        {
            if (_sqlConnection == null)
            {
                _sqlConnection = new SqlConnection(_connectionString);
            }
            _sqlCommand = _sqlConnection.CreateCommand();
            _sqlCommand.CommandType = System.Data.CommandType.StoredProcedure;
            // Mở kết nối dữ liệu
            if (_sqlConnection.State == System.Data.ConnectionState.Closed)
            {
                _sqlConnection.Open();
            }
        }

        #endregion

        #region Method

        /// <summary>
        /// Hàm base Lấy danh sách dữ liệu theo đối tượng truyền vào
        /// </summary>
        /// <param name="storeProcedureName">tên store thực hiện</param>
        /// <returns>Danh sách dữ liệu theo đối tượng</returns>
        /// created by ntkien (11/05/2019)
        public List<T> GetEntity(string storeProcedureName)
        {
            var listEntity = new List<T>();
            // Lấy dữ liệu
            _sqlCommand.CommandText = storeProcedureName;
            var sqlDataReader = _sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                var product = Activator.CreateInstance<T>();
                for (int i = 0; i < sqlDataReader.FieldCount; i++)
                {
                    var fieldName = sqlDataReader.GetName(i);
                    var fieldValue = sqlDataReader[i];
                    var property = product.GetType().GetProperty(fieldName);
                    if (property != null && fieldValue != System.DBNull.Value)
                    {
                        property.SetValue(product, fieldValue);
                    }
                }
                listEntity.Add(product);
            }
            // Trả lại dữ liệu
            return listEntity;
        }

        /// <summary>
        /// hàm base thêm mới đối tượng và không trả lại dữ liệu
        /// </summary>
        /// <param name="entity">Đối tượng muốn thêm mới</param>
        /// <param name="storeProcedureName">Tên store thực hiện</param>
        /// created by ntkien (13/05/2019)
        public void InsertLoopEntity(T entity, string storeProcedureName)
        {
            _sqlCommand.CommandText = storeProcedureName;
            SqlCommandBuilder.DeriveParameters(_sqlCommand);
            foreach (SqlParameter p in _sqlCommand.Parameters)
            {
                if (_sqlCommand.Parameters.IndexOf(p) != 0)
                {
                    var property = p.ParameterName.Replace("@", "");
                    var value = entity.GetType().GetProperty(property).GetValue(entity);
                    p.Value = value == null ? DBNull.Value : value;
                }
            }
            _sqlCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Hàm base thêm mới đối tượng và trả lại ID vừa thêm mới
        /// Phục vụ thêm bảng master detail
        /// </summary>
        /// <param name="newEntity">Đối tượng thêm mới</param>
        /// <param name="storeProcedureName">store thực hiện</param>
        /// <returns>ID vừa thêm mới</returns>
        /// created by ntkien (13/05/2019)
        public Guid InsertEntityReturnID(T newEntity, string storeProcedureName)
        {
            _sqlCommand.CommandText = storeProcedureName;
            SqlCommandBuilder.DeriveParameters(_sqlCommand);
            foreach (SqlParameter p in _sqlCommand.Parameters)
            {
                if (_sqlCommand.Parameters.IndexOf(p) != 0)
                {
                    var property = p.ParameterName.Replace("@", "");
                    var value = newEntity.GetType().GetProperty(property).GetValue(newEntity);
                    p.Value = value == null ? DBNull.Value : value;
                }
            }
            var lastID = (Guid)_sqlCommand.ExecuteScalar();
            return lastID;
        }

        /// <summary>
        /// Hàm base sửa thông tin đối tượng
        /// </summary>
        /// <param name="entity">Thông tin mới của đối tượng</param>
        /// <param name="storeProcedureName">tên store thực hiện</param>
        /// created by ntkien (13/05/2019)
        public void UpdateEntity(T entity, string storeProcedureName)
        {
            _sqlCommand.CommandText = storeProcedureName;
            SqlCommandBuilder.DeriveParameters(_sqlCommand);
            foreach (SqlParameter p in _sqlCommand.Parameters)
            {
                if (_sqlCommand.Parameters.IndexOf(p) != 0)
                {
                    var property = p.ParameterName.Replace("@", "");
                    var value = entity.GetType().GetProperty(property).GetValue(entity);
                    p.Value = value == null ? DBNull.Value : value;
                }
            }
            _sqlCommand.ExecuteNonQuery();
        }

        /// <summary>
        /// Hàm base lấy đối tượng theo ID
        /// </summary>
        /// <param name="entityID">ID</param>
        /// <param name="storeProcedureName">tên store thực hiện</param>
        /// <returns>Đối tượng thỏa mãn</returns>
        /// created by ntkien (13/05/2019)
        public T GetEntityByID(Guid entityID, string storeProcedureName)
        {
            // Lấy dữ liệu
            _sqlCommand.CommandText = "[dbo].[Proc_GetProductByID]";
            _sqlCommand.Parameters.AddWithValue("@ID", entityID);
            var sqlDataReader = _sqlCommand.ExecuteReader();
            var entity = Activator.CreateInstance<T>();
            while (sqlDataReader.Read())
            {
                for (int i = 0; i < sqlDataReader.FieldCount; i++)
                {
                    var fieldName = sqlDataReader.GetName(i);
                    var fieldValue = sqlDataReader[i];
                    var property = entity.GetType().GetProperty(fieldName);
                    if (property != null && fieldValue != System.DBNull.Value)
                    {
                        property.SetValue(entity, fieldValue);
                    }
                }
            }
            // Trả lại dữ liệu
            return entity;
        }

        public List<T> GetListEntityByID(Guid entityID, string storeProcedureName)
        {
            var listEntity = new List<T>();
            // Lấy dữ liệu
            _sqlCommand.CommandText = storeProcedureName;
            _sqlCommand.Parameters.AddWithValue("@ID",entityID);
            var sqlDataReader = _sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                var product = Activator.CreateInstance<T>();
                for (int i = 0; i < sqlDataReader.FieldCount; i++)
                {
                    var fieldName = sqlDataReader.GetName(i);
                    var fieldValue = sqlDataReader[i];
                    var property = product.GetType().GetProperty(fieldName);
                    if (property != null && fieldValue != System.DBNull.Value)
                    {
                        property.SetValue(product, fieldValue);
                    }
                }
                listEntity.Add(product);
            }
            // Trả lại dữ liệu
            return listEntity;
        }

        /// <summary>
        /// overrride hàm dispose của IDisposable
        /// Thực hiện đóng kết nối
        /// </summary>
        /// created by ntkien   (04/05/2019)
        public void Dispose()
        {
            _sqlConnection.Close();
        }
        #endregion

    }
}
