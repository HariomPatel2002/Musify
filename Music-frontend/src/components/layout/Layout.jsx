import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Player from '../player/Player';
import QueuePanel from '../player/QueuePanel';
import LyricsPanel from '../lyrics/LyricsPanel';
import Equalizer from '../player/Equalizer';
import { useSelector } from 'react-redux';

export default function Layout() {
  const { showQueue, showLyrics, showEqualizer } = useSelector((state) => state.player);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0F0F0F] text-gray-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto px-6 py-6 pb-28">
            <Outlet />
          </main>
          {showQueue && <QueuePanel />}
          {showLyrics && <LyricsPanel />}
          {showEqualizer && <Equalizer />}
        </div>
        <Player />
      </div>
    </div>
  );
}
