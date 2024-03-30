using System.ComponentModel.DataAnnotations.Schema;

namespace lab3.Models;
public class VisitSlot
{
    public int id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int scheduleID { get; set; }
    [ForeignKey ("scheduleID")]
    public Schedule Schedule { get; set; }

    public DateTime startTime { get; set; }
    public DateTime endTime { get; set; }

    // Indicates whether the slot is booked
    public bool isbooked { get; set; }
    public int? patientID { get; set; }
    public Patient patient { get; set; }
    // description written by the doctor during the visit
    public string? description { get; set; }
    }
