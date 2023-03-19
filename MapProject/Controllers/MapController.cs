using MapProject.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace MapProject.Controllers
{
    public class MapController : Controller
    {
        [HttpPost]
        public IActionResult Create([FromBody] CreateMapModel model)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "coordinates.txt");
            using (StreamWriter writer = new StreamWriter(path, true))
            {
                writer.WriteLine(JsonConvert.SerializeObject(model));
            }

            return Ok("Map data created successfully.");
        }

        [HttpGet]
        public IActionResult Query()
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "coordinates.txt");
            List<CoordinatesModel> coordinatesList = new List<CoordinatesModel>();
            using (StreamReader reader = new(path))
            {
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var coordinates = JsonConvert.DeserializeObject<CoordinatesModel>(line);
                    coordinatesList.Add(coordinates);
                }
            }
            return Ok(coordinatesList);
        }
    }
}
