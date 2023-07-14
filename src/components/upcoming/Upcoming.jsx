import React, { useEffect, useState } from 'react'
import { upcoming } from '../../helpers/upcoming'
import Card from '../Card/Card'

const Upcoming = () => {

  const [upcomingData, setUpcomingData] = useState([]);

  useEffect(() => {
    upcoming()
      .then((response) => {
        setUpcomingData(response)
      })
  }, [setUpcomingData])


  return (
    <div className='row'>
      {
        upcomingData && upcomingData.map((movie) => (
          <Card key={movie.id} movie={movie} />
        ))
      }
    </div>
  )
}

export default Upcoming