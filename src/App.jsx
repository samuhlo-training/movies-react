import { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { updateSearchCount, getTrendingMovies } from './appwrite'
import Search from './components/Search'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard'
import ErrorAlert from './components/ErrorAlert'
import MovieDetails from './components/MovieDetails'
import { API_BASE_URL, API_OPTIONS } from './constants'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  const [moviesList, setMoviesList] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [trendingMovies, setTrendingMovies] = useState([])
  const [trendingError, setTrendingError] = useState('')
  const [trendingLoading, setTrendingLoading] = useState(false)

  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [isOpenMovieDetails, setIsOpenMovieDetails] = useState(false)

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 800, [searchTerm])

  const closeErrorAlert = () => {
    setErrorMessage('')
    setTrendingError('')
  }

  const openMovieDetails = (movieId) => {
    setSelectedMovieId(movieId)
    setIsOpenMovieDetails(true)
  }

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?&sort_by=popularity.desc`
      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }
      const data = await response.json()
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Error fetching movies')
        setMoviesList([])
        return
      }
      setMoviesList(data.results || [])
      if (query && data.results.length) {
        await updateSearchCount(query, data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage('Error fetching movies. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    setTrendingLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`)
      setTrendingError(
        'Error fetching trending movies. Please try again later.',
      )
    } finally {
      setTrendingLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm)
  }, [debouncedSearchTerm])

  useEffect(() => {
    loadTrendingMovies()
  }, [])

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          {errorMessage && (
            <div className="fixed -mt-12 z-100">
              <ErrorAlert errorText={errorMessage} onClose={closeErrorAlert} />
            </div>
          )}
          {trendingError && (
            <ErrorAlert errorText={trendingError} onClose={closeErrorAlert} />
          )}
          <h1>
            <img src="./hero.png" alt="Hero Banner " />
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {isOpenMovieDetails && (
            <MovieDetails
              movieId={selectedMovieId}
              onClose={() => setIsOpenMovieDetails(false)}
            />
          )}

          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingLoading ? (
                <Spinner classProp={'mt-15'} />
              ) : (
                trendingMovies.length > 0 &&
                trendingMovies.map((movie, index) => (
                  <li
                    key={movie.$id}
                    onClick={() => openMovieDetails(movie.movie_id)}
                  >
                    <p>{index + 1}</p>
                    <div className=" group w-auto flex justify-center text-center relative overflow-hidden rounded-md cursor-pointer">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-auto relative z-0 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </header>
        <section className="all-movies">
          <h2 className="mt-10">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : (
            <ul>
              {moviesList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  openDetails={openMovieDetails}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
export default App
