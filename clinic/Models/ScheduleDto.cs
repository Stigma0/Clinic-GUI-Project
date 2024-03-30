using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lab3.Models;
public class ScheduleDto
{
    // Include ID if you need it for PUT operations or if you want to return it in GET/POST responses
    public int doctorID { get; set; }

    public TimeSpan start { get; set; }

    public TimeSpan end { get; set; }

    public DateTime date { get; set; }

}
