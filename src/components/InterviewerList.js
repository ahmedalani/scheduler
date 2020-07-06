import React from 'react';

import './InterviewerList.scss';
import InterviewerListItem from './InterviewerListItem';

export default function InterviewerList(props) {
  const interviewers = props.interviewers.map(interviewee => {
    return <InterviewerListItem
      key={interviewee.id}
      name={interviewee.name}
      avatar={interviewee.avatar}
      setInterviewer={props.setInterviewer}
    />
  })
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewers}</ul>
    </section>
  );
}