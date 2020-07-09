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
const EDIT = 'EDIT';


export default function Appointment(props) {
  const { interview, bookInterview, id, cancelInterview, time, interviewers } = props

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  );
  const onAdd = () => transition(CREATE);
  const onCancel = () => back();
  const onEdit = () => transition(EDIT);

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)
    const showMode = () => transition(SHOW);
    bookInterview(id, interview, showMode)
  }
  const onDelete = (confirmed) => {
    if (confirmed === 'confirmed') {
      transition(DELETE)
      const emptyMode = () => transition(EMPTY);
      cancelInterview(id, emptyMode)
    } else {
      transition(CONFIRM)
    }
  }

  return (
    <Fragment>
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      {mode === CREATE && <Form interviewers={interviewers} onCancel={onCancel} onSave={save} />}
      {mode === EDIT && <Form interviewers={interviewers} onCancel={onCancel} onSave={save} name={interview.student} interviewerId={interview.interviewer.id} />}
      {mode === SAVING && <Status message={'SAVING'} />}
      {mode === DELETE && <Status message={'Deleting'} />}
      {mode === CONFIRM && <Confirm message={'Are you sure?'} onCancel={onCancel} onConfirm={onDelete} />}


    </Fragment>
  )
}
