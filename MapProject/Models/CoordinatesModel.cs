namespace MapProject.Models
{
    public class CoordinatesModel
    {
        public string Name { get; set; } = "";
        public int Number { get; set; } = 0;
        public List<List<double>> Coordinates { get; set; } = new();
    }
}
