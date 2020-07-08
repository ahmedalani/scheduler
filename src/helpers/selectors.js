export function getAppointmentsForDay(state, day) {
  let results = [];
  // searching for day object in state
  const foundDay = state.days.find(d => d.name === day);
  // if day found then push the day's appointments to results
  if (foundDay) {
    foundDay.appointments.forEach(aptId => {
      results.push(state.appointments[aptId])
    });
  }
  return results;
}

export function getInterview(state, interview) {
  let result = null;
  if (interview) {
    const interviewerId = interview.interviewer
    const theInterviewer = state.interviewers[interviewerId]
    result = { student: interview.student, interviewer: theInterviewer }
  }
  return result;
}