using Microsoft.AspNetCore.Mvc;

namespace Web.UI.Controllers
{
    public class PainelServicosController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
