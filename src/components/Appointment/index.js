import React, { Fragment } from 'react';

import './styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';

import { useVisualMode } from '../../hooks/useVisualMode';

// appointment modes
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  const onAdd = () => transition(CREATE);
  const onCancel = () => back();

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    const showMode = () => transition(SHOW);
    props.bookInterview(props.id, interview, showMode)
  }

  return (
    <Fragment>
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={props.onEdit}
          onDelete={props.onDelete}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save} />}

    </Fragment>
  )
}
