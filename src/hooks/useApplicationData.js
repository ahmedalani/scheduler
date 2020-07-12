import { useEffect, useReducer } from "react";
import axios from "axios";
const webSocket = new WebSocket("ws://localhost:8001");

export default function useApplicationData() {
  // state!
  const initialState = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  };
  // reducer types
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const UPDATE_INTERVIEW = "UPDATE_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.value };
      case SET_APPLICATION_DATA: {
        const { days, appointments, interviewers } = action.payload;
        return { ...state, days, appointments, interviewers };
      }
      case SET_INTERVIEW: {
        const { appointments, days } = action.payload;
        return { ...state, appointments, days };
      }
      // listen to websocket updates
      case UPDATE_INTERVIEW: {
        const { id, interview } = action.payload;
        const appointment = {
          ...state.appointments[id],
          interview,
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment,
        };
        return { ...state, appointments };
      }
      default:
        // return state
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, initialState);

  // effect hook to fetch data (days, appts) from api then update the state, depends on [] to stop infinit calls
  useEffect(() => {
    Promise.all([
      // 🔥before merging "testing" branch make sure it works with the new "/" added for /api/days
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({
        type: SET_APPLICATION_DATA,
        payload: { days, appointments, interviewers },
      });
    });
    // realtime update appointments after websocket connection established
    webSocket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === SET_INTERVIEW) {
        const { id, interview } = msg;
        // console.log('----', typeof interview, interview)
        dispatch({ type: UPDATE_INTERVIEW, payload: { id, interview } });
      }
    };
  }, []);

  // onClick handler for day from DayListItem to select day
  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

  function bookInterview(id, interview) {
    const days = [...state.days];
    // reducing the spots only when creating (not when editing) new booking without mutating the state
    if (!state.appointments[id].interview) {
      state.days.forEach((dayObj, i) => {
        if (dayObj.name === state.day) {
          const day = { ...dayObj };
          day.spots--;
          days[i] = day;
        }
      });
    }
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((res) =>
        dispatch({ type: SET_INTERVIEW, payload: { appointments, days } })
      );
  }
  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    // increasing the spots after deleting a booking without mutating the state
    const days = [...state.days];
    state.days.forEach((dayObj, i) => {
      if (dayObj.name === state.day) {
        const day = { ...dayObj };
        day.spots++;
        days[i] = day;
      }
    });
    return axios
      .delete(`/api/appointments/${id}`, { interview: null })
      .then((res) =>
        dispatch({ type: SET_INTERVIEW, payload: { appointments, days } })
      );
  }

  return { state, setDay, bookInterview, cancelInterview };
}
