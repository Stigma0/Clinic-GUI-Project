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
    public class VisitSlotsController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public VisitSlotsController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/VisitSlots
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VisitSlotDto>>> GetVisitSlots()
        {
            var visitSlots = await _context.VisitSlots
                .Select(vs => new VisitSlotDto 
                { 
                    id = vs.id,
                    scheduleID = vs.scheduleID,
                    startTime = vs.startTime,
                    endTime = vs.endTime,
                    isbooked = vs.isbooked,
                    description = vs.description
                })
                .ToListAsync();

            return Ok(visitSlots);
        }



       // GET: api/VisitSlots/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VisitSlotDto>> GetVisitSlot(int id)
        {
            var visitSlot = await _context.VisitSlots
                .Where(vs => vs.id == id)
                .Select(vs => new VisitSlotDto 
                {
                    id = vs.id,
                    scheduleID = vs.scheduleID,
                    startTime = vs.startTime,
                    endTime = vs.endTime,
                    isbooked = vs.isbooked,
                    description = vs.description
                })
                .FirstOrDefaultAsync();

            if (visitSlot == null)
            {
                return NotFound();
            }

            return Ok(visitSlot);
        }

        // GET: api/VisitSlots/Schedule/5
        [HttpGet("Schedule/{scheduleId}")]
        public async Task<ActionResult<IEnumerable<VisitSlotDto>>> GetVisitSlotsBySchedule(int scheduleId)
        {
            var visitSlots = await _context.VisitSlots
                .Where(vs => vs.scheduleID == scheduleId)
                .Select(vs => new VisitSlotDto 
                { 
                    id = vs.id,
                    scheduleID = vs.scheduleID,
                    startTime = vs.startTime,
                    endTime = vs.endTime,
                    isbooked = vs.isbooked,
                    description = vs.description
                })
                .ToListAsync();

            return Ok(visitSlots);
        }

        // POST and PUT methods are disabled as VisitSlots are managed through Schedules
        [HttpPost]
        public IActionResult DisabledMethod()
        {
            return BadRequest("This method is disabled. VisitSlots are managed through Schedules.");
        }
        /// PUT: api/VisitSlots/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVisitSlotBooking(int id, [FromBody] VisitSlotBookingDto bookingDto)
        {
            var visitSlot = await _context.VisitSlots.FindAsync(id);
            if (visitSlot == null)
            {
                return NotFound();
            }

            visitSlot.isbooked = bookingDto.isbooked;
            visitSlot.description = bookingDto.description;

            _context.Entry(visitSlot).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }



        // DELETE: api/VisitSlots/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVisitSlot(int id)
        {
            var visitSlot = await _context.VisitSlots.FindAsync(id);
            if (visitSlot == null)
            {
                return NotFound();
            }

            if (visitSlot.isbooked)
            {
                return BadRequest("Cannot delete a booked VisitSlot.");
            }

            _context.VisitSlots.Remove(visitSlot);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
