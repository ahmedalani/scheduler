// importing libraries
import React, { useState, useEffect } from "react";
import axios from 'axios';

// importing components
import "components/Application.scss";
import DayList from './DayList';
import Appointment from './Appointment';

// importing helper functions
import { getAppointmentsForDay, getInterview, getInterviewersByDay } from '../helpers/selectors';


export default function Application(props) {
  // state!
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  })

  // when click on a day this function gets called from DayListItem to select day
  const setDay = (day) => setState({ ...state, day });

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
  // get interviewers for day
  const interviewers = getInterviewersByDay(state, state.day)
  // searching for specific day's appointments
  const appointments = getAppointmentsForDay(state, state.day)
  // rendering Appointment components
  const appointmentItems = appointments.map(apt => {
    const interview = getInterview(state, apt.interview);
    return <Appointment
      key={apt.id}
      id={apt.id}
      time={apt.time}
      interview={interview}
      interviewers={interviewers}
      bookInterview={bookInterview}
      cancelInterview={cancelInterview}
    />
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentItems}
        {/* the bellow isn't working properly, CSS issue probably, it shoul only show header with time (5pm) but int's showing the add "+" as if the spot is available!*/}
        {/* <Appointment id="last" time="5pm" /> */}
      </section>
    </main>
  );
}
