import React, { useState, useEffect } from 'react';
import { getDoctors, getDoctor, addOrUpdateDoctor, deleteDoctor } from '../services/doctorService';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState({ name: '', specializationID: '' });
  const [operation, setOperation] = useState(null); // 'add', 'edit', or null
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const fetchedDoctors = await getDoctors();
        console.log(fetchedDoctors); // Add this line to check the fetched data
        setDoctors(fetchedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleAddDoctor = () => {
    setCurrentDoctor({ name: '', specializationID: '' });
    setOperation('add');
  };

  const handleEditDoctor = async (id) => {
    try {
      const doctor = await getDoctor(id);
      setCurrentDoctor({ id: doctor.id, name: doctor.name, specializationID: doctor.specializationID.toString() });
      setOperation('edit');
    } catch (error) {
      console.error(`Error fetching doctor with id ${id}:`, error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentDoctor.name || !currentDoctor.specializationID) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const updatedDoctor = await addOrUpdateDoctor({
        ...currentDoctor,
        specializationID: parseInt(currentDoctor.specializationID, 10),
      }, currentDoctor.id);

      setDoctors(prevDoctors => 
        currentDoctor.id
          ? prevDoctors.map(d => d.id === currentDoctor.id ? updatedDoctor : d)
          : [...prevDoctors, updatedDoctor]
      );
      setCurrentDoctor({ name: '', specializationID: '' });
      setOperation(null);
      setError('');
    } catch (error) {
      console.error(`Failed to ${currentDoctor.id ? 'update' : 'add'} doctor:`, error);
      setError(`Failed to ${currentDoctor.id ? 'update' : 'add'} doctor`);
    }
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors(prevDoctors => prevDoctors.filter(doctor => doctor.id !== id));
    } catch (error) {
      console.error(`Failed to delete doctor with id ${id}:`, error);
    }
  };

  const handleCancel = () => {
    setCurrentDoctor({ name: '', specializationID: '' });
    setOperation(null);
    setError('');
  };

  const handleChange = (e) => {
    setCurrentDoctor({ ...currentDoctor, [e.target.name]: e.target.value });
  };

  const renderDoctorForm = () => {
    if (!operation) {
      return null;
    }
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={currentDoctor.name} 
            onChange={handleChange} 
            placeholder="Doctor's Name" 
          />
        </div>
        <div>
          <label>Specialization ID:</label>
          <input 
            type="number" 
            name="specializationID" 
            value={currentDoctor.specializationID} 
            onChange={handleChange} 
            placeholder="Specialization ID" 
          />
        </div>
        <button type="submit">{operation === 'add' ? 'Add' : 'Update'} Doctor</button>
        {error && <p>{error}</p>}
      </form>
    );
  };

  const renderDoctorsTable = () => {
    return (
      <table className='table table-striped' aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.id}>
              <td>{doctor.name}</td>
              <td>{doctor.specializationName}</td>
              <td>
                <button onClick={() => handleEditDoctor(doctor.id)}>Edit</button>
                <button onClick={() => handleDeleteDoctor(doctor.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1 id="tableLabel">Doctors List</h1>
      {operation === 'add' && (
        <button onClick={handleCancel}>Cancel Add</button>
      )}
      {operation !== 'add' && (
        <button onClick={handleAddDoctor}>Add Doctor</button>
      )}
      {renderDoctorForm()}
      {renderDoctorsTable()}
    </div>
  );
    
};

export default ManageDoctors;
