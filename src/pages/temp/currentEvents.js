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
    const [content, setContent] = useState('');

    let date = new Date(8.64e15).toString();
    console.log(date)

    useEffect(() => {
      
      window.handleResponse = (response) => {

        let data =  response.parse.text['*']

        const indexOfTodayStart = data.indexOf('<div class="current-events-content description">');
        const indexOfTodayEnd = data.indexOf('</div>', indexOfTodayStart);
        // console.log(indexOfTodayStart, indexOfTodayEnd)
        setTodayContent(data.slice(indexOfTodayStart, indexOfTodayEnd));

        const indexOfYesterdayStart = data.indexOf('<div class="current-events-content description">', indexOfTodayEnd);
        const indexOfYesterdayEnd = data.indexOf('</div>', indexOfYesterdayStart);
        // console.log(indexOfYesterdayStart, indexOfYesterdayEnd)
        setYesterdayContent(data.slice(indexOfYesterdayStart, indexOfYesterdayEnd));

        data = (`<h2 class='text-xl'>Today</h2>`+data.slice(indexOfTodayStart, indexOfTodayEnd)+`<br></br>`+`<h2 class='text-xl'>Yesterday</h2>`+data.slice(indexOfYesterdayStart, indexOfYesterdayEnd))
        data = data.replaceAll('<b>', '<b class="underline " >')
        data = data.replaceAll('<ul>', '<ul class="mx-8">')

        setContent(data)

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
        <div className='antialiased text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 dark:bg-gradient-to-tr from-slate-900 from-50% via-slate-800 via-80% to-slate-900 to-90%'>
          <div className='py-3 border-b border-slate-900/10 lg:px-8 lg:border-1 dark:border-slate-300/10 mx-4 lg:mx-0 mb-3'>
            <div className='relative flex items-center'>
              <div className='mx-auto text-base font-bold tracking-wider uppercase border-2 p-1 border-slate-400'>Current Events</div> 
            </div>
          </div>

          <div className='mx-auto max-w-7xl'>
            
            <Map
            initialViewState={{
              longitude: 0,
              latitude: 35,
              zoom: 1
            }}
            style={{height: 550}}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            />

            {/* <div className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl mt-3'>
              <h2 className='text-xl'>Today</h2>
              <div dangerouslySetInnerHTML={{__html: todayContent}}></div>
            </div>
            <br></br>
            <div className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl'>
              <h2 className='text-xl'>Yesterday</h2>
              <div dangerouslySetInnerHTML={{__html: yesterdayContent}}></div>
            </div> */}
            <div className='bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400 rounded-xl mt-3'>
              <div dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
          </div>

      </div>
    </> );
}