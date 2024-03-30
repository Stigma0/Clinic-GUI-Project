namespace lab3.Models;
public class User
{
    public int id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; } // In a real-world application, store a hashed password
    public UserRole Role { get; set; }
}

public enum UserRole
{
    Doctor,
    Patient,
    Manager
}
