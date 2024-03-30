using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using lab3.Models;

namespace lab3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public DoctorsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            var doctors = await _context.Doctors
                .Include(d => d.Specialization)
                .ToListAsync();

            return Ok(doctors);
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialization)
                .FirstOrDefaultAsync(d => d.id == id);

            if (doctor == null)
            {
                return NotFound();
            }

            return doctor;
        }



        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorDto doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            // Retrieve the Specialization by ID.
            var Specialization = await _context.Specializations.FindAsync(doctorDto.specializationID);
            if (Specialization == null)
            {
                return BadRequest("Invalid specializationID");
            }

            doctor.name = doctorDto.name;
            doctor.specializationID = doctorDto.specializationID;
            doctor.specializationName = Specialization.name;
            
            await _context.SaveChangesAsync();

            // Create a response DTO (if needed)
            var responseDto = new
            {
                id = doctor.id,
                name = doctor.name,
                specializationID = doctor.specializationID,
                specializationName = Specialization.name // Include the Specialization name
            };

            return Ok(responseDto); // Changed to return the response DTO with Ok status
        }



        // POST: api/Doctors
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreateDoctor([FromBody] DoctorDto doctorDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Retrieve the Specialization by ID.
            var Specialization = await _context.Specializations.FindAsync(doctorDto.specializationID);
            if (Specialization == null)
            {
                return BadRequest("Invalid specializationID");
            }

            var doctor = new Doctor
            {
                name = doctorDto.name,
                specializationID = doctorDto.specializationID,
                specializationName = Specialization.name, // Only set this if specializationName should not be null.
                Specialization = Specialization  // Set the navigation property
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            // Optionally, create a response DTO to include the Specialization name
            var responseDto = new
            {
                id = doctor.id,
                name = doctor.name,
                specializationID = doctor.specializationID,
                specializationName = Specialization.name
            };
            
            return CreatedAtAction("GetDoctor", new { id = doctor.id }, responseDto);
        }



        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
            {
                return NotFound();
            }

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DoctorExists(int id)
        {
            return _context.Doctors.Any(e => e.id == id);
        }
    }
}
