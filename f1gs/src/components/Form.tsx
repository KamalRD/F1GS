import React, { useState } from 'react';

export default function Form() {
    const [ checkedButton, setCheckedButton ] = useState<string>("");
    console.log(checkedButton);

  return (
    <div className='flex md:flex-row md:justify-evenly flex-col gap-4 w-[90%] mx-auto'>
        <div className='flex flex-col gap-2'>
            <h2 className='text-md font-semibold'>Name</h2>
            <label
                className='flex flex-col w-[80%]'
            >
                <input 
                    className='border-2 border-solid rounded-md border-[brand-grey] px-1'
                />
                <span className='text-sm'>First Name</span>
            </label>
            <label
                className='flex flex-col w-[80%]'
            >
                <input
                    className='border-2 border-solid rounded-md border-[brand-grey] px-1'
                />
                <span className='text-sm'>Last Name</span>
            </label>
        </div>
        <div className='flex flex-col gap-2'>
            <h2 className='row-start-1 col-span-1 text-md font-semibold'>Contact Information</h2>
            <label
                className='row-start-2 col-span-1 flex flex-col w-[80%]'
            >
                <input 
                    className='border-2 border-solid rounded-md border-[brand-grey] px-1'
                />
                <span className='text-sm'>Email</span>
            </label>
            <>
                <h2 className='row-start-1 col-span-2 text-md font-semibold'>Your Year</h2>
                <div className='flex flex-row justify-start gap-x-4 w-[60%]'>
                    <span className='text-sm flex flex-col'>
                        <input
                            type='radio'
                            checked={checkedButton === "1L"}
                            value={"1L"}
                            id='1L'
                            onClick={e => setCheckedButton((e.target as HTMLInputElement).value)}
                            className={"hidden"}
                        />
                        <label
                            htmlFor='1L'
                            className={`flex items-center flex-col`}
                        >
                            <span className={`w-4 h-4 bg-cover cursor-pointer ${checkedButton === "1L" ? 'bg-selected-img' : 'bg-default-img'}`}></span>
                            <span>1L</span>
                        </label>
                    </span>  
                    <span className='text-sm flex flex-col'>
                        <input
                            type='radio'
                            checked={checkedButton === "2L"}
                            value={"2L"}
                            id='2L'
                            onClick={e => setCheckedButton((e.target as HTMLInputElement).value)}
                            className={"hidden"}
                        />
                        <label
                            htmlFor='2L'
                            className={`flex items-center flex-col`}
                        >
                            <span className={`w-4 h-4 bg-cover cursor-pointer ${checkedButton === "2L" ? 'bg-selected-img' : 'bg-default-img'}`}></span>
                            <span>2L</span>
                        </label>
                    </span>   <span className='text-sm flex flex-col'>
                        <input
                            type='radio'
                            checked={checkedButton === "3L"}
                            value={"3L"}
                            id='3L'
                            onClick={e => setCheckedButton((e.target as HTMLInputElement).value)}
                            className={"hidden"}
                        />
                        <label
                            htmlFor='3L'
                            className={`flex items-center flex-col`}
                        >
                            <span className={`w-4 h-4 bg-cover cursor-pointer ${checkedButton === "3L" ? 'bg-selected-img' : 'bg-default-img'}`}></span>
                            <span>3L</span>
                        </label>
                    </span>  
                </div>
                
                {/* </label> */}
            </>
        </div>
        
            
    </div>
  )
}