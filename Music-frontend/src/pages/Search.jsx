import { useState, useRef, useEffect } from 'react';
import { useSearchSongsQuery } from '../api/songsApi';
import { useSearchItunesQuery } from '../api/externalApi';
import SongCard from '../components/cards/SongCard';
import Spinner from '../components/ui/Spinner';
import { Search as SearchIcon, Music, User, Globe } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { playSong, setQueue } from '../features/player/playerSlice';

const genres = ['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Dance', 'Alternative', 'Hindi', 'Punjabi', 'Tamil', 'Gujarati'];

export default function Search() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [artistName, setArtistName] = useState('');
  const [activeGenre, setActiveGenre] = useState('');
  const [searchTab, setSearchTab] = useState('library');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const hasFilter = query || activeGenre || artistName;

  const { data: libraryData, isLoading: libraryLoading } = useSearchSongsQuery(
    { q: query, genre: activeGenre, artistName, page: 1, limit: 20 },
    { skip: !hasFilter || searchTab !== 'library' }
  );

  const { data: itunesData, isLoading: itunesLoading } = useSearchItunesQuery(
    { q: query, type: 'song' },
    { skip: !query || searchTab !== 'itunes' }
  );

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };
  const handleGenreClick = (genre) => { setActiveGenre(activeGenre === genre ? '' : genre); setSubmitted(true); };

  const handlePlayExternal = (song) => {
    dispatch(playSong({
      _id: song.id,
      title: song.title,
      artist: { username: song.artist },
      audioUrl: song.audioUrl,
      coverUrl: song.coverUrl,
      duration: song.duration,
    }));
  };

  const results = searchTab === 'library' ? libraryData?.data : itunesData?.data;
  const isLoading = searchTab === 'library' ? libraryLoading : itunesLoading;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs by title..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#2A2A2A] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
        <div className="relative max-w-xl">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" value={artistName} onChange={(e) => setArtistName(e.target.value)}
            placeholder="Search by artist name..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#242424] border border-gray-200 dark:border-[#2A2A2A] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />
        </div>
      </form>

      <div className="flex gap-1 border-b border-gray-200 dark:border-[#2A2A2A]">
        <button onClick={() => setSearchTab('library')} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${searchTab === 'library' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
          My Library
        </button>
        <button onClick={() => setSearchTab('itunes')} className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${searchTab === 'itunes' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
          <Globe className="w-3.5 h-3.5" /> iTunes Store
        </button>
      </div>

      {searchTab === 'library' && (
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button key={genre} onClick={() => handleGenreClick(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeGenre === genre ? 'bg-violet-500 text-white' : 'bg-gray-100 dark:bg-[#242424] text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-[#2A2A2A]'}`}
            >{genre}</button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : results?.length > 0 ? (
        <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
          {results.map((song) => (
            searchTab === 'itunes' ? (
              <div key={song.id} onClick={() => handlePlayExternal(song)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#242424] cursor-pointer group transition-all"
              >
                <img src={song.coverUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                </div>
                <span className="text-[10px] bg-violet-500/10 text-violet-500 px-2 py-0.5 rounded-full">30s preview</span>
              </div>
            ) : (
              <SongCard key={song._id} song={song} queue={results} />
            )
          ))}
        </div>
      ) : submitted || hasFilter ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <Music className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">No results found</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <SearchIcon className="w-12 h-12 mb-3" />
          <p className="text-lg font-medium">Search for songs</p>
          <p className="text-sm">Find music by title, artist, or genre</p>
        </div>
      )}
    </div>
  );
}
