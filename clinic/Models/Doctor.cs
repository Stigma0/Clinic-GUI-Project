using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using lab3.Models;
namespace lab3.Models;

public class Doctor {
    public int id {get; set;}
    [Required(ErrorMessage = "Name is required")]
    public string name {get; set;}
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int specializationID  {get; set; }
    public string specializationName { get; set; } // From Specialization
    public virtual Specialization Specialization { get; set; }
    public virtual ICollection<Schedule> Schedules { get; set; }
}