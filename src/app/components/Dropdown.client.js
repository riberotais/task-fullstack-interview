// Dropdown.client.js
"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';


const flagEmojis = {// just using because the select option does not allow children el with image, but in a real world project it should come from an third part lib
  'Portugal': '🇵🇹',
  'Morocco': '🇲🇦',
  'France': '🇫🇷',
};

const Dropdown = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [gdpPerCapita, setGdpPerCapita] = useState('');

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const filteredCountries = response.data.filter(country => 
          ['Portugal', 'Morocco', 'France'].includes(country.name.common)
        );
        const countryData = filteredCountries.map(country => ({
          name: country.name.common,
          flag: country.flags.svg,
          currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
          iso3: country.cca3 
        }));
        setCountries(countryData);
      })
      .catch(error => {
        console.error('Error fetching countries', error);
      });
  }, []);

  const handleSelectChange = async (event) => {
    const countryName = event.target.value;
    const country = countries.find(c => c.name === countryName);
    setSelectedCountry(country);

    //  using the World Bank API to fetch data
    if (country) {
      try {
        const gdpResponse = await axios.get(`https://api.worldbank.org/v2/country/${country.iso3}/indicator/NY.GDP.PCAP.CD?format=json&date=2020`);
        // Assuming the most recent value is first in the array
        const gdpValue = gdpResponse.data[1][0].value;
        setGdpPerCapita(gdpValue);
      } catch (error) {
        console.error('Error fetching GDP per capita', error);
        setGdpPerCapita('Data not available');
      }
    }
  };

  return (
    <div className='bg-White h-screen flex flex-col justify-center items-center'>
      <select onChange={handleSelectChange} defaultValue="" className='bg-white py-2 px-4 rounded shadow-lg mb-4'>
      <option value="" disabled>Select a country</option>
        {countries.map((country, index) => (
         <option key={index} value={country.name}>
         {flagEmojis[country.name]} {country.name}
       </option>
        ))}
      </select>
      {selectedCountry && (
        <div className='bg-white p-4 rounded shadow-lg'>
          <span>
            Currency: {selectedCountry.currency !== 'N/A' ? ` ${selectedCountry.currency}` : 'Data not available'}
            | GDP per capita (Current US$): {gdpPerCapita ? gdpPerCapita.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'Data not available'}
          </span>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
