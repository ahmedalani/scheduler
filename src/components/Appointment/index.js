import React, { Fragment, useEffect } from "react";

import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import { useVisualMode } from "../../hooks/useVisualMode";

// appointment modes
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const {
    interview,
    bookInterview,
    id,
    cancelInterview,
    time,
    interviewers,
  } = props;

  const { mode, transition, back } = useVisualMode(interview ? SHOW : EMPTY);
  // to handle websocket updates
  useEffect(() => {
    if (interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [interview, transition, mode]);

  const onAdd = () => transition(CREATE);
  const onCancel = () => back();
  const onEdit = () => transition(EDIT);

  function save(name, interviewer) {
    // ask nori what's the best way to handle this error?
    if (interviewer) {
      const interview = {
        student: name,
        interviewer,
      };
      transition(SAVING);
      bookInterview(id, interview)
        .then(() => transition(SHOW))
        .catch(() => transition(ERROR_SAVE));
    } else {
      console.log("zmal!");
    }
  }
  const onDelete = (confirmed) => {
    if (confirmed === "confirmed") {
      transition(DELETE, true);
      cancelInterview(id)
        .then(() => transition(EMPTY))
        .catch((err) => transition(ERROR_DELETE, true));
    } else {
      transition(CONFIRM);
    }
  };

  return (
    <Fragment>
      <article data-testid="appointment">
        <Header time={time} />
        {mode === EMPTY && id !== "last" && <Empty onAdd={onAdd} />}
        {mode === SHOW && interview && (
          <Show
            student={interview.student}
            interviewer={interview.interviewer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
        {mode === CREATE && (
          <Form interviewers={interviewers} onCancel={onCancel} onSave={save} />
        )}
        {mode === EDIT && (
          <Form
            interviewers={interviewers}
            onCancel={onCancel}
            onSave={save}
            name={interview.student}
            interviewerId={interview.interviewer.id}
          />
        )}
        {mode === SAVING && <Status message={"SAVING"} />}
        {mode === DELETE && <Status message={"Deleting"} />}
        {mode === CONFIRM && (
          <Confirm
            message={"Are you sure?"}
            onCancel={onCancel}
            onConfirm={onDelete}
          />
        )}
        {mode === ERROR_SAVE && (
          <Error message={"could not save appointment"} onClose={onCancel} />
        )}
        {mode === ERROR_DELETE && (
          <Error message={"could not delete appointment"} onClose={onCancel} />
        )}
      </article>
    </Fragment>
  );
}
