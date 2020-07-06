import React from 'react';

import classNames from 'classnames';

import './InterviewerListItem.scss';

export default function InterviewerListItem({ avatar, name, selected, setInterviewer }) {
  let interviewerClass = classNames('interviewers__item', {
    'interviewers__item--selected': selected
  })

  return (
    <li className={interviewerClass} onClick={() => setInterviewer(name)}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {name}
    </li>
  );
}