// importing libraries
import React from "react";

// custom hook to manage state
import useApplicationData from 'hooks/useApplicationData';

// importing components
import "components/Application.scss";
import DayList from './DayList';
import Appointment from './Appointment';

// importing helper functions
import { getAppointmentsForDay, getInterview, getInterviewersByDay } from '../helpers/selectors';

export default function Application(props) {

  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();

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
        {/* <Appointment key="last" time="5pm" /> */}
      </section>
    </main>
  );
}
