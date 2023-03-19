using MapProject.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace MapProject.Controllers
{
    [AllowAnonymous]
    [ApiExplorerSettings(IgnoreApi = true)]
    public class ErrorController : Controller
    {
        #region Ctor&Fields

        private readonly ILogger<ErrorController> _logger;

        public ErrorController(ILogger<ErrorController> logger)
        {
            _logger = logger;
        }

        #endregion

        #region ErrorDevelopment

        [Route("/error-development")]
        public IActionResult ErrorDevelopment()
        {
            var exceptionDetails = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            //Log kaydı
            _logger.LogError(exceptionDetails?.Error.Message, exceptionDetails);

            ErrorViewModel errorViewModel = new()
            {
                ExceptionMessage = exceptionDetails.Error.Message,
                ExceptionPath = exceptionDetails.Path,
                ExceptionStackTrace = exceptionDetails.Error.StackTrace

            };

            return View(errorViewModel);
        }

        #endregion

        #region Error

        [Route("/error")]
        public IActionResult Error()
        {
            var exceptionDetails = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            //Log kaydı
            _logger.LogError(exceptionDetails?.Error.Message, exceptionDetails);

            return View();
        }

        #endregion

        #region Unauthorized

        [Route("/unauthorized")]
        public IActionResult UnAuthorized()
        {
            return View();
        }

        #endregion
    }
}
