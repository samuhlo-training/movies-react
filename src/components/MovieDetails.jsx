/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Spinner from './Spinner'
import Flag from 'react-world-flags'

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
} from '@material-tailwind/react'

import { useState } from 'react'
import { API_BASE_URL, API_OPTIONS } from '../constants'
import { useEffect } from 'react'

const MovieDetails = ({ movieId, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('en-US')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage)
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/movie/${movieId}?language=${language}`,
          API_OPTIONS,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }
        const data = await response.json()
        setMovieDetails(data)
      } catch (error) {
        console.error(`Error fetching movie details: ${error}`)
        setErrorMessage('Error fetching movie details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId, language])

  if (!movieDetails) {
    return
  }

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('backdrop-blur-xs')) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-xs z-50 sm:mr-3 sm:ml-3"
      onClick={(e) => handleOutsideClick(e)}
    >
      {isLoading && <Spinner />}
      <Card
        className="w-full max-w-[48rem] flex-row bg-dark-100 shadow-lg mr-3 ml-3"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader
          shadow={false}
          floated={false}
          className="m-0 w-2/5 shrink-0 rounded-r-none"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
            alt={`Poster for ${movieDetails.title}`}
            className="h-full w-full object-cover"
          />
        </CardHeader>
        <CardBody>
          <div className="row flex mb-4 mt-2">
            <button
              className={`cursor-pointer rounded-md rounded-r-none bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${language === 'en-US' ? 'bg-blue-500' : ''}`}
              type="button"
              onClick={() => handleLanguageChange('en-US')}
              disabled={language === 'en-US'}
            >
              EN
            </button>
            <button
              className={`cursor-pointer rounded-none bg-slate-800 py-1 px-2.5 border-l border-r border-slate-700 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${language === 'es-ES' ? 'bg-blue-500' : ''}`}
              type="button"
              onClick={() => handleLanguageChange('es-ES')}
              disabled={language === 'es-ES'}
            >
              ES
            </button>
            <button
              className={`cursor-pointer rounded-none bg-slate-800 py-1 px-2.5 border-l border-r border-slate-700 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${language === 'de-DE' ? 'bg-blue-500' : ''}`}
              type="button"
              onClick={() => handleLanguageChange('de-DE')}
              disabled={language === 'de-DE'}
            >
              DE
            </button>
            <button
              className={`cursor-pointer rounded-none bg-slate-800 py-1 px-2.5 border-l border-r border-slate-700 text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${language === 'fr-FR' ? 'bg-blue-500' : ''}`}
              type="button"
              onClick={() => handleLanguageChange('fr-FR')}
              disabled={language === 'fr-FR'}
            >
              FR
            </button>
            <button
              className={`cursor-pointer rounded-md rounded-l-none bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${language === 'pt-PT' ? 'bg-blue-500' : ''}`}
              type="button"
              onClick={() => handleLanguageChange('pt-PT')}
              disabled={language === 'pt-PT'}
            >
              PT
            </button>
          </div>
          <Typography variant="h6" color="white" className="mb-3 uppercase">
            {movieDetails.release_date}
          </Typography>
          <button
            className="flex items-center justify-center transition-all w-8 h-8 rounded-md text-white hover:bg-white/10 active:bg-white/10 absolute top-1.5 right-1.5 cursor-pointer"
            type="button"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <Typography variant="small" className="text-indigo-500 mb-1">
            {movieDetails.genres.map((genre) => genre.name).join(', ')}
          </Typography>
          <Typography variant="h4" color="white" className="mb-2">
            {movieDetails.title}
          </Typography>
          <Typography
            variant="paragraph"
            color="white"
            className="mb-8 font-normal"
          >
            {movieDetails.overview}
          </Typography>
          <div className="flex items-center justify-between">
            <div className="flex flex-row items-center gap-1">
              <img src="star.svg" alt="Star Icon" />
              <p className="text-white">
                {movieDetails.vote_average
                  ? movieDetails.vote_average.toFixed(1)
                  : 'N/A'}
              </p>
            </div>
            <div className="w-[1.5rem] flex flex-row items-center gap-1.5">
              {movieDetails.origin_country &&
                movieDetails.origin_country.map((country) => (
                  <Flag key={country} code={country} />
                ))}
            </div>
            <div className="flex flex-row items-center gap-1">
              <img src="reloj.svg" alt="Reloj Icon" className="w-[1rem]" />
              <p className="text-white">{movieDetails.runtime}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default MovieDetails
