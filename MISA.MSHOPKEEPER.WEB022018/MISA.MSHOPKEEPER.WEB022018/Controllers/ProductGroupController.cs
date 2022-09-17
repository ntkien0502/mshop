using System;
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
    [RoutePrefix("productgroups")]
    public class ProductGroupController : ApiController
    {
        ProductGroupBL productGroupBL = new ProductGroupBL();
        /// <summary>
        /// Lấy danh sách nhóm hàng để đổ vào combobox
        /// </summary>
        /// <returns>Danh sách nhóm hàng</returns>
        /// created by ntkien   (07/05/2019)
        [HttpGet]
        [Route("")]
        public async Task<AjaxResult> Get()
        {
            var _result = new AjaxResult();
            try
            {
                //await Task.Delay(10000);
                _result.Data = productGroupBL.GetListProductGroup();
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

        // GET: api/ProductGroup/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/ProductGroup
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/ProductGroup/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/ProductGroup/5
        public void Delete(int id)
        {
        }
    }
}
