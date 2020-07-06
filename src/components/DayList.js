import React from 'react';

import DayListItem from './DayListItem';

export default function DayList(props) {
  let dayItem = props.days.map(({ id, name, spots }) => {
    return <DayListItem
      key={id} name={name}
      spots={spots}
      selected={name === props.day}
      setDay={props.setDay}
    />
  })
  return <ul>{dayItem}</ul>
}