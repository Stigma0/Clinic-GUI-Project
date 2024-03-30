using Microsoft.EntityFrameworkCore;
using lab3.Models;
public class HospitalDbContext : DbContext
{
    public HospitalDbContext(DbContextOptions<HospitalDbContext> options)
        : base(options)
    {
    }

    public DbSet<Doctor> Doctors { get; set; }
    public DbSet<Manager> Managers { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Specialization> Specializations { get; set; }
    public DbSet<VisitSlot> VisitSlots { get; set; } 
    public DbSet<User> Users { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
  
    }    
}
