import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './AdoptantRegistration.css';
import NumberInput from '../../utils';


const AdoptantRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profile: {
      first_name: '',
      last_name: '',
      phone: '',
      birth_date: '',
      street_name: '',
      street_number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipcode: '',
      residence_type: 'HOUSE',
      has_screens: false,
      number_of_residents: 1,
      has_children: false,
      has_allergic_residents: false,
      has_other_pets: false,
      number_of_pets: 0,
      adoption_motivation: '',
      acknowledges_costs: false
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register/adopter/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'adopter',
        profile: formData.profile
      });
      
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setErrors(error.response?.data || { general: "Erro ao registrar novo adotante" });
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Cadastre-se</h2>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <input
            type="text"
            name="profile.first_name"
            value={formData.profile.first_name}
            onChange={handleChange}
            placeholder="nome"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.last_name"
            value={formData.profile.last_name}
            onChange={handleChange}
            placeholder="sobrenome"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="profile.phone"
            value={formData.profile.phone}
            onChange={handleChange}
            placeholder="telefone"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="profile.birth_date"
            value={formData.profile.birth_date}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.street_name"
            value={formData.profile.street_name}
            onChange={handleChange}
            placeholder="logradouro"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.street_number"
            value={formData.profile.street_number}
            onChange={handleChange}
            placeholder="número"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.complement"
            value={formData.profile.complement}
            onChange={handleChange}
            placeholder="complemento"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.neighborhood"
            value={formData.profile.neighborhood}
            onChange={handleChange}
            placeholder="bairro"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.city"
            value={formData.profile.city}
            onChange={handleChange}
            placeholder="cidade"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <select
            name="profile.state"
            value={formData.profile.state}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Estado</option>
            <option value="SP">SP</option>
            {/* <option value="RJ">Rio de Janeiro</option> */}
          </select>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="profile.zipcode"
            value={formData.profile.zipcode}
            onChange={handleChange}
            placeholder="CEP"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <select
            name="profile.residence_type"
            value={formData.profile.residence_type}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">tipo de residência</option>
            <option value="HOUSE">Casa</option>
            <option value="APARTMENT">Apartamento</option>
            <option value="FARM">Fazenda</option>
          </select>
        </div>

        <NumberInput
          name="profile.number_of_residents"
          value={formData.profile.number_of_residents}
          onChange={handleChange}
          min={1}
          max={20}
          label={"número de residentes"}
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="profile.has_screens"
            checked={formData.profile.has_screens}
            onChange={handleChange}
            className="form-checkbox"
            id="has_screens"
          />
          <label htmlFor="has_screens" className="checkbox-label">
            a residência possui telas de proteção
          </label>
        </div>

        <div className="checkbox-group">
          <input 
            type="checkbox"
            name="profile.has_children"
            checked={formData.profile.has_children}
            onChange={handleChange}
            className="form-checkbox"
            id="has_children"
          />
          <label htmlFor="has_children" className="checkbox-label">
            crianças moram na residência
          </label>
        </div>

        <div className="checkbox-group">
          <input 
            type="checkbox"
            name="profile.has_allergic_residents"
            checked={formData.profile.has_allergic_residents}
            onChange={handleChange}
            className="form-checkbox"
            id="has_allergic_residents"
          />
          <label htmlFor="has_allergic_residents" className="checkbox-label">
            há pessoas com alergia morando na residência
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="profile.has_other_pets"
            checked={formData.profile.has_other_pets}
            onChange={handleChange}
            className="form-checkbox"
            id="has_other_pets"
          />
          <label htmlFor="has_other_pets" className="checkbox-label">
            há outros pets na residência
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            name="profile.acknowledges_costs"
            checked={formData.profile.acknowledges_costs}
            onChange={handleChange}
            className="form-checkbox"
            id="acknowledges_costs"
          />
          <label htmlFor="acknowledges_costs" className="checkbox-label">
            reconheço e aceito os custos e as responsabilidades relacionadas a adoção de um pet
          </label>
        </div>

        <div className="form-group">
          <textarea
            name="profile.adoption_motivation"
            value={formData.profile.adoption_motivation}
            onChange={handleChange}
            placeholder="O que te faz querer adotar?"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="usuário"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="senha"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="confirme a senha"
            className="form-input"
          />
        </div>

        {errors.general && (
          <div className="error-message">{errors.general}</div>
        )}

        <button type="submit" className="submit-button">
          Registrar
        </button>
      </form>
    </div>
  );
};


export default AdoptantRegistration;