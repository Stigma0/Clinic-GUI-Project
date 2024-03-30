using System.ComponentModel.DataAnnotations;

namespace lab3.Models;
using lab3.Models;

public class Patient {
    public int id {get; set;}
    [Required(ErrorMessage = "Name is required")]
    public string name {get; set;}
    public bool isActive {get; set; }
}