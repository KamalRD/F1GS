import React from 'react'

import Card from '@/components/Card';

import BoardMembers from '@/data/board.json';

function Board() {
    console.log(BoardMembers);
  return (
    <div>
      {BoardMembers.map((member => (
        <Card key={member.name} name={member.name} title={member.title} image={member.image}></Card>
      )))}
    </div>
  )
}

export default Board