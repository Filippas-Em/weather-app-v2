'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import TempIcon from '../../../public/temp1.png'
import PressureIcon from '../../../public/pressure1.png'
import RainPerc from '../../../public/rainPerc.png'
import WindIcon from '../../../public/wind1.png'

export default function PrimaryCardInfo({data}) {
 
    return (
        <div className="primary-card-info">
            <div className="country-date">
                <h1>Athens, Gr</h1>
                <p>Today, 14/2/2025</p>
            </div>
            <div className='temp-info'>
                <h1>7</h1>
                <Image
                    src={TempIcon}
                    alt="Search Icon"
                    width={52}
                    height={52}
                /> 
                
            </div>
            <div className='weather-info'>

                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={TempIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Rain Percentage</p>
                        <p>60%</p>
                    </div>
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={RainPerc}
                            alt="Search Icon"
                            width={22}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Wind</p>
                        <p>2 Bf</p>
                    </div>
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={WindIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Wind</p>
                        <p>4 Km/h</p>
                    </div>
                    
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={PressureIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Pressure</p>
                        <p>1022 hPa</p>
                    </div>
                </div>
                
            </div>

        </div>
    );
}

