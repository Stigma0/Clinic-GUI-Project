import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSpecializations, getSchedules } from '../services/scheduleService'; // Adjust the import path as needed
import UserContext from './UserContext'; // Import UserContext

const SchedulePatient = () => {
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const { username, userRole, isAuthenticated } = useContext(UserContext); // Consuming context

  useEffect(() => {
    getSpecializations().then(setSpecializations);
    console.log('Username:', username);
    console.log('User Role:', userRole);
    console.log('Is Authenticated:', isAuthenticated);
  }, [username, userRole, isAuthenticated]);

  useEffect(() => {
    if (selectedSpecialization) {
      getSchedules().then(data => {
        const filteredSchedules = data.filter(schedule => 
          schedule.specializationName === selectedSpecialization
        );
        setSchedules(filteredSchedules);
      });
    }
  }, [selectedSpecialization]);

  const handleSpecializationChange = (event) => {
    setSelectedSpecialization(event.target.value);
  };

  const navigateToVisitSlots = (scheduleID) => {
    navigate(`/visit-slots/${scheduleID}`);
  };

  return (
    <div>
      <h1>View Schedules</h1>
      <div>
        <label>Select Specialization:</label>
        <select value={selectedSpecialization} onChange={handleSpecializationChange}>
          <option value="">--Select--</option>
          {specializations.map(spec => (
            <option key={spec.id} value={spec.name}>{spec.name}</option>
          ))}
        </select>
      </div>

      {schedules.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map(schedule => (
              <tr key={schedule.id}>
                <td>{schedule.date}</td>
                <td>{schedule.start}</td>
                <td>{schedule.end}</td>
                <td>{schedule.doctorName}</td>
                <td>{schedule.specializationName}</td>
                <td>
                  <button onClick={() => navigateToVisitSlots(schedule.id)}>View Visit Slots</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SchedulePatient;
