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
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => setState({ ...state, appointments }))
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
    return axios.delete(`/api/appointments/${id}`, { "interview": null })
      .then(res => setState({ ...state, appointments }))
  }

  return { state, setDay, bookInterview, cancelInterview }
}