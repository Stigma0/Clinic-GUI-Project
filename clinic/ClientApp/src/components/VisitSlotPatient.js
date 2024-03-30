import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getVisitSlotsBySchedule, updateVisitSlot } from '../services/scheduleService'; // Adjust import path as needed
import UserContext from './UserContext'; 

const VisitSlotPatient = () => {
  const [visitSlots, setVisitSlots] = useState([]);
  const { scheduleID } = useParams();
  const { username, userRole, isAuthenticated } = useContext(UserContext); // Consuming context
  useEffect(() => {
    if (scheduleID) {
      console.log('Username:', username);
      console.log('User Role:', userRole);
      console.log('Is Authenticated:', isAuthenticated);
      getVisitSlotsBySchedule(scheduleID).then(setVisitSlots);
    }
  }, [scheduleID, username, userRole, isAuthenticated]);

  const handleBookSlot = async (slotId) => {
    const slotToBook = visitSlots.find(slot => slot.id === slotId);
  
    if (!slotToBook) {
      alert('Invalid slot selected.');
      return;
    }
  
    // Determine if the action is to book or unbook the slot
    const isUnbookingAction = slotToBook.isbooked && slotToBook.patientName === username;
    
    const bookingPayload = {
      isBooked: !isUnbookingAction,
      description: isUnbookingAction ? null : "Booked by patient",
      patientName: isUnbookingAction ? null : username
    };
  
    try {
      await updateVisitSlot({ ...slotToBook, ...bookingPayload });
  
      setVisitSlots(prevSlots =>
        prevSlots.map(slot => {
          if (slot.id === slotId) {
            return {
              ...slot,
              isbooked: bookingPayload.isBooked,
              patientName: bookingPayload.patientName,
              description: bookingPayload.description
            };
          }
          return slot;
        })
      );
  
      alert(isUnbookingAction ? 'Visit Slot unbooked successfully.' : 'Visit Slot booked successfully.');
    } catch (error) {
      console.error(`Error ${isUnbookingAction ? 'unbooking' : 'booking'} visit slot:`, error);
      alert(`Failed to ${isUnbookingAction ? 'unbook' : 'book'} visit slot.`);
    }
  };
  
  
  
  return (
    <div>
      <h1>Visit Slots</h1>
      {visitSlots.length > 0 && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Is Booked</th>
              <th>Patient Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visitSlots.map(slot => (
              <tr key={slot.id}>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>{slot.isbooked ? 'Yes' : 'No'}</td>
                <td>{slot.patientName || 'N/A'}</td>
                <td>{slot.description || 'N/A'}</td>
                <td>
                  {slot.isbooked && slot.patientName === username ? (
                    <button onClick={() => handleBookSlot(slot.id)}>Unbook Slot</button>
                  ) : (
                    <button 
                      onClick={() => handleBookSlot(slot.id)} 
                      disabled={slot.isbooked && slot.patientName !== username}
                    >
                      Book Slot
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
  };

export default VisitSlotPatient;
