using Microsoft.AspNetCore.Mvc;

namespace Web.UI.Controllers
{
    public class GovernoFederalController : Controller
    {
        public ActionResult Depositar()
        {
            return View("DepositoContaLastro");
        }

        public ActionResult Extrato()
        {
            return View("ExtratoContaLastro");
        }

        public ActionResult Transferir()
        {
            return View("TransferirContaLastro");
        }
    }
}
