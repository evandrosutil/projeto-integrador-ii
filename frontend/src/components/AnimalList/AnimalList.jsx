import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search } from 'lucide-react';
import './AnimalList.css';
import './AnimalModal.css';
import dog2 from "../../images/cachorro2.jpg"
import dog3 from "../../images/cachorro3.jpg"
import dog4 from "../../images/cachorro4.jpg"
import { getUserData } from '../../services/auth';
import { X } from 'lucide-react';

const placeholderImages = [
  dog2,
  dog3,
  dog4,
];

const getStatusLabel = (status) => {
  const statusMap = {
    'available': 'Disponível',
    'adopted': 'Adotado',
    'under_treatment': 'Em tratamento',
    'quarantine': 'Em quarentena'
  };
  return statusMap[status] || status;
};

const getGenderLabel = (gender) => {
  return gender === 'M' ? 'Macho' : gender === 'F' ? 'Fêmea' : gender;
};

const getIdadeGroup = (age_estimated) => {
  if (age_estimated <= 1) return 'filhote';
  if (age_estimated <= 7) return 'adulto';
  return 'idoso';
};

const getVaccineted = (vaccinated) => {
  if (vaccinated) return "vacinado";
  return "nao_vacinado";
}

const getNeutered = (neutered) => {
  if (neutered) return "castrado";
  return "nao_castrado";
}

const getPorte = (weight) => {
  if (weight <= 15) return 'pequeno';
  if (weight <= 25) return 'médio';
  if (weight <= 45) return 'grande';
  return 'gigante';
}

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  const result = placeholderImages[randomIndex];
  return result;
};

const getResidenceType = (residenceType) => {
  if (residenceType === 'HOUSE') return 'Casa';
  if (residenceType === 'APARTMENT') return 'Apartamento';
  if (residenceType === 'FARM') return 'Fazenda';
}

function AdopterAnimalList() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [idadeFilter, setIdadeFilter] = useState('todos');
  const [vacinacaoFilter, setVacinacaoFilter] = useState('todos');
  const [porteFilter, setPorteFilter] = useState('todos');
  const [generoFilter, setGeneroFilter] = useState('todos');
  const [castradoFilter, setCastradoFilter] = useState('todos');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const userData = getUserData();

  const InterestedModal = ({ user, onClose }) => {

    return (
      <div className="modal-overlay">
        <div className="modal-header">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className='profile-view'>
            <div className="profile-section">
              <h3>Informações pessoais</h3>
              <p><strong>Nome:</strong> {user.first_name}</p>
              <p><strong>Sobrenome:</strong> {user.last_name}</p>
              <p><strong>Telefone:</strong> {user.profile.phone}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="profile-section">
              <h3>Informações de Residência</h3>
              <p><strong>Tipo de Residência:</strong> {getResidenceType(user.profile.residence_type)}</p>
              <p><strong>Possui telas de proteção:</strong> {user.profile.has_screens ? "Sim" : "Não"}</p>
              <p><strong>Número de moradores:</strong> {user.profile.number_of_residents}</p>
              <p><strong>Crianças na residência:</strong> {user.profile.has_children ? "Sim" : "Não"}</p>
              <p><strong>Moradores com alergia a pets:</strong> {user.profile.has_allergic_residents ? "Sim" : "Não"}</p>
              <p><strong>Possui outros pets:</strong> {user.profile.has_other_pets ? "Sim" : "Não"}</p>
              {user.profile.has_other_pets && (
                <p><strong>Número de pets:</strong> {user.profile.number_of_pets}</p>
              )}
            </div>

            <div className="profile-section">
              <h3>Motivação para Adoção</h3>
              <p>{user.profile.adoption_motivation}</p>
              <br />
              <p><strong>Aceita os custos e responsabilidades:</strong> {user.profile.acknowledges_costs ? "Sim" : "Não"}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const AnimalModal = ({ animal, onClose }) => {
    const [status, setStatus] = useState(animal.status)
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState('')

    const handleStatusChange = (e) => {
      setStatus(e.target.value);
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await api.post(`/animals/${animal.id}/change_status/`, {
          status: status
        });

        setMessage('Status alterado com sucesso');
        setTimeout(() => {
          setMessage('');
        }, 3000);
        setTimeout(() => {
          fetchAnimals();
          animal.status = status;
        }, 500);
      } catch (error) {
        console.log(error);
        setError('Erro ao alterar o status para ', status);
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    }
    const handleAdopt = async () => {
      try {
        const response = await api.post(`/animals/${animal.id}/adopt/`);
        setMessage(response.data.detail || 'Intenção de adoção registrada com sucesso.');

        setTimeout(() => {
          setMessage('');
        }, 3000);
        setTimeout(() => {
          fetchAnimals();
        }, 500);
      } catch (err) {
        setError(
          err.response?.data?.detail || 'Erro ao registrar a intenção de adoção.'
        );

        setTimeout(() => {
          setError('');
        }, 3000);
      }
    };
    if (!animal) return null;

    const booleanInfo = (info) => {
      if (info) return 'Sim';
      return 'Não';
    }

    const handleUserInfoClick = (user) => {
      setSelectedUser(user);
    }

    return (
      <div className="modal-overlay">
        <div className="modal-header">
          <h2 className="text-2xl font-bold">{animal.name}</h2>
          <button
            onClick={onClose}
            className="modal-close-button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-grid">
            {/* Coluna da imagem */}
            <div>
              <img
                src={animal.image}
                alt={animal.name}
                className="modal-image"
              />
            </div>

            {/* Coluna das informações */}
            <div>
              <div className="modal-info">
                <h3 className="text-xl font-semibold mb-4">Informações Básicas</h3>
                <div className="space-y-4">
                  <div className="modal-info-text">
                    <span className="font-semibold w-24">Raça: </span>
                    <span>{animal.breed}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Gênero: </span>
                    <span>{getGenderLabel(animal.gender)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Idade: </span>
                    <span>{animal.age_estimated} anos</span>
                  </div>
                  <div className="modal-info-text">
                    <span className="font-semibold w-24">Porte: </span>
                    <span>{getPorte(animal.weight)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Peso: </span>
                    <span>{animal.weight} kg</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Vacinação: </span>
                    <span>{booleanInfo(animal.vaccinated)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-24">Castração: </span>
                    <span>{booleanInfo(animal.neutered)}</span>
                  </div>
                </div>
              </div>

              {animal.description && (
                <div className="modal-info">
                  <h3 className="text-xl font-semibold mb-4">Sobre</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {animal.description}
                  </p>
                </div>
              )}

              {userData.role === 'admin' && (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="status"> Status do Animal:</label>
                  <select
                    id="status"
                    value={status}
                    onChange={handleStatusChange}
                    className="status-select"
                  >
                    <option value="available">Disponível</option>
                    <option value="adopted">Adotado</option>
                    <option value="under_treatment">Em tratamento</option>
                    <option value="quarantine">Em quarentena</option>
                  </select>
                  <button type="submit" className="adopt-button">Mudar status</button>
                </form>
              )
              }
            </div>

            <div>
              {userData.role === 'admin' ? (
                <div>
                  <h3>Interessados</h3>
                  <ul className="interested-list">
                    {animal.interested_users && animal.interested_users.length > 0 ? (
                      animal.interested_users.map((user) => (
                        <li
                          key={user.id}
                          onClick={() => handleUserInfoClick(user)}
                          className="interested-item">
                          <span className="user-icon">👤</span>
                          <span>{user.username} - {user.email}</span>
                        </li>
                      ))
                    ) : (
                      <p>Nenhum interessado ainda.</p>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="modal-adopt-button">
                  <button className="adopt-button" onClick={handleAdopt}>
                    Quero Adotar
                  </button>
                </div>
              )}

              {selectedUser && (
                <InterestedModal
                  user={selectedUser}
                  onClose={() => setSelectedUser(null)}
                />
              )}

              {/* Mensagens de sucesso e erro */}
              {message && <div className="popup success">{message}</div>}
              {error && <div className="popup error">{error}</div>}
            </div>
          </div>
          {message && <div className="popup success">{message}</div>}
          {error && <div className="popup error">{error}</div>}
        </div >
      </div>
    );
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await api.get('/animals/');
      setAnimals(response.data.results || response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar os animais.');
      setLoading(false);
    }
  };

  const filteredAnimals = animals.filter(animal => {
    const matchesName = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBreed = animal.breed.toLowerCase().includes(searchTerm.toLocaleLowerCase());
    const matchesSpecies = animal.species.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase());
    const matchesIdade = idadeFilter === 'todos' || getIdadeGroup(animal.age_estimated) === idadeFilter;
    const matchesVacinacao = vacinacaoFilter === 'todos' || getVaccineted(animal.vaccinated) === vacinacaoFilter;
    const matchesStatus = (userData.role === 'admin' && (statusFilter === 'todos' || animal.status === statusFilter)) || (userData.role !== 'admin' && animal.status === 'available');
    const matchesGenero = generoFilter === 'todos' || animal.gender === generoFilter;
    const matchesCastrado = castradoFilter === 'todos' || getNeutered(animal.neutered) === castradoFilter;
    const matchesPorte = porteFilter === 'todos' || getPorte(animal.weight) === porteFilter;

    return (matchesName || matchesBreed || matchesSpecies) && matchesIdade && matchesVacinacao && matchesStatus && matchesGenero && matchesCastrado && matchesPorte;
  });


  if (loading) return <div className="loading">Carregando...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleCardClick = (animal) => {
    setSelectedAnimal(animal);
  }

  return (
    <div className="container">
      <h2 className="page-title">Adoções</h2>

      {/* Campo de Busca */}
      <div className='filters-container'>
        {/* Campo de Busca */}
        <div className="search-container">
          <div className="relative">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, espécie ou raça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Container dos Selects */}
        <div className='select-container'>
          {userData?.role === 'admin' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="select-input"
            >
              <option value="todos">Todos os status</option>
              <option value="available">Disponível</option>
              <option value="adopted">Adotado</option>
              <option value="under_treatment">Em tratamento</option>
              <option value="quarantine">Em quarentena</option>
            </select>
          )}

          <select
            className="select-input"
            value={idadeFilter}
            onChange={(e) => setIdadeFilter(e.target.value)}
          >
            <option value="todos">Todas as idades</option>
            <option value="filhote">Filhote (0-1 ano)</option>
            <option value="adulto">Adulto (1-7 anos)</option>
            <option value="idoso">Idoso (7+ anos)</option>
          </select>

          <select
            value={vacinacaoFilter}
            onChange={(e) => setVacinacaoFilter(e.target.value)}
            className="select-input"
          >
            <option value="todos">Todas as vacinações</option>
            <option value="vacinado">Vacinação completa</option>
            <option value="nao_vacinado">Vacinação pendente</option>
          </select>

          <select
            className="select-input"
            value={castradoFilter}
            onChange={(e) => setCastradoFilter(e.target.value)}
          >
            <option value="todos">Todas as castrações</option>
            <option value="castrado">Castrados</option>
            <option value="nao_castrado">Castração pendente</option>
          </select>

          <select
            value={generoFilter}
            onChange={(e) => setGeneroFilter(e.target.value)}
            className='select-input'
          >
            <option value="todos">Todas os gêneros</option>
            <option value="M">Macho</option>
            <option value="F">Fêmea</option>
          </select>

          <select
            value={porteFilter}
            onChange={(e) => setPorteFilter(e.target.value)}
            className='select-input'
          >
            <option value="todos">Todos os portes</option>
            <option value="pequeno">Pequeno (até 15kg)</option>
            <option value="médio">Médio (16-25 kg)</option>
            <option value="grande">Grande (26-45 kg)</option>
            <option value="gigante">Gigante (46+ kg)</option>
          </select>
        </div>
      </div>



      {/* Grid de Cards */}
      <div className="animal-grid">
        {filteredAnimals.map(animal => (
          <div
            key={animal.id}
            onClick={() => handleCardClick(animal)}
            className="animal-card"
          >
            {/*Foro*/}
            <img
              src={animal.image || getRandomImage()}
              alt={animal.name}
              className="animal-image"
            />

            {/* Informações do Animal */}
            <div className="animal-info">
              <h3 className="animal-name">{animal.name}</h3>
              <p className="animal-details">
                {getGenderLabel(animal.gender)} • {getIdadeGroup(animal.age_estimated)} • {getPorte(animal.weight)}<br /><br />
                {userData?.role === 'admin' && (getStatusLabel(animal.status))}
              </p>
              <br />
            </div>
          </div>
        ))}
      </div>

      {selectedAnimal && (
        <AnimalModal
          animal={selectedAnimal}
          onClose={() => setSelectedAnimal(null)}
        />
      )}
    </div>
  );
}


export default AdopterAnimalList;