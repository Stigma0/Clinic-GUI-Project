using System.ComponentModel.DataAnnotations;

namespace lab3.Models;

public class BasicData{
    public int id {get; set;}
    [Required(ErrorMessage = "Name is required")]
    public string name {get; set;}
}