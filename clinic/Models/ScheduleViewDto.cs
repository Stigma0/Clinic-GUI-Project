using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lab3.Models;
public class ScheduleViewDto
{
    public int id { get; set; }
    public int doctorID { get; set; }

    // Include ID if you need it for PUT operations or if you want to return it in GET/POST responses
    public TimeSpan start { get; set; }

    public TimeSpan end { get; set; }

    public DateTime date { get; set; }

    public string doctorName {get; set;}
    public string specializationName {get; set;}
}
