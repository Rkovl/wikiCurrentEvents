import { useState, useEffect } from 'react';


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
    </> );
}