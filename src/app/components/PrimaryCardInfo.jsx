'use client';
import React, { useState, useEffect, useRef, use } from 'react';


export default function PrimaryCardInfo() {
    let params = new URLSearchParams(window.location.search);

    useEffect(() => {
        params = new URLSearchParams(window.location.search);
        console.log("params:", params.get('location'), params.get('selected'),params.get('units'),params.get('country'));
    }, [params]);


    return (
        <div className="primary-card-info">
            <div className="country-date">
                <h1>Athens, Gr</h1>
                <p>Today, 14/2/2025</p>
            </div>
        </div>
    )
}