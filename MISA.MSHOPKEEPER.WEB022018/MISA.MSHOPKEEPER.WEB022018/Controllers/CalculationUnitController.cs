using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MISA.Entity;
using MISA.MSHOPKEEPER.WEB022018.Models;
using MISA.BL;
using System.Threading.Tasks;

namespace MISA.MSHOPKEEPER.WEB022018.Controllers
{
    [RoutePrefix("calculationunits")]
    public class CalculationUnitController : ApiController
    {
        CalculationUnitBL calculationUnitBL = new CalculationUnitBL();

        /// <summary>
        /// Hàm lấy danh sách đơn vị tính để đổ vào combobox
        /// </summary>
        /// <returns>Danh sách đơn vị tính</returns>
        /// created by ntkien   (04/05/2019)
        [HttpGet]
        [Route("")]
        public async Task<AjaxResult> Get()
        {
            //return calculationUnitBL.GetListCalculationUnit();
            var _result = new AjaxResult();
            try
            {
                //await Task.Delay(10000);
                _result.Data = calculationUnitBL.GetListCalculationUnit();
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

        // GET: api/CalculationUnit/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/CalculationUnit
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/CalculationUnit/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/CalculationUnit/5
        public void Delete(int id)
        {
        }
    }
}
