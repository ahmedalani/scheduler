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

export function getInterviewersByDay(state, day) {
  let results = [];
  // searching for day object in state
  const foundDay = state.days.find(d => d.name === day);
  // if day is found loop over interviewers and push interviewer obj from state with matching id
  if (foundDay) {
    foundDay.interviewers.forEach(interviewerId => {
      results.push(state.interviewers[interviewerId])
    })
  }
  return results;
}
/* the logic bellow to pass the tests but the data in test is different then api so I had to refactor

// if day is found then get the interview obj from appointment, if found then
// get interviewer ID and push matching interviewer obj to results
if (foundDay) {
  foundDay.appointments.forEach(aptId => {
    const { interview } = state.appointments[aptId]
    if (interview) {
      const interviewerId = interview.interviewer
      results.push(state.interviewers[interviewerId])
    }
  });
}

*/