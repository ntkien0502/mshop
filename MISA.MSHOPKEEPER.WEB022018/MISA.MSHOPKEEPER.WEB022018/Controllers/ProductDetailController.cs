using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MISA.BL;
using System.Threading.Tasks;
using MISA.Entity;

namespace MISA.MSHOPKEEPER.WEB022018.Controllers
{
    [RoutePrefix("productdetails")]
    public class ProductDetailController : ApiController
    {
        ProductDetailBL _productDetail = new ProductDetailBL();

        /// <summary>
        /// Hàm lấy chi tiết hàng hóa theo ID
        /// </summary>
        /// <param name="productID">ID hàng hóa</param>
        /// <returns>Chi tiết hàng hóa</returns>
        /// created by ntkien (08/05/2019)
        [HttpGet]
        [Route("{productID}")]
        public async Task<AjaxResult> Get(Guid productID)
        {
            var _result = new AjaxResult();
            try
            {
                _result.Data = _productDetail.GetProductDetailByID(productID);
                _result.Success = true;
                _result.Messenger = Properties.Resources.Success;
            }
            catch (Exception)
            {
                _result.Success = false;
                _result.Messenger = Properties.Resources.Error;
                // Ghi vào log
            }
            return await Task.FromResult<AjaxResult>(_result);
        }

        // GET: api/ProductDetail/5
        public string Get(int id)
        {
            return "value";
        }

        /// <summary>
        /// Hàm thêm mới các chi tiết hàng hóa
        /// </summary>
        /// <param name="listDetail">Danh sách các chi tiết hàng háo</param>
        /// created by ntkien (09/05/2019)
        [HttpPost]
        [Route("listDetail")]
        public async Task<AjaxResult> Post([FromBody]ProductDetail[] listDetail)
        {
            var _result = new AjaxResult();
            try
            {
                foreach (var item in listDetail)
                {
                    _productDetail.InsertProductDetail(item);
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

        // PUT: api/ProductDetail/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ProductDetail/5
        public void Delete(int id)
        {
        }
    }
}
