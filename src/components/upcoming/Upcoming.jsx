import React, { useEffect, useState } from 'react'
import { upcoming } from '../../helpers/upcoming'
import Card from '../Card/Card'
import { notify } from '../../helpers/notify';

const Upcoming = () => {

  const [upcomingData, setUpcomingData] = useState([]);

  useEffect(() => {
    upcoming()
      .then((response) => {
        setUpcomingData(response)
      })
      .catch(() => notify('No se pudieron cargar los próximos estrenos', 'error'))
  }, [setUpcomingData])


  return (
    <>
    <h1 className='page-heading'>Muy <span>próximamente</span></h1>
    <div className='movie-grid'>
      {
        upcomingData && upcomingData.map((movie) => (
          <Card key={movie.id} movie={movie} />
        ))
      }
    </div>
    </>
  )
}

export default Upcoming
