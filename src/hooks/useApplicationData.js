import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  // state!
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  // effect hook to fetch data (days, appts) from api then update the state, depends on [] to stop infinit calls
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers'))
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }))
    })
  }, []);

  // onClick handler for day from DayListItem to select day
  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    const days = [...state.days];
    // reducing the spots only when creating (not when editing) new booking without mutating the state
    if (!state.appointments[id].interview) {
      state.days.forEach((dayObj, i) => {
        if (dayObj.name === state.day) {
          const day = { ...dayObj }
          day.spots--
          days[i] = day
        }
      })
    }
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => setState({ ...state, appointments, days }))
  }
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // increasing the spots after deleting a booking without mutating the state
    const days = [...state.days];
    state.days.forEach((dayObj, i) => {
      if (dayObj.name === state.day) {
        const day = { ...dayObj }
        day.spots++
        days[i] = day
      }
    })
    return axios.delete(`/api/appointments/${id}`, { "interview": null })
      .then(res => setState({ ...state, appointments, days }))
  }

  return { state, setDay, bookInterview, cancelInterview }
}