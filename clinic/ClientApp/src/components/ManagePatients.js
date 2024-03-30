import React, { useState, useEffect } from 'react';
import { getPatients, getPatient, addOrUpdatePatient, deletePatient } from '../services/patientService';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState({ name: '', isActive: false });
  const [operation, setOperation] = useState(null); // 'add', 'edit', or null
  const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
        try {
            const fetchedPatients = await getPatients();
            console.log(fetchedPatients); // Add this line to check the fetched data
            setPatients(fetchedPatients);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
        };

        fetchPatients();
    }, []);

    const handleAddPatient = () => {
        setCurrentPatient({ name: '', isActive: false });
        setOperation('add');
    };

    const handleEditPatient = async (id) => {
        try {
            const patient = await getPatient(id);
            setCurrentPatient({ ...patient, id }); // Include the id here
            setOperation('edit');
        } catch (error) {
            console.error(`Error fetching patient with id ${id}:`, error);
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!currentPatient.name) {
            setError('Please fill in the name');
            return;
        }
    
        const formattedPatient = {
            ...currentPatient,
            isActive: currentPatient.isActive === 'on' || currentPatient.isActive === true
        };
    
        try {
            const updatedPatient = await addOrUpdatePatient(formattedPatient, formattedPatient.id);
    
            setPatients(prevPatients => 
                formattedPatient.id
                    ? prevPatients.map(p => p.id === formattedPatient.id ? updatedPatient : p)
                    : [...prevPatients, updatedPatient]
            );
            setCurrentPatient({ name: '', isActive: false });
            setOperation(null);
            setError('');
        } catch (error) {
            console.error('Error submitting patient:', error);
            setError('An error occurred while submitting the patient information.');
        }
    };
    
    
    const handleDeletePatient = async (id) => {
        try {
        await deletePatient(id);
        setPatients(prevPatients => prevPatients.filter(p => p.id !== id));
        } catch (error) {
        console.error(`Error deleting patient with id ${id}:`, error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        if (type === 'checkbox') {
            setCurrentPatient({ ...currentPatient, [name]: checked });
        } else {
            setCurrentPatient({ ...currentPatient, [name]: value });
        }
    };
    

    const renderPatientForm = () => {
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
                value={currentPatient.name} 
                onChange={handleInputChange} 
                placeholder="Patient's Name" 
              />
            </div>
            <div>
              <label>Active:</label>
              <input 
                type="checkbox" 
                name="isActive" 
                checked={currentPatient.isActive} 
                onChange={handleInputChange} 
              />
            </div>
            <button type="submit">{operation === 'add' ? 'Add' : 'Update'} Patient</button>
            {error && <p>{error}</p>}
          </form>
        );
      };
    
      const renderPatientsTable = () => {
        return (
          <table className='table table-striped' aria-labelledby="tableLabel">
            <thead>
              <tr>
                <th>Name</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(patient => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.isActive ? 'true' : 'false'}</td>
                  <td>
                    <button onClick={() => handleEditPatient(patient.id)}>Edit</button>
                    <button onClick={() => handleDeletePatient(patient.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      };
    
      return (
        <div>
          <h1 id="tableLabel">Patients List</h1>
          {operation === 'add' && (
            <button onClick={() => setOperation(null)}>Cancel Add</button>
          )}
          {operation !== 'add' && (
            <button onClick={handleAddPatient}>Add Patient</button>
          )}
          {renderPatientForm()}
          {renderPatientsTable()}
        </div>
      );
    };

export default ManagePatients;
