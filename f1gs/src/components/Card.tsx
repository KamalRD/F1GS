import React from 'react'

import Image from 'next/image';

type CardProps = {
    name: string;
    title: string;
    image: string;
}

function Card({name, title, image}: CardProps) {
  return (
    <div>
        <div className='flex flex-col justify-start items-center'>
            <Image
                src={image}
                height={100}
                width={100}
                alt={`${name} - ${title}`}
            />

            <h1>{name}</h1>
            <h3>{title}</h3>
        </div>
    </div>
  )
}

export default Card