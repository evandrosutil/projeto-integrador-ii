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
  console.log("peso: ", weight);
  if (weight <= 15) return 'pequeno';
  if (weight <= 25) return 'médio';
  if (weight <= 45) return 'grande';
  return 'gigante';
}
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * placeholderImages.length);
  const result = placeholderImages[randomIndex];
  console.log(result);
  return result;
};

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
    console.log("animal ", animal);
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
      {/* 
      <div className='filters-container'>
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

          <div className='select-container'>

          </div>
        </div>
      </div> 
      */}
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

const AnimalModal = ({ animal, onClose }) => {
  if (!animal) return null;

  const booleanInfo = (info) => {
    if (info) return 'Sim';
    return 'Não';
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
          </div>
        </div>

        <div className="modal-adopt-button">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 w-full font-semibold">
            Quero Adotar
          </button>
        </div>
      </div>
    </div >
  );
};

export default AdopterAnimalList;