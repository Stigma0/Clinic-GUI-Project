using lab3.Models;
using Microsoft.EntityFrameworkCore;

namespace lab3.Data;

public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider, ILogger logger)
    {
        using (var context = new HospitalDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<HospitalDbContext>>()))
        {
            logger.LogInformation("Checking if the database needs to be created...");
            context.Database.EnsureCreated();

            if (!context.Specializations.Any())
            {
                logger.LogInformation("Starting database initialization...");

                InitializeUsers(context, logger);
                InitializeSpecializations(context, logger);
                InitializeDoctors(context, logger);
                InitializePatients(context, logger);
                InitializeSchedules(context, logger);
            }
            else
            {
                logger.LogInformation("Database already contains data. Skipping initialization.");
            }

            logger.LogInformation("Database initialization complete.");
        }
    }
        private static void InitializeUsers(HospitalDbContext context, ILogger logger)        {
            logger.LogInformation("Initializing users...");
            var users = new User[]
            {
                new User { Username = "admin", Password = "admin", Role = UserRole.Manager },
                new User { Username = "doctor", Password = "doctor", Role = UserRole.Doctor },
                new User { Username = "patient", Password = "patient", Role = UserRole.Patient }
                // Add more users as needed
            };

            foreach (User user in users)
            {
                context.Users.Add(user);
            }
            context.SaveChanges();
            logger.LogInformation("Users initialized.");
        }
        private static void InitializeSpecializations(HospitalDbContext context, ILogger logger)
        {
            logger.LogInformation("Initializing Specializations...");
            var Specializations = new Specialization[]
            {
                new Specialization{name="home"},
                new Specialization{name="ENT"},
                new Specialization{name="dermatologist"},
                new Specialization{name="ophthalmologist"},
                new Specialization{name="neurologist"},
                new Specialization{name="orthopedist"},
                new Specialization{name="pediatrician"}
            };

            foreach (Specialization s in Specializations)
            {
                context.Specializations.Add(s);
            }
            context.SaveChanges();
            logger.LogInformation("Speciaizations initialized.");
        }

        private static void InitializeDoctors(HospitalDbContext context, ILogger logger)
        {
            logger.LogInformation("Initializing doctors...");
            var Specializations = context.Specializations.ToList();
            var doctors = new Doctor[]
            {
                new Doctor { name="John Smith", Specialization = Specializations.FirstOrDefault(s => s.name == "home") },
                new Doctor { name="Adam Smith", Specialization = Specializations.FirstOrDefault(s => s.name == "ENT") }, 
                new Doctor { name="Jake Smith", Specialization = Specializations.FirstOrDefault(s => s.name == "dermatologist") },
                new Doctor { name="Col Smith", Specialization = Specializations.FirstOrDefault(s => s.name == "ophthalmologist") },
                new Doctor { name="Baker Smith", Specialization = Specializations.FirstOrDefault(s => s.name == "neurologist") },
            };

            foreach (Doctor doctor in doctors)
            {
                // Assign the specializationID and specializationName based on the attached Specialization.
                doctor.specializationID = doctor.Specialization?.id ?? 0;
                doctor.specializationName = doctor.Specialization?.name;
                context.Doctors.Add(doctor);
            }
            context.SaveChanges();
            logger.LogInformation("Doctors initialized.");
        }

        private static void InitializePatients(HospitalDbContext context, ILogger logger)
        {
            logger.LogInformation("Initializing patients...");
            var patients = new Patient[]
            {
                new Patient{name="John Smith", isActive = false},
                new Patient{name="Adam Smith", isActive = false},
                new Patient{name="Jake Smith",isActive = false},
                new Patient{name="Col Smith", isActive = false},
                new Patient{name="Baker Smith", isActive = false},
            };

            foreach (Patient c in patients)
            {
                context.Patients.Add(c);
            }
            context.SaveChanges();
            logger.LogInformation("Patients initialized.");
        }

        private static void InitializeSchedules(HospitalDbContext context, ILogger logger)
        {
            logger.LogInformation("Initializing schedules...");
            if (context.Schedules.Any())
            {
                return; // Schedules have already been seeded
            }

            var doctors = context.Doctors.ToList();
            foreach (var doctor in doctors)
            {
                for (int weekOffset = 0; weekOffset < 2; weekOffset++) // For two weeks
                {
                    DateTime weekStartDate = GetFirstDateOfWeek(DateTime.Now.Date).AddDays(7 * weekOffset);

                    for (int dayOffset = 0; dayOffset < 2; dayOffset++) // For two days of the week
                    {
                        var scheduleDate = weekStartDate.AddDays(dayOffset);
                        var schedule = new Schedule
                        {
                            doctorID = doctor.id,
                            date = scheduleDate,
                            start = GetRandomstartTime(),
                            end = GetRandomendTime()
                        };

                        context.Schedules.Add(schedule);
                    }
                }
            }
            context.SaveChanges();
             foreach (var schedule in context.Schedules)
            {
                GenerateVisitSlotsForSchedule(schedule, context);
            }

            context.SaveChanges();
            logger.LogInformation("VisitSlots initialized.");
        }

        private static DateTime GetFirstDateOfWeek(DateTime date)
        {
            DayOfWeek firstDayOfWeek = DayOfWeek.Monday;
            while (date.DayOfWeek != firstDayOfWeek)
                date = date.AddDays(-1);
            return date;
        }

        private static TimeSpan GetRandomstartTime()
        {
            // Randomize start time between 8:00 to 10:00
            Random rnd = new Random();
            int hours = rnd.Next(10, 11);
            return new TimeSpan(hours, 0, 0);
        }

        private static TimeSpan GetRandomendTime()
        {
            // Randomize end time between 16:00 to 18:00
            Random rnd = new Random();
            int hours = rnd.Next(11, 12);
            return new TimeSpan(hours, 0, 0);
        }
        private static void GenerateVisitSlotsForSchedule(Schedule schedule, HospitalDbContext context)
        {
            DateTime startTime = schedule.date.Add(schedule.start);
            DateTime endTime = schedule.date.Add(schedule.end);

            while (startTime < endTime)
            {
                context.VisitSlots.Add(new VisitSlot
                {
                    scheduleID = schedule.id,
                    startTime = startTime,
                    endTime = startTime.AddMinutes(30),
                    isbooked = false
                });

                startTime = startTime.AddMinutes(30);
            }
        }
        
    }
    
    