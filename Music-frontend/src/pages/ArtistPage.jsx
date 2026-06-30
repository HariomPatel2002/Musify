import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserProfileQuery, useGetUserSongsQuery, useGetUserAlbumsQuery, useFollowUserMutation } from '../api/usersApi';
import SongCard from '../components/cards/SongCard';
import AlbumCard from '../components/cards/AlbumCard';
import Spinner from '../components/ui/Spinner';
import { Music, ArrowLeft, AlertCircle } from 'lucide-react';

export default function ArtistPage() {
  const { id } = useParams();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { data: profileData, isLoading: profileLoading, error: profileError } = useGetUserProfileQuery(id, { skip: !id });
  const { data: songsData, isLoading: songsLoading } = useGetUserSongsQuery({ id, page: 1, limit: 10 }, { skip: !id });
  const { data: albumsData, isLoading: albumsLoading } = useGetUserAlbumsQuery({ id, page: 1, limit: 10 }, { skip: !id });
  const [followUser] = useFollowUserMutation();

  if (profileLoading) return <div className="flex items-center justify-center h-64"><Spinner /></div>;

  if (profileError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
        <p className="text-lg font-medium">User not found</p>
        <p className="text-sm mb-4">{profileError?.data?.message || 'Something went wrong'}</p>
        <Link to="/" className="text-violet-500 hover:text-violet-600 text-sm font-medium flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Go back home
        </Link>
      </div>
    );
  }

  const profile = profileData?.data;
  if (!profile) return <p className="text-gray-500 dark:text-neutral-400">User not found.</p>;

  const isOwnProfile = currentUser?._id === profile._id;

  return (
    <div className="space-y-10">
      <div className="relative">
        <div className="h-48 bg-gradient-to-b from-violet-500/20 to-transparent rounded-2xl" />
        <div className="absolute bottom-0 left-0 px-8 pb-6">
          <div className="flex items-end gap-6">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.username} className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#1A1A1A] shadow-xl" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-violet-500 flex items-center justify-center text-4xl text-white font-bold border-4 border-white dark:border-[#1A1A1A] shadow-xl">
                {profile.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-neutral-400">{profile.role === 'artist' ? 'Artist' : 'User'}</p>
              <h1 className="text-5xl font-bold tracking-tight">{profile.username}</h1>
              <p className="text-gray-500 dark:text-neutral-400 mt-1">
                {profile.songCount || 0} songs · {profile.albumCount || 0} albums · {profile.followerCount || 0} followers
              </p>
              {profile.bio && <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">{profile.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {!isOwnProfile && (
        <button
          onClick={() => followUser(id)}
          className="px-6 py-2.5 rounded-full border border-gray-300 dark:border-neutral-600 text-sm font-semibold hover:scale-105 transition-transform"
        >
          Follow
        </button>
      )}

      {songsLoading ? <Spinner /> : songsData?.data?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Popular Songs</h2>
          <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-xl overflow-hidden">
            {songsData.data.map((song) => (
              <SongCard key={song._id} song={song} queue={songsData.data} />
            ))}
          </div>
        </section>
      )}

      {albumsLoading ? <Spinner /> : albumsData?.data?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albumsData.data.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
