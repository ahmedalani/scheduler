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
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={onCancel} />}

    </Fragment>
  )
}
