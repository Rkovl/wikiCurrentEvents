//TODO
// MapBox
//MapBox Pins
//BootStrap
//Pactials
//CSS
//TSS
//more info

import { useState, useEffect } from 'react';
import Map from 'react-map-gl';
import mapboxgl from '!mapbox-gl';
mapboxgl.accessToken = 'pk.eyJ1Ijoid2lyZWRiYWxsIiwiYSI6ImNsaDB6dGtjajAyc2ozZHE0dXY2OGI3YW8ifQ._DCUbOU1anS9whzVryBXaQ'

export default function currentEvents() {

    const [todayContent, setTodayContent] = useState('');
    const [yesterdayContent, setYesterdayContent] = useState('');

    let date = new Date(8.64e15).toString();
    console.log(date)

    useEffect(() => {
      
      window.handleResponse = (response) => {

        let indexOfTodayStart = response.parse.text['*'].indexOf('<div class="current-events-content description">');
        let indexOfTodayEnd = response.parse.text['*'].indexOf('</div>', indexOfTodayStart);
        console.log(indexOfTodayStart, indexOfTodayEnd)
        setTodayContent(response.parse.text['*'].slice(indexOfTodayStart, indexOfTodayEnd));

        let indexOfYesterdayStart = response.parse.text['*'].indexOf('<div class="current-events-content description">', indexOfTodayEnd);
        let indexOfYesterdayEnd = response.parse.text['*'].indexOf('</div>', indexOfYesterdayStart);
        console.log(indexOfYesterdayStart, indexOfYesterdayEnd)
        setYesterdayContent(response.parse.text['*'].slice(indexOfYesterdayStart, indexOfYesterdayEnd));

      };
  
      const url = "https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events&format=json&callback=handleResponse";
      const script = document.createElement("script");
      script.src = url;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
        // Remove handleResponse function from global scope
        delete window.handleResponse;
      };
    }, []);
  
    return ( <>
        <h2>Today - {date}</h2>
        <div dangerouslySetInnerHTML={{__html: todayContent}}></div>
        <br></br>
        <h2>Yesterday</h2>
        <div dangerouslySetInnerHTML={{__html: yesterdayContent}}></div>
        <Map
      initialViewState={{
        longitude: 0,
        latitude: 35,
        zoom: 1
      }}
      style={{width: 1000, height: 600}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
    </> );
}