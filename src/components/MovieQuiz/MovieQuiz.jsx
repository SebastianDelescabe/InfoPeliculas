import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../helpers/AppContext';
import { findQuizCandidates } from '../../helpers/movieQuiz';
import { getCommonMovieGenres, getStreamingProviders } from '../../helpers/tmdb';
import Card from '../Card/Card';

const STEP_COUNT = 4;

// Mezcla candidatas para ofrecer otra combinación sin repetir de inmediato.
const pickFour = (movies, previousIds = []) => {
    const previous = new Set(previousIds);
    const freshMovies = movies.filter((movie) => !previous.has(movie.id));
    const pool = freshMovies.length >= 3 ? freshMovies : movies;
    const shuffled = [...pool];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled.slice(0, 4);
};

/** Guía al usuario por cuatro preguntas y presenta una selección corta de TMDB. */
const MovieQuiz = () => {
    const { favorites } = useContext(AppContext);
    const [genres, setGenres] = useState([]);
    const [providers, setProviders] = useState([]);
    const [genresLoading, setGenresLoading] = useState(true);
    const [providersLoading, setProvidersLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [profile, setProfile] = useState('known');
    const [period, setPeriod] = useState('last_year');
    const [selectedProvider, setSelectedProvider] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [quizMovies, setQuizMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showResults, setShowResults] = useState(false);

    const selectedPlatform = providers.find((provider) => String(provider.provider_id) === selectedProvider);
    const monetizationType = selectedPlatform?.monetizationType || 'flatrate';
    const favoriteIds = useMemo(() => new Set(favorites.map((movie) => movie.id)), [favorites]);
    const questions = [
        { title: '¿Qué género te gustaría ver?', description: 'Podés elegir más de uno o dejarlo abierto para cualquier género.' },
        { title: '¿Buscás algo conocido o de nicho?', description: 'Elegimos según popularidad, votos y puntuación.' },
        { title: '¿De cuándo querés la película?', description: 'Podés buscar estrenos recientes o abrir el catálogo a cualquier época.' },
        { title: '¿Querés verla en alguna plataforma?', description: 'Es opcional; mostramos las opciones reportadas para Argentina.' }
    ];

    // Carga una vez las opciones de género y las plataformas disponibles.
    useEffect(() => {
        let active = true;
        getCommonMovieGenres()
            .then((items) => { if (active) setGenres(items); })
            .catch(() => { if (active) setError('No se pudieron cargar los géneros.'); })
            .finally(() => { if (active) setGenresLoading(false); });
        getStreamingProviders()
            .then((items) => { if (active) setProviders(items); })
            .catch(() => { if (active) setError('No se pudieron cargar las plataformas.'); })
            .finally(() => { if (active) setProvidersLoading(false); });
        return () => { active = false; };
    }, []);

    const toggleGenre = (genreId) => {
        setSelectedGenres((current) => current.includes(genreId)
            ? current.filter((id) => id !== genreId)
            : [...current, genreId]);
    };

    // Consulta candidatas al terminar el quiz y mezcla cuatro resultados.
    const findMovies = async () => {
        setLoading(true);
        setError('');
        try {
            const results = await findQuizCandidates({
                genreIds: selectedGenres,
                profile,
                period,
                providerId: selectedProvider,
                monetizationType
            });
            setCandidates(results);
            setQuizMovies(pickFour(results));
            setShowResults(true);
        } catch {
            setError('No se pudieron buscar películas. Revisá la conexión e intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const selectedGenreNames = genres
        .filter((genre) => selectedGenres.includes(genre.id))
        .map((genre) => genre.name);

    return (
        <section className='movie-quiz-page' aria-labelledby='movie-quiz-title'>
            <header className='quiz-intro'>
                <span className='quiz-eyebrow'>DELEFLIX TE AYUDA A ELEGIR</span>
                <h1 id='movie-quiz-title'>Encontrá tu <span>próxima película</span></h1>
                <p>Respondé unas preguntas y te proponemos cuatro opciones para hoy.</p>
            </header>

            {!showResults ? <div className='quiz-panel'>
                <div className='quiz-progress-row'>
                    <span>Paso {step + 1} de {STEP_COUNT}</span>
                    <span>{Math.round(((step + 1) / STEP_COUNT) * 100)}%</span>
                </div>
                <div className='quiz-progress-track' role='progressbar' aria-valuenow={step + 1} aria-valuemin='1' aria-valuemax={STEP_COUNT}>
                    <span style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }} />
                </div>
                <div className='quiz-question'>
                    <h2>{questions[step].title}</h2>
                    <p>{questions[step].description}</p>
                </div>

                {step === 0 && <div className='quiz-option-grid genre-quiz-options'>
                    <button
                        type='button'
                        className={`quiz-option ${selectedGenres.length === 0 ? 'selected' : ''}`}
                        aria-pressed={selectedGenres.length === 0}
                        onClick={() => setSelectedGenres([])}
                    >
                        <strong>Cualquier género</strong><small>Dejame sorprenderte</small>
                    </button>
                    {genres.map((genre) => <button
                        type='button'
                        key={genre.id}
                        className={`quiz-option ${selectedGenres.includes(genre.id) ? 'selected' : ''}`}
                        aria-pressed={selectedGenres.includes(genre.id)}
                        onClick={() => toggleGenre(genre.id)}
                        disabled={genresLoading}
                    >
                        <strong>{genre.name}</strong>
                    </button>)}
                    {genresLoading && <p className='quiz-loading-note'>Cargando géneros…</p>}
                </div>}

                {step === 1 && <div className='quiz-option-grid quiz-two-options'>
                    <button type='button' className={`quiz-option quiz-feature-option ${profile === 'known' ? 'selected' : ''}`} aria-pressed={profile === 'known'} onClick={() => setProfile('known')}>
                        <span className='quiz-option-icon'>✦</span>
                        <strong>Una conocida</strong>
                        <small>Éxitos populares con muchas reseñas.</small>
                    </button>
                    <button type='button' className={`quiz-option quiz-feature-option ${profile === 'niche' ? 'selected' : ''}`} aria-pressed={profile === 'niche'} onClick={() => setProfile('niche')}>
                        <span className='quiz-option-icon'>◈</span>
                        <strong>Una de nicho</strong>
                        <small>Menos conocidas, con al menos 100 votos y buena puntuación.</small>
                    </button>
                </div>}

                {step === 2 && <div className='quiz-option-grid quiz-two-options'>
                    <button type='button' className={`quiz-option quiz-feature-option ${period === 'last_year' ? 'selected' : ''}`} aria-pressed={period === 'last_year'} onClick={() => setPeriod('last_year')}>
                        <span className='quiz-option-icon'>↗</span>
                        <strong>Estrenos recientes</strong>
                        <small>Películas estrenadas durante el último año.</small>
                    </button>
                    <button type='button' className={`quiz-option quiz-feature-option ${period === 'all' ? 'selected' : ''}`} aria-pressed={period === 'all'} onClick={() => setPeriod('all')}>
                        <span className='quiz-option-icon'>∞</span>
                        <strong>Cualquier época</strong>
                        <small>Buscá en todo el catálogo disponible.</small>
                    </button>
                </div>}

                {step === 3 && <div className='quiz-provider-options'>
                    <button type='button' className={`quiz-provider-option ${!selectedProvider ? 'selected' : ''}`} aria-pressed={!selectedProvider} onClick={() => setSelectedProvider('')}>
                        <span className='provider-any-icon'>✦</span><strong>No importa</strong>
                    </button>
                    {providers.map((provider) => <button
                        type='button'
                        key={provider.provider_id}
                        className={`quiz-provider-option ${selectedProvider === String(provider.provider_id) ? 'selected' : ''}`}
                        aria-pressed={selectedProvider === String(provider.provider_id)}
                        onClick={() => setSelectedProvider(String(provider.provider_id))}
                        disabled={providersLoading}
                    >
                        <img src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`} alt='' loading='lazy' />
                        <strong>{provider.provider_name}</strong>
                    </button>)}
                    {providersLoading && <p className='quiz-loading-note'>Cargando plataformas…</p>}
                </div>}

                {error && <p className='quiz-error' role='alert'>{error}</p>}
                <footer className='quiz-actions'>
                    <button type='button' className='quiz-back-button' onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || loading}>Volver</button>
                    {step < STEP_COUNT - 1
                        ? <button type='button' className='btn' onClick={() => setStep((current) => current + 1)} disabled={loading || (step === 0 && genresLoading)}>Continuar</button>
                        : <button type='button' className='btn' onClick={findMovies} disabled={loading || providersLoading}>{loading ? 'Buscando…' : 'Encontrar películas'}</button>}
                </footer>
            </div> : <div className='quiz-results'>
                <div className='quiz-results-heading'>
                    <div>
                        <span className='quiz-eyebrow'>TU SELECCIÓN</span>
                        <h2>Estas podrían gustarte</h2>
                        <p>{[
                            selectedGenreNames.length ? selectedGenreNames.join(' · ') : 'Cualquier género',
                            profile === 'known' ? 'Conocidas' : 'De nicho',
                            period === 'last_year' ? 'Último año' : 'Cualquier época',
                            selectedPlatform?.provider_name
                        ].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className='quiz-results-actions'>
                        <button type='button' className='quiz-back-button' onClick={() => { setShowResults(false); setStep(0); }}>Cambiar respuestas</button>
                        <button type='button' className='btn' onClick={() => setQuizMovies(pickFour(candidates, quizMovies.map((movie) => movie.id)))} disabled={candidates.length <= 4}>Otra selección</button>
                    </div>
                </div>
                {quizMovies.length > 0
                    ? <div className='movie-grid movie-quiz-results-grid'>
                        {quizMovies.map((movie) => <Card
                            key={movie.id}
                            movie={{ ...movie, favorite: favoriteIds.has(movie.id) }}
                            moviesResults={quizMovies}
                            setMoviesResults={setQuizMovies}
                        />)}
                    </div>
                    : <div className='quiz-empty-state'>
                        <p>No encontramos coincidencias con esas respuestas.</p>
                        <button type='button' className='btn' onClick={() => { setShowResults(false); setStep(0); }}>Probar otras respuestas</button>
                    </div>}
            </div>}
        </section>
    );
};

export default MovieQuiz;
