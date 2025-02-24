'use client'
import React, { useState, useEffect, useRef } from 'react'
import dataset from "../datasets/city.list.json"
import Image from 'next/image'
import SearchIcon from '../../../public/Frame.svg'
import { useLocation } from './LocationContext'



const Search = () => {
  const cities = dataset;
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const { setCoordinates } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const locationParam = params.get('location')
    const countryParam = params.get('country')

    if (!locationParam) {
      // Set default to Athens and update URL
      setSearchTerm('')
      updateURL('Athens', 'GR')
    } else {
      setSearchTerm(locationParam)
    }
  }, [])


  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = cities
        .filter(city => 
          city.name.toLowerCase().startsWith(value.toLowerCase()) || 
          city.state?.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 5);
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };
  
  

  const handleSelection = (city) => {
    updateLocationQuery(city.name)
    updateCountrynQuery(city.country)
    setSearchTerm(city.name)
    setShowResults(false)
    // Update coordinates when city is selected
    setCoordinates({ lat: city.coord.lat, lon: city.coord.lon })
  }

  const updateLocationQuery = (location) => {
    const params = new URLSearchParams(window.location.search);
    params.set('location', location);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };
  const updateCountrynQuery = (country) => {
    const params = new URLSearchParams(window.location.search);
    if (country) {
        params.set('country', country);
    } else {
        params.delete('country');
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      updateLocationQuery(searchTerm);
      updateCountrynQuery('');
      setShowResults(false);
    }
  };

  const updateURL = (location, country) => {
    const params = new URLSearchParams(window.location.search)
    params.set('location', location)
    params.set('country', country)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.pushState({}, '', newUrl)
  }

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        className={`search-input ${showResults ? 'input-round' : ''}`}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Location ..."
      />
      <button className="search-button" onClick={() =>{
        updateLocationQuery(searchTerm)
        updateCountrynQuery('')
        }}>
        <Image
            src={SearchIcon}
            alt="Search Icon"
            width={20}
            height={20}
        />  
        </button>

         
      <div className={`results-container ${showResults ? 'visible' : ''}`}>
        {
          results.map((city) => (
            <div
              key={city.id}
              className="result-item"
              onClick={() => handleSelection(city)}
            >
              <div className="result-name">{city.name},</div>
              <div className="result-location">
                {city.state && `${city.state}, `}{city.country}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Search;