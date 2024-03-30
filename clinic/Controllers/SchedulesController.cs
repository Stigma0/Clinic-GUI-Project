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
    public class SchedulesController : ControllerBase
    {
    private readonly HospitalDbContext _context;

    public SchedulesController(HospitalDbContext context)
    {
        _context = context;
    }

    // GET: api/Schedules
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScheduleViewDto>>> GetSchedules()
    {
        return await _context.Schedules
            .Include(s => s.Doctor)
            .ThenInclude(d => d.Specialization)
            .Select(s => new ScheduleViewDto
            {
                id = s.id,
                doctorID = s.doctorID,
                start = s.start,
                end = s.end,
                date = s.date,
                doctorName = s.Doctor.name,
                specializationName = s.Doctor.Specialization.name
                
            })
            .ToListAsync();
    }



        // GET: api/Schedules/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Schedule>> GetSchedule(int id)
        {
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null)
            {
                return NotFound();
            }

            return schedule;
        }
        // POST: api/Schedules
        [HttpPost]
        public async Task<ActionResult<ScheduleViewDto>> PostSchedule(ScheduleDto scheduleDto)
        {
            if (IsDuplicateSchedulePost(scheduleDto.doctorID, scheduleDto.date))
            {
                return BadRequest("A schedule for the same doctor on the same date already exists.");
            }
            if(!IsScheduleValid(scheduleDto.start,scheduleDto.end))
            {
                return BadRequest("Enter valid start and end time.");
            }
            var schedule = new Schedule
            {
                doctorID = scheduleDto.doctorID,
                start = scheduleDto.start,
                end = scheduleDto.end,
                date = scheduleDto.date
            };

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            // Generate VisitSlots for the new schedule
            GenerateVisitSlots(schedule);

            // Fetch the created schedule with doctor details to create a ScheduleViewDto
            var createdSchedule = await _context.Schedules
                .Where(s => s.id == schedule.id)
                .Include(s => s.Doctor)
                .ThenInclude(d => d.Specialization)
                .Select(s => new ScheduleViewDto
                {
                    id = s.id,
                    doctorID = s.doctorID,
                    start = s.start,
                    end = s.end,
                    date = s.date,
                    doctorName = s.Doctor.name,
                    specializationName = s.Doctor.Specialization.name
                })
                .FirstOrDefaultAsync();

            if (createdSchedule == null)
            {
                return NotFound(); // In case the schedule wasn't properly created/fetched
            }

            return CreatedAtAction(nameof(GetSchedule), new { id = schedule.id }, createdSchedule);
        }


        // PUT: api/Schedules/5
        [HttpPut("{id}")]
        public async Task<ActionResult<ScheduleViewDto>> PutSchedule(int id, [FromBody] ScheduleDto scheduleDto)
        {
            if (!IsScheduleValid(scheduleDto.start, scheduleDto.end))
            {
                return BadRequest("Enter valid start and end time.");
            }

            var existingSchedule = await _context.Schedules
                .Include(s => s.Doctor)
                .ThenInclude(d => d.Specialization)
                .Include(s => s.VisitSlots) // Include visit slots for updating
                .FirstOrDefaultAsync(s => s.id == id);

            if (existingSchedule == null)
            {
                return NotFound();
            }

            if (IsDuplicateSchedulePut(scheduleDto.doctorID, scheduleDto.date, scheduleDto.start, scheduleDto.end, id))
            {
                return BadRequest("A schedule for the same doctor on the same date already exists.");
            }

            // Update schedule details
            existingSchedule.doctorID = scheduleDto.doctorID;
            existingSchedule.start = scheduleDto.start;
            existingSchedule.end = scheduleDto.end;
            existingSchedule.date = scheduleDto.date;

            // Update VisitSlots for the existing schedule
            UpdateVisitSlots(existingSchedule);

            await _context.SaveChangesAsync();

            // Create a ScheduleViewDto for the response
            var responseDto = new ScheduleViewDto
            {
                id = existingSchedule.id,
                doctorID = existingSchedule.doctorID,
                start = existingSchedule.start,
                end = existingSchedule.end,
                date = existingSchedule.date,
                doctorName = existingSchedule.Doctor?.name,
                specializationName = existingSchedule.Doctor?.Specialization?.name
            };

            return Ok(responseDto);
        }

        


        // DELETE: api/Schedules/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            var schedule = await _context.Schedules.Include(s => s.VisitSlots)
                                                .FirstOrDefaultAsync(s => s.id == id);
            if (schedule == null)
            {
                return NotFound();
            }
            // Check if any VisitSlot is booked
            if (schedule.VisitSlots.Any(vs => vs.isbooked))
            {
                return BadRequest("Cannot delete the schedule as it has booked visit slots.");
            }

            _context.VisitSlots.RemoveRange(schedule.VisitSlots);
            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ScheduleExists(int id)
        {
            return _context.Schedules.Any(e => e.id == id);
        }
        private bool IsDuplicateSchedulePost(int doctorid, DateTime date, int scheduleid = 0)
        {
            return _context.Schedules.Any(s => 
                s.doctorID == doctorid &&
                s.date.Date == date.Date &&
                s.id != scheduleid); // Exclude the current schedule in case of updates
        }
        private bool IsDuplicateSchedulePut(int doctorId, DateTime date, TimeSpan start, TimeSpan end, int scheduleId)
        {
            // Check for any schedule that matches the doctor, date, and times, but is not the current schedule
            return _context.Schedules.Any(s => 
                s.doctorID == doctorId &&
                s.date.Date == date.Date &&
                s.start == start &&
                s.end == end &&
                s.id != scheduleId);
        }

        private void UpdateVisitSlots(Schedule schedule)
        {
            DateTime scheduleDate = schedule.date.Date;
            TimeSpan newStartTime = schedule.start;
            TimeSpan newEndTime = schedule.end;

            // Calculate the actual DateTime for start and end
            DateTime newStartDateTime = scheduleDate + newStartTime;
            DateTime newEndDateTime = scheduleDate + newEndTime;

            // Remove or adjust VisitSlots that don't fit within the new schedule times
            var allSlots = schedule.VisitSlots.ToList();
            foreach (var slot in allSlots)
            {
                // Remove slots that are completely outside the new times
                if (slot.startTime < newStartDateTime || slot.endTime > newEndDateTime)
                {
                    _context.VisitSlots.Remove(slot);
                    continue;
                }

                // Adjust slots that partially overlap with the new times
                if (slot.startTime < newStartDateTime)
                {
                    slot.startTime = newStartDateTime;
                }
                if (slot.endTime > newEndDateTime)
                {
                    slot.endTime = newEndDateTime;
                }
            }

            // Add new VisitSlots if necessary
            DateTime slotStartTime = newStartDateTime;
            while (slotStartTime < newEndDateTime)
            {
                DateTime slotEndTime = slotStartTime.AddMinutes(30); // Assuming 30-minute slots
                if (slotEndTime > newEndDateTime) break;

                // Check if a slot for this time range already exists
                var existingSlot = allSlots.FirstOrDefault(vs => vs.startTime == slotStartTime);
                if (existingSlot == null)
                {
                    // Create new slot
                    var newSlot = new VisitSlot
                    {
                        scheduleID = schedule.id,
                        startTime = slotStartTime,
                        endTime = slotEndTime,
                        isbooked = false
                    };
                    _context.VisitSlots.Add(newSlot);
                }

                slotStartTime = slotEndTime;
            }

            _context.SaveChanges();
        }

        private int GenerateVisitSlots(Schedule schedule)
        {
            int slotCount = 0;
            DateTime scheduleDate = schedule.date.Date;
            TimeSpan startTime = schedule.start;
            TimeSpan endTime = schedule.end;

            // Calculate the actual DateTime for start and end
            DateTime startDateTime = scheduleDate + startTime;
            DateTime endDateTime = scheduleDate + endTime;

            // Create VisitSlots within the schedule times
            DateTime slotstartTime = startDateTime;
            while (slotstartTime < endDateTime)
            {
                DateTime slotendTime = slotstartTime.AddMinutes(30); // Assuming 30 minutes slot, adjust as needed
                if (slotendTime > endDateTime) break;

                var visitSlot = new VisitSlot
                {
                    scheduleID = schedule.id,
                    startTime = slotstartTime,
                    endTime = slotendTime,
                    isbooked = false
                };

                _context.VisitSlots.Add(visitSlot);
                slotstartTime = slotendTime;
                slotCount++;
            }

            _context.SaveChanges();
            return slotCount;
        }
     public bool IsScheduleValid(TimeSpan start, TimeSpan end)
    {
        return start < end;
    }


    }
    
}
