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