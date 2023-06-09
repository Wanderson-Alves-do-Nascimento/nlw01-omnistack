import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent, point } from 'leaflet';
import axios from 'axios';

import api from '../../services/api';
import Dropzone from '../../components/dropzone/DropZone'
import { SuccessScreen } from './SuccessScreen';
import './styles.css'
import logo from '../../assets/logo.svg'


interface ItemProps {
  id: number;
  title: string;
  image_url: string;
}
interface IBGEUFResponse {
  sigla: string;
}
interface IBGECitiesResponse {
  nome: string;
}
export function CreatePoint() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemProps[]>([])
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState('0');
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: ''
  })
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setInitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    api.get('items')
      .then(response => {
        setItems(response.data);
      });
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/?orderBy=nome')
      .then(response => {
        const ufInitials = response.data.map(uf => uf.sigla)
        setUfs(ufInitials)
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return
    }
    axios.get<IBGECitiesResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome)
        setCities(cityNames)
      });
  }, [selectedUf]);


  function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value
    setSelectedUf(uf);
  }
  function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {
    console.log(event.latlng)
  }


  function AddMarkerToClick() {
    const map = useMapEvents({
      click(event) {
        setSelectedPosition([
          event.latlng.lat,
          event.latlng.lng,
        ]);
      },
    });

    return (
      selectedPosition[0] !== 0 ? (
        <Marker
          position={[selectedPosition[0], selectedPosition[1]]}
          interactive={true}
        />
      ) : null
    );
  }
  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
  }
  function handleSelectedItem(id: number) {
    const alreadySelected = selectedItems.findIndex(item => item == id)

    if (alreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems

    const data = new FormData();
    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    if (selectedFile) {
      data.append('image', selectedFile)
    }

    await api.post('points', data);
    alert('Ponto de coleta criado!')
    navigate('/')
  }
  return (
    <div id='page-create-point'>
      <header>
        <img src={logo} alt="Ecoleta" />
        <Link to='/'>
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
              type="text"
              name='name'
              id='name'
              onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name='email'
                id='email'
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name='whatsapp'
                id='whatsapp'
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <MapContainer
            center={[-23.6832414, -46.6509572]}
            zoom={12}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <AddMarkerToClick />
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select onChange={handleSelectedUf} name="uf" id="uf" value={selectedUf}>
                <option disabled value="0">Selecione um Estado</option>
                {ufs.map(uf => (
                  <option value={uf} key={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" onChange={handleSelectedCity} value={selectedCity}>
                <option value="0">Selecione uma Cidade</option>
                {cities.map((city, index) => (
                  <option value={city} key={index}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className='items-grid'>
            {
              items.map(item => (
                <li
                  key={item.id}
                  onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))
            }

          </ul>
        </fieldset>
        <button type='submit'>Cadastrar ponto de coleta</button>
      </form>
      <SuccessScreen />
    </div >
  );
};