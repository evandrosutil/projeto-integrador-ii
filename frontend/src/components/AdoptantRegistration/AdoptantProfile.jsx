import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdoptantRegistration.css';
import './AdoptantProfile.css';
import NumberInput from '../../utils';


const AdoptantRegistration = () => {
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/adopter/profile');
      console.log("Dados recebidos: : ", response.data);
      setFormData({
        username: response.data.username || '',
        email: response.data.email || '',
        password: '',
        confirmPassword: '',
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        profile: {
          phone: response.data.profile?.phone || '',
          birth_date: response.data.profile?.birth_date || '',
          street_name: response.data.profile?.street_name || '',
          street_number: response.data.profile?.street_number || '',
          complement: response.data.profile?.complement || '',
          neighborhood: response.data.profile?.neighborhood || '',
          city: response.data.profile?.city || '',
          state: response.data.profile?.state || '',
          zipcode: response.data.profile?.zipcode || '',
          residence_type: response.data.profile?.residence_type || 'HOUSE',
          has_screens: response.data.profile?.has_screens || false,
          number_of_residents: response.data.profile?.number_of_residents || 1,
          has_children: response.data.profile?.has_children || false,
          has_allergic_residents: response.data.profile?.has_allergic_residents || false,
          has_other_pets: response.data.profile?.has_other_pets || false,
          number_of_pets: response.data.profile?.number_of_pets || 0,
          adoption_motivation: response.data.profile?.adoption_motivation || '',
          acknowledges_costs: response.data.profile?.acknowledges_costs || false
        }
      });
    } catch (err) {
      setError('Erro ao carregar o perfil do usuário');
    }
  }

  if (!formData) {
    return <div>Carregando dados do perfil...</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password === '') delete formData['password']
      if (formData.confirmPassword === '') delete formData['confirmPassword']

      console.log('Dados a serem enviados: ', formData)

      const response = await api.patch('/adopter/update', formData);

      localStorage.setItem('token', response.data.token);
      setMessage('Perfil atualizado com sucesso!')
      setTimeout(() => {
        setMessage('');
      }, 3000);
      handleEditClick();
    } catch (error) {
      setErrors(error.response?.data || { general: "Erro ao atualizar os dados" });
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };
  const getResidenceType = (residenceType) => {
    if (residenceType === 'HOUSE') return 'Casa';
    if (residenceType === 'APARTMENT') return 'Apartamento';
    if (residenceType === 'FARM') return 'Fazenda';
  } 

  const handleEditClick = () => setIsEditing(!isEditing);

  if (!formData) {
    return <div>Carregando dados do perfil...</div>;
  }

  return (
    <div className="registration-container">
      <h2 className="registration-title">Meu perfil</h2>

      {!isEditing ? (
        <div className='profile-view'>
          <div className="profile-section">
            <h3>Informações pessoais</h3>
            <p><strong>Nome:</strong> {formData.first_name}</p>
            <p><strong>Sobrenome:</strong> {formData.last_name}</p>
            <p><strong>Telefone:</strong> {formData.profile.phone}</p>
            <p><strong>Data de Nascimento:</strong> {formData.profile.birth_date}</p>
          </div>

          <div className="profile-section">
            <h3>Endereço</h3>
            <p><strong>Rua:</strong> {formData.profile.street_name}, {formData.profile.street_number}</p>
            <p><strong>Complemento:</strong> {formData.profile.complement}</p>
            <p><strong>Bairro:</strong> {formData.profile.neighborhood}</p>
            <p><strong>Cidade:</strong> {formData.profile.city}</p>
            <p><strong>UF:</strong> {formData.profile.state}</p>
            <p><strong>CEP:</strong> {formData.profile.zipcode}</p>
          </div>

          <div className="profile-section">
            <h3>Informações de Residência</h3>
            <p><strong>Tipo de Residência:</strong> {getResidenceType(formData.profile.residence_type)}</p>
            <p><strong>Possui telas de proteção:</strong> {formData.profile.has_screens ? "Sim" : "Não"}</p>
            <p><strong>Número de moradores:</strong> {formData.profile.number_of_residents}</p>
            <p><strong>Crianças na residência:</strong> {formData.profile.has_children ? "Sim" : "Não"}</p>
            <p><strong>Moradores com alergia a pets:</strong> {formData.profile.has_allergic_residents ? "Sim" : "Não"}</p>
            <p><strong>Possui outros pets:</strong> {formData.profile.has_other_pets ? "Sim" : "Não"}</p>
            {formData.profile.has_other_pets && (
              <p><strong>Número de pets:</strong> {formData.profile.number_of_pets}</p>
            )}
          </div>

          <div className="profile-section">
            <h3>Motivação para Adoção</h3>
            <p>{formData.profile.adoption_motivation}</p>
            <br />
            <p><strong>Aceita os custos e responsabilidades:</strong> {formData.profile.acknowledges_costs ? "Sim" : "Não"}</p>
          </div>

          <button onClick={handleEditClick} className="edit-button">Editar</button>
        </div>
      ) : (
        // Modo Edição
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="nome"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
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
            Atualizar dados
          </button>
          <button onClick={handleEditClick} className='submit-button'>Voltar</button>
        </form>
      )
      }

      {(message || errors.general) && (
        <div className="popup">
          {message || errors.general}
        </div>
      )}
    </div >
  );
};


export default AdoptantRegistration;