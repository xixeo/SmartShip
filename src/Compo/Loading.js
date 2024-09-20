import React from 'react'
import { ClimbingBoxLoader } from 'react-spinners'
export default function Loading() {
    return (
        <div className='flex justify-center items-center h-screen'>
            <ClimbingBoxLoader
                color="#9DEDFF"
                loading
                size={30}
                speedMultiplier={1}
            />
        </div>
    )
}
