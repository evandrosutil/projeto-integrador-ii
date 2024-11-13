import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AnimalList.css';
import { Search, PawPrint, Weight, Calendar, Info, Check, X, Heart } from 'lucide-react';
import { getUserData } from '../../services/auth';

function AnimalList() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [idadeFilter, setIdadeFilter] = useState('todos');
  const [vacinacaoFilter, setVacinacaoFilter] = useState('todos');
  const [generoFilter, setGeneroFilter] = useState('todos');
  const [castradoFilter, setCastradoFilter] = useState('todos')
  const userData = getUserData();

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      console.log("Fazendo requisição para a API...");
      const response = await api.get('/animals/');
      console.log("Resposta da API:", response.data);

      const animalData = response.data.results || response.data;

      if (Array.isArray(animalData)) {
        setAnimals(animalData);
      } else {
        console.error("Dados recebidos não são um array:", animalData);
        setError('Formato de dados inválido');
      }
      setLoading(false);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError('Erro ao carregar os animais: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

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
  
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIdade = idadeFilter === 'todos' || getIdadeGroup(animal.age_estimated) === idadeFilter;
    const matchesVacinacao = vacinacaoFilter === 'todos' || getVaccineted(animal.vaccinated) === vacinacaoFilter;
    const matchesStatus = (userData.role === 'admin' && (statusFilter === 'todos' || animal.status === statusFilter)) || animal.status === 'available';
    const matchesGenero = generoFilter === 'todos' || animal.gender === generoFilter;
    const matchesCastrado = castradoFilter === 'todos' || getNeutered(animal.neutered) === castradoFilter;
  
    return matchesSearch && matchesIdade && matchesVacinacao && matchesStatus && matchesGenero && matchesCastrado;
  });


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="container mx-auto p-4">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r" role="alert">
        <p className="font-bold">Erro</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Lista de Animais</h2>
          <p className="text-gray-600">Encontre seu novo companheiro</p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, espécie ou raça..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-4">

            <select
              className="border rounded-md p-2"
              value={idadeFilter}
              onChange={(e) => setIdadeFilter(e.target.value)}
            >
              <option value="todos" disabled hidden>Todas as idades</option>
              <option value="filhote">Filhote (0-1 ano)</option>
              <option value="adulto">Adulto (1-7 anos)</option>
              <option value="idoso">Idoso (7+ anos)</option>
            </select>

            <select
              className="border rounded-md p-2"
              value={generoFilter}
              onChange={(e) => setGeneroFilter(e.target.value)}
            >
              <option value="todos" disabled hidden>Todas os gêneros</option>
              <option value="M">Macho</option>
              <option value="F">Fêmea (1-7 anos)</option>
            </select>

            {userData?.role === 'admin' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="todos" disabled hidden>Todos os status</option>
                <option value="available">Disponível</option>
                <option value="adopted">Adotado</option>
                <option value="under_treatment">Em tratamento</option>
                <option value="quarantine">Em quarentena</option>
              </select>
            )}

            <select
              className="border rounded-md p-2"
              value={vacinacaoFilter}
              onChange={(e) => setVacinacaoFilter(e.target.value)}
            >
              <option value="todos" disabled hidden>Todas as vacinações</option>
              <option value="vacinado">Vacinação completa</option>
              <option value="nao_vacinado">Vacinação pendente</option>
            </select>

            <select
              className="border rounded-md p-2"
              value={castradoFilter}
              onChange={(e) => setCastradoFilter(e.target.value)}
            >
              <option value="todos" disabled hidden>Todas as castrações</option>
              <option value="castrado">Castrados</option>
              <option value="nao_castrado">Castração pendente</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {filteredAnimals.length} {filteredAnimals.length === 1 ? 'animal encontrado' : 'animais encontrados'}
        </div>

        {filteredAnimals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <PawPrint className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhum animal encontrado</h3>
            <p className="text-gray-600">Tente ajustar seus filtros de busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => (
              <div key={animal.id} className="bg-white rounded-lg shadow-sm overflow-hidden transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="p-6">
                  {/* Header with Name and Status */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{animal.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <PawPrint size={16} className="mr-1" />
                        {animal.species}
                        {animal.breed && ` • ${animal.breed}`}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${animal.status === 'available' ? 'bg-green-100 text-green-800' :
                        animal.status === 'adopted' ? 'bg-blue-100 text-blue-800' :
                          animal.status === 'under_treatment' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                      }`}>
                      {getStatusLabel(animal.status)}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>{animal.age_estimated} anos</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Weight size={16} className="mr-2" />
                      <span>{animal.weight} kg</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Heart size={16} className="mr-2" />
                      <span>{getGenderLabel(animal.gender)}</span>
                    </div>
                  </div>

                  {/* Description */}
                  {animal.description && (
                    <div className="mb-4">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Info size={16} className="mr-2" />
                        <span className="font-medium">Descrição</span>
                      </div>
                      <p className="text-gray-600 text-sm">{animal.description}</p>
                    </div>
                  )}

                  {/* Status Indicators */}
                  <div className="flex space-x-4 text-sm border-t pt-4">
                    <div className="flex items-center">
                      {animal.vaccinated ? (
                        <Check size={16} className="mr-2 text-green-500" />
                      ) : (
                        <X size={16} className="mr-2 text-gray-400" />
                      )}
                      <span className={animal.vaccinated ? 'text-green-500' : 'text-gray-500'}>
                        Vacinado
                      </span>
                    </div>
                    <div className="flex items-center">
                      {animal.neutered ? (
                        <Check size={16} className="mr-2 text-green-500" />
                      ) : (
                        <X size={16} className="mr-2 text-gray-400" />
                      )}
                      <span className={animal.neutered ? 'text-green-500' : 'text-gray-500'}>
                        Castrado
                      </span>
                    </div>
                  </div>
                  <div>
                    <img 
                      src={animal.image}
                      alt={animal.name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimalList;