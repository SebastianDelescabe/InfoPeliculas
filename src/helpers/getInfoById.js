
import { tmdbGet } from './tmdb';

/** Carga una ficha completa y busca tráileres en inglés si faltan en español. */
export const getInfoById = async (movieID) => {
    const response = await tmdbGet(`/movie/${movieID}`, {
        language: 'es-AR',
        append_to_response: 'videos,recommendations,release_dates'
    });
    const data = response.data
    const hasTrailer = data.videos?.results?.some((video) =>
        video.site === 'YouTube' && ['Trailer', 'Teaser'].includes(video.type) && video.key
    );

    if (!hasTrailer) {
        try {
            const fallbackVideos = await tmdbGet(`/movie/${movieID}/videos`, { language: 'en-US' });
            data.videos = fallbackVideos.data;
        } catch (error) {
            data.videos = { results: [] };
        }
    }

    return data
}
