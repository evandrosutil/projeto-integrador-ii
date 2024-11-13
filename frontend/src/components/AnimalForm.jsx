import React, { useState } from 'react';
import api from '../services/api';
import './AdoptantRegistration/AdoptantRegistration.css'
import NumberInput from '../utils';

function AnimalForm() {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    age_estimated: '',
    weight: '',
    status: 'available',
    description: '',
    vaccinated: false,
    neutered: false,
    image: null
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' 
      ? e.target.checked 
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'boolean') {
        data.append(key, formData[key].toString());
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    console.log(data);
    if (image) {
      console.log(image);
      data.append('image', image);
    }

    try {
      const response = await api.post('/animals/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
          // 'Content-Type': 'application/json'
        }
      });

      const message = response.data.name + " cadastrado com sucesso";
      setMessage(message);

      setFormData({
        name: '',
        species: '',
        breed: '',
        gender: '',
        age_estimated: '',
        weight: '',
        status: 'available',
        description: '',
        vaccinated: false,
        neutered: false
      });

      setImage(null);
      setPreview(null);
    } catch (err) {
      console.log("err.status =", err.status);
      if (err.status === 403) {
        setError('Você não tem persmissão para cadastrar um animal');
      } else {
        setError(err.response?.data?.message || 'Erro ao cadastrar animal');
      }
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Cadastrar Novo Animal</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="nome"
            className="form-input"
            required
          />
        </div>


        <div className="form-group">
          <select
            name="species"
            value={formData.species}
            onChange={handleChange}
            className="form-select"
          >
            <option value="" disabled hidden>espécie</option>
            <option value="cachorro">cachorro</option>
          </select>
        </div>
  
        <div className="form-group">
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="raça"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-select"
          >
            <option value="" disabled hidden>gênero</option>
            <option value="M">macho</option>
            <option value="F">fêmea</option>
          </select>
        </div>

        <NumberInput
          name="age_estimated"
          value={formData.age_estimated}
          onChange={handleChange}
          max={30}
          label={"idade estimada em anos"}
        />


        <NumberInput
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          max={90}
          label={"peso aproximado em kg"}
        />

        <div className="form-group">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="" disabled hidden>status</option>
            <option value="available">disponível</option>
            <option value="adopted">adotado</option>
            <option value="under_treatment">em tratamento</option>
            <option value="quarentine">em quarentena</option>
          </select>
        </div>

        <div className="form-group">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descrição"
            className="form-input"
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="vaccinated"
            checked={formData.vaccinated}
            onChange={handleChange}
            className="form-checkbox"
            id="vaccinated"
          />
          <label htmlFor="vaccinated" className="checkbox-label">
            vacinado(a)
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="neutered"
            checked={formData.neutered}
            onChange={handleChange}
            className="form-checkbox"
            id="neutered"
          />
          <label htmlFor="neutered" className="checkbox-label">
            castrado(a)
          </label>
        </div>

        <div className="form-group">
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="submit-button"
        >
          Cadastrar Animal
        </button>
      </form>
    </div>
  );
}

export default AnimalForm;