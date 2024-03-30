using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace lab3.Models;

public class Schedule
{
    public int id { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    [Required(ErrorMessage = "Doctor ID is required")]
    public int doctorID { get; set; }

    public Doctor Doctor { get; set; }

    [Required(ErrorMessage = "Start time is required")]
    [DataType(DataType.Time)]
    public TimeSpan start { get; set; }

    [Required(ErrorMessage = "End time is required")]
    [DataType(DataType.Time)]
    public TimeSpan end { get; set; }

    [Required(ErrorMessage = "Date is required")]
    [DataType(DataType.Date)]
    public DateTime date { get; set; }
    public virtual ICollection<VisitSlot> VisitSlots { get; set; }
   

    // Method to adjust WeekStartDate to the start of the week
    public static DateTime GetFirstDateOfWeek(DateTime date)
        {
            DayOfWeek firstDayOfWeek = DayOfWeek.Monday;
            while (date.DayOfWeek != firstDayOfWeek)
                date = date.AddDays(-1);
            return date;
        }



     public bool IsDuplicate(HospitalDbContext context)
        {
            return context.Schedules.Any(s => 
                s.doctorID == doctorID && 
                s.date == date && 
                s.id != id); // Check if there's a different entry with the same doctorID and Date
        }


    
    // Additional attributes for managing appointments
}