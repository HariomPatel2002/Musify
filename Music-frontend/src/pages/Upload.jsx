import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUploadSongMutation } from '../api/songsApi';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Upload as UploadIcon, Music, Image } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  genre: z.string().optional(),
  duration: z.coerce.number().min(0).optional(),
  lyrics: z.string().optional(),
});

export default function Upload() {
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [serverError, setServerError] = useState('');
  const [uploadSong, { isLoading }] = useUploadSongMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!audioFile) return;
    setServerError('');

    const formData = new FormData();
    formData.append('audio', audioFile);
    if (coverFile) formData.append('cover', coverFile);
    formData.append('title', data.title);
    if (data.genre) formData.append('genre', data.genre);
    if (data.duration) formData.append('duration', data.duration);
    if (data.lyrics) formData.append('lyrics', data.lyrics);

    try {
      await uploadSong(formData).unwrap();
      navigate('/');
    } catch (err) {
      setServerError(err?.data?.message || 'Upload failed. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#2A2A2A] rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6">Upload Song</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div
            onClick={() => document.getElementById('audio-input').click()}
            className="border-2 border-dashed border-gray-300 dark:border-[#2A2A2A] rounded-xl p-8 text-center cursor-pointer hover:border-violet-500 transition-colors"
          >
            <input
              id="audio-input"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files[0])}
              className="hidden"
            />
            <Music className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            {audioFile ? (
              <p className="text-sm font-medium text-violet-500">{audioFile.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium">Drag audio file here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">MP3, WAV, FLAC, AAC</p>
              </>
            )}
          </div>

          <div
            onClick={() => document.getElementById('cover-input').click()}
            className="border-2 border-dashed border-gray-300 dark:border-[#2A2A2A] rounded-xl p-6 text-center cursor-pointer hover:border-violet-500 transition-colors"
          >
            <input
              id="cover-input"
              type="file"
              accept="image/*"
              onChange={(e) => setCoverFile(e.target.files[0])}
              className="hidden"
            />
            <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            {coverFile ? (
              <p className="text-sm font-medium text-violet-500">{coverFile.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium">Upload cover art</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP</p>
              </>
            )}
          </div>

          <Input label="Song Title" {...register('title')} error={errors.title?.message} />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Genre</label>
              <select
                {...register('genre')}
                className="w-full rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="R&B">R&B</option>
                <option value="Dance">Dance</option>
                <option value="Alternative">Alternative</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Electronic">Electronic</option>
              </select>
            </div>
            <Input label="Duration (seconds)" type="number" {...register('duration')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-300">Lyrics (optional)</label>
            <textarea
              {...register('lyrics')}
              rows={4}
              className="w-full rounded-xl border border-gray-200 dark:border-[#2A2A2A] bg-white dark:bg-[#242424] px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="Add lyrics..."
            />
          </div>

          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          <Button type="submit" disabled={isLoading || !audioFile} className="w-full py-3">
            {isLoading ? 'Uploading...' : 'Upload Song'}
          </Button>
        </form>
      </div>
    </div>
  );
}
