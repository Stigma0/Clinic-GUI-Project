import React, { useState, useEffect } from 'react';
import { getSchedules, getSchedule, addOrUpdateSchedule, deleteSchedule } from '../services/scheduleService';
import { useNavigate } from 'react-router-dom'; 

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState({ doctorID: '', start: '', end: '', date: '' });
  const [operation, setOperation] = useState(null); // 'add', 'edit', or null
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const fetchedSchedules = await getSchedules();
        setSchedules(fetchedSchedules);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  const handleAddSchedule = () => {
    setCurrentSchedule({ doctorID: '', start: '', end: '', date: '' });
    setOperation('add');
  };

  const handleEditSchedule = async (id) => {
    try {
      const schedule = await getSchedule(id);
      setCurrentSchedule({ 
        id: schedule.id, 
        doctorID: schedule.doctorID.toString(), 
        start: schedule.start, 
        end: schedule.end, 
        date: schedule.date.split('T')[0] // Assuming the date is returned in ISO format
      });
      setOperation('edit');
    } catch (error) {
      console.error(`Error fetching schedule with id ${id}:`, error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentSchedule.doctorID || !currentSchedule.start || !currentSchedule.end || !currentSchedule.date) {
      setError('Please fill in all fields');
      return;
    }
  
    const formattedStart = currentSchedule.start.length === 5 ? `${currentSchedule.start}:00` : currentSchedule.start;
    const formattedEnd = currentSchedule.end.length === 5 ? `${currentSchedule.end}:00` : currentSchedule.end;
  
    try {
      const scheduleData = {
        ...currentSchedule,
        doctorID: parseInt(currentSchedule.doctorID, 10),
        start: formattedStart,
        end: formattedEnd,
        date: new Date(currentSchedule.date).toISOString()
      };
  
      const updatedSchedule = await addOrUpdateSchedule(scheduleData, currentSchedule.id);
  
      setSchedules(prevSchedules => 
        currentSchedule.id
          ? prevSchedules.map(s => s.id === currentSchedule.id ? updatedSchedule : s)
          : [...prevSchedules, updatedSchedule]
      );
      setCurrentSchedule({ doctorID: '', start: '', end: '', date: '' });
      setOperation(null);
      setError('');
    } catch (error) {
      console.error(`Failed to ${currentSchedule.id ? 'update' : 'add'} schedule:`, error);
      setError(`Failed to ${currentSchedule.id ? 'update' : 'add'} schedule`);
    }
  };
  

  const handleDeleteSchedule = async (id) => {
    try {
      await deleteSchedule(id);
      setSchedules(prevSchedules => prevSchedules.filter(schedule => schedule.id !== id));
    } catch (error) {
      console.error(`Failed to delete schedule with id ${id}:`, error);
    }
  };

  const handleChange = (e) => {
    setCurrentSchedule({ ...currentSchedule, [e.target.name]: e.target.value });
  };
  
  const navigateToVisitSlots = (scheduleId) => {
    navigate(`/visit-slots/${scheduleId}`); 
  };
  
  const renderScheduleForm = () => {
    if (!operation) {
      return null;
    }

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Doctor ID:</label>
          <input 
            type="number" 
            name="doctorID" 
            value={currentSchedule.doctorID} 
            onChange={handleChange} 
            placeholder="Doctor ID" 
          />
        </div>
        <div>
          <label>Start Time:</label>
          <input 
            type="time" 
            name="start" 
            value={currentSchedule.start} 
            onChange={handleChange}
          />
        </div>
        <div>
          <label>End Time:</label>
          <input 
            type="time" 
            name="end" 
            value={currentSchedule.end} 
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Date:</label>
          <input 
            type="date" 
            name="date" 
            value={currentSchedule.date} 
            onChange={handleChange}
          />
        </div>
        <button type="submit">{operation === 'add' ? 'Add' : 'Update'} Schedule</button>
        {error && <p>{error}</p>}
      </form>
    );
  };

  const renderSchedulesTable = () => {
    return (
      <table className='table table-striped'>
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Doctor Name</th>
            <th>Specialization Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule.id}>
              <td>{formatDate(schedule.date)}</td>
              <td>{schedule.start}</td>
              <td>{schedule.end}</td>
              <td>{schedule.doctorName}</td>
              <td>{schedule.specializationName}</td>
              <td>
                <button onClick={() => handleEditSchedule(schedule.id)}>Edit</button>
                <button onClick={() => handleDeleteSchedule(schedule.id)}>Delete</button>
                <button onClick={() => navigateToVisitSlots(schedule.id)}>View Visit Slots</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  return (
    <div>
      <h1>Schedule Manager</h1>
      {operation === 'add' && (
        <button onClick={() => setOperation(null)}>Cancel Add</button>
      )}
      {operation !== 'add' && (
        <button onClick={handleAddSchedule}>Add Schedule</button>
      )}
      {renderScheduleForm()}
      {renderSchedulesTable()}
    </div>
  );
  
};

export default ScheduleManager;
