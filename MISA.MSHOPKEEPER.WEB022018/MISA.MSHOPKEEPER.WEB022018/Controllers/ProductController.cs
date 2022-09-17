using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MISA.MSHOPKEEPER.WEB022018.Models;
using MISA.BL;
using MISA.Entity;
using System.Threading.Tasks;

namespace MISA.MSHOPKEEPER.WEB022018.Controllers
{
    [RoutePrefix("products")]
    public class ProductController : ApiController
    {
        ProductBL productBL = new ProductBL();
        /// <summary>
        /// Hàm lấy danh sách hàng hóa để hiển thị lên bảng dữ liệu
        /// </summary>
        /// <returns>List<Product></returns>
        /// created by ntkien (12/04/2019)
        [HttpGet]
        [Route("")]
        public async Task<AjaxResult> Get()
        {
            var _result = new AjaxResult();
            try
            {
                //await Task.Delay(10000);
                _result.Data = productBL.GetListProduct();
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
                // ghi vào log:
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm lấy dữ liệu có điều kiện lọc, phân trang
        /// </summary>
        /// <param name="filters"></param>
        /// <param name="pageNumber"></param>
        /// <param name="pageSize"></param>
        /// <returns>Danh sách dữ liệu thỏa mãn điều kiện</returns>
        /// created by ntkien (11/05/2019)
        [HttpPost]
        [Route("{pageNumber}/{pageSize}")]
        public async Task<AjaxResult> GetProducts([FromBody] List<Filter> filters, int pageNumber, int pageSize)
        {
            var _result = new AjaxResult();
            try
            {
                string where = String.Empty;
                if (filters != null)
                {
                    where = Filter.BuildWhereCondition(filters);
                }
                _result.Data = productBL.GetProductPaging(pageNumber, pageSize, where);
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
                // ghi vào log:
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm thêm mới một hàng hóa vào danh sách theo thông tin gửi lên
        /// </summary>
        /// <param name="value">Đối tượng Product</param>
        /// created by ntkien (12/04/2019)
        [HttpPost]
        [Route("new")]
        public async Task<AjaxResult> Add(Entity.Product value)
        {
            // Thêm mới sản phẩm
            var _result = new AjaxResult();
            try
            {
                var lastID = productBL.InsertProduct(value);
                if (lastID != Guid.Empty)
                {
                    _result.Data = lastID;
                    _result.Success = true;
                    _result.Messenger = Properties.Resources.Success;
                }
                else
                {
                    _result.Success = false;
                    _result.Messenger = Properties.Resources.InvalidProductInformation;
                }
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
                // ghi vào log:
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm lấy hàng hóa theo ID gửi lên
        /// </summary>
        /// <param name="productID"></param>
        /// <returns></returns>
        /// created by ntkien (12/04/2019)
        /// modifield by ntkien (08/05/2019) : Đổi giá trị trả về. Chuyển lấy dữ liệu tĩnh thành lấy dữ liệu động
        [HttpGet]
        [Route("{id}")]
        public async Task<AjaxResult> GetByID(Guid id)
        {
            var _result = new AjaxResult();
            try
            {
                _result.Data = productBL.GetProductByID(id);
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm sửa hàng hóa theo thông tin mới của đối tượng được gửi lên
        /// </summary>
        /// <param name="updateProduct">Thông tin mới của đối tượng</param>
        /// created by ntkien (12/04/2019)
        [HttpPut]
        [Route("edit")]
        public async Task<AjaxResult> Update(Entity.Product updateProduct)
        {
            var _result = new AjaxResult();
            try
            {
                _result.Data = productBL.UpdateProduct(updateProduct);
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm xóa hàng hóa theo ID gửi lên
        /// </summary>
        /// <param name="productID">ID của hàng hóa sẽ xóa</param>
        /// created by ntkien (22/-4/2019)
        /// modifield by ntkien : Sửa xóa dữ liệu tính thành xóa dữ liệu động
        [HttpDelete]
        [Route("{id}")]
        public async Task<AjaxResult> Delete(Guid id)
        {
            var _result = new AjaxResult();
            try
            {
                productBL.DeleteProduct(id);
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm xóa nhiều hàng hóa theo mảng ID truyền vào
        /// </summary>
        /// <param name="listID">mảng ID những hàng hóa muốn xóa</param>
        /// created by ntkien (25/04/2019)
        /// modifield by ntkien (08/05/2019) : Sửa Router và kiểu nhân dữ liệu
        [HttpPost]
        [Route("listid")]
        public async Task<AjaxResult> DeleteListProduct([FromBody]Guid[] listID)
        {
            var _result = new AjaxResult();
            try
            {
                foreach (var item in listID)
                {
                    productBL.DeleteProduct(item);
                }
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        /// <summary>
        /// Hàm kiểm tra mã SKU đã tồn tại hay chưa
        /// </summary>
        /// <param name="skucode">Mã SKU</param>
        /// <returns>Đối tượng Ajax kết quả thực hiện</returns>
        /// created by ntkien (09/05/2019)
        [HttpPost]
        [Route("{skucode}")]
        public async Task<AjaxResult> CheckSkucode(string skucode)
        {
            var _result = new AjaxResult();
            try
            {
                var mapID = productBL.CheckProductCode(skucode);
                if (mapID == null)
                {
                    _result.Success = true;
                    _result.Messenger = Properties.Resources.Success;
                }
                else
                {
                    _result.Success = false;
                    _result.Messenger = Properties.Resources.ExistSKUCode;
                }
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
            }
            return await Task.FromResult<AjaxResult>(_result);
        }
    }
}
