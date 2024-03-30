namespace lab3.Models;

public class VisitSlotDto
{
    public int id { get; set; }
    public int scheduleID { get; set; }
    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }
    public bool isbooked { get; set; }
    public int? patientID { get; set; }
    public string patientName { get; set; } // From patient
    public string? description { get; set; }

}
