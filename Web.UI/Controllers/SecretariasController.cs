using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.UI.Controllers
{
    public class SecretariasController : Controller
    {
        public ActionResult Extrato()
        {
            return View();
        }

        public ActionResult Cadastrar()
        {
            return View();
        }

        public ActionResult SolicitarServico()
        {
            return View();
        }
    }
}
