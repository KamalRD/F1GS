import React from 'react';

import { Carousel } from './general/Carousel';

export default function About() {
    return (
      <div className='md:w-[80%] w-[90%] mx-auto py-4'>
        <h1 className='text-center text-3xl font-bold py-4'>About F1GS</h1>
        <Carousel />
      </div>
    )
}