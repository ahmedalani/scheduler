import React, { Fragment } from 'react';

import './styles.scss';
import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

import { useVisualMode } from '../../hooks/useVisualMode';

// appointment modes
const EMPTY = 'EMPTY';
const SHOW = 'SHOW';
const CREATE = 'CREATE';
const SAVING = 'SAVING';
const DELETE = 'DELETE';
const CONFIRM = 'CONFIRM';


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
    transition(SAVING)
    const showMode = () => transition(SHOW);
    props.bookInterview(props.id, interview, showMode)
  }
  const onDelete = (confirmed) => {
    if (confirmed === 'confirmed') {
      transition(DELETE)
      const emptyMode = () => transition(EMPTY);
      props.cancelInterview(props.id, emptyMode)
    } else {
      transition(CONFIRM)
    }
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
          onDelete={onDelete}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} onSave={save} />}
      {mode === SAVING && <Status message={'SAVING'} />}
      {mode === DELETE && <Status message={'Deleting'} />}
      {mode === CONFIRM && <Confirm message={'Are you sure?'} onCancel={onCancel} onConfirm={onDelete} />}


    </Fragment>
  )
}
