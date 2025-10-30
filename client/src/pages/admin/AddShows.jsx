import React, { useEffect } from 'react'
import { useState } from 'react';
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import Title from '../../components/admin/Title';
import { KConverter } from '../../lib/KConverter';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

function AddShows() {

  const { axios, getToken, user, image_base_url } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [dateTimeselection, setDateTimeselection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);



  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get(`/api/show/now_playing`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
        timeout: 10000,
      })

      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.log("error fetching movies", error)
      toast.error("Failed to fetch now playing movies", {icon: '⚠️' });
    }
  };


  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeselection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    })
  };

  const handleRemovedTime = (date, time) => {
    setDateTimeselection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [date]: filteredTimes };
    })
  }

  const handleSubmit = async () => {
    try {
      setAddingShow(true);

      if (!selectedMovies || Object.keys(dateTimeselection).length === 0 || !showPrice) {
        return toast('missing required fields', { icon: '⚠️' });
      }
      const showsInput = Object.entries(dateTimeselection).map(([date, time]) => (
        { date, time }
      ));

      const payload = {
        movieId: selectedMovies,
        showsInput,
        showPrice: Number(showPrice),
      }

      const { data } = await axios.post('/api/show/add_show', payload, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        toast.success("Show added successfully");
        setSelectedMovies(null);
        setDateTimeselection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding show:", error)
      toast.error("An error occurred. Please try again.");
    }
    setAddingShow(false);
  }

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user])



  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
      <div className='overflow-x-auto pb-4'>
        <div className='gorup flex flex-wrap gap-4 mt-4 w-max'>
          {nowPlayingMovies.map((movie, index) => (
            <div key={index} className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
              onClick={() => setSelectedMovies(movie.id)}>
              <div className='relative rounded-lg overflow-hidden'>
                <img src={image_base_url + movie.poster_path} alt="" className='w-full object-cover brightness-90' />
                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                  <p className='flex items-center gap-1 text-gray-400'>
                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className='text-gray-300'>
                    {KConverter(movie.vote_count)} Votes
                  </p>

                </div>
              </div>
              {selectedMovies === movie.id && (
                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                  <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                </div>
              )}
              <p className='font-medium truncate'>{movie.title}</p>
              <p className='text-gray-400 text-sm'>{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* show price input */}

      <div className='mt-8'>
        <label className='block text-sm font-medium mb-2'>Show Price</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-lg'>
          <p className='text-gray-400 text-sm'>{currency}</p>
          <input min={0} type="number" value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)} placeholder='"Enter Show Price'
            className='outline-none' />
        </div>
      </div>
      {/* Date & Time Selection */}
      <div className='mt-6'>
        <label className='block text-sm font-medium mb-2'>Select Date & Time</label>
        <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-lg'>
          <input min={0} type="datetime-local" value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className='outline-none' />
          <button className='bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary cursor-pointer'
            onClick={handleDateTimeAdd}>
            Add Time
          </button>
        </div>
      </div>

      {/* Display Selected Times */}
      {Object.keys(dateTimeselection).length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-2'>Selected Date-Time</h2>
          <ul className='space-y-3'></ul>
          {Object.entries(dateTimeselection).map(([date, times]) => (
            <li key={date}>
              <div className='font-medium'>{date}</div>
              <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                {times.map((time) => (
                  <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
                    <span>{time}</span>
                    <DeleteIcon onClick={() => handleRemovedTime(date, time)} width={15} className='ml-2
                    text-red-500 hover:text-red-700 cursor-pointer'/>
                  </div>
                ))}

              </div>
            </li>
          ))}

        </div>
      )}

      <button className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'
        onClick={handleSubmit} disabled={addingShow}>
        Add Show
      </button>

    </>
  ) : <Loading />
}

export default AddShows
