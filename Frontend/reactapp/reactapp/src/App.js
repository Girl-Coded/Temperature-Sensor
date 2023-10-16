import React, { useState, useEffect, useRef } from "react";
import io from 'socket.io-client';
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts';

/*function to convert to fahrenheit
  */
const toFahrenheit = (celsius) => celsius * 9 / 5 + 32;

function App() {
  const [pauseData, setPauseData] = useState(false); //pause data stream
  const [isCelsius, setIsCelsius] = useState(true); // for toggle button for temp units
  const [lastTemperature, setLastTemperature] = useState(null); //last temp for display
  const [socket, setSocket] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [displayOn, setDisplayOn] = useState(true); //display on or off state
  const [yAxisRange, setYAxisRange] = useState({min: 10, max: 50}); //celsius range
  const [isUnplugged, setIsUnplugged] = useState(false); //states for button functionality messages 
  const [isSwitchOff, setIsSwitchOff] = useState(false);
  const dataPointWidth = 10;
  const [isDataOutdated, setIsDataOutdated] = useState(false); //was supposed to be used to clear last given temp on display
  const chartContainerRef = useRef();


  /*initializes the data stream as a single point
  */
  const [dataStream, setDataStream] = useState([
    { x: 0, y: 0 }
  ]);

  /*converts temperature to fahrenheit
  */
  const series = [{
    name: 'Temperature',
    data: dataStream.map(point => ({
      x: point.x,
      y: isCelsius ? point.y : toFahrenheit(point.y)
    }))
  }];

  /*chart stylistic options
  */
  const options = {
    chart: {
      id: 'realtime',
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Temperature',
      align: 'left'
    },
    markers: {
      size: 0
    },
    xaxis: {
      type: 'numeric',
      tickAmount: 10,
      min: dataStream.length >= 300 ? -(dataStream.length - 1) : -300, //show the latest 300 data points
      max: 0, // always keep the max at 0 to show the most recent data point at the rightmost
      labels: {
        show: true,
        formatter: (value) => `${Math.abs(Math.round(value))} s ago`, //rounds for whole numbers
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },
      
  yaxis: {
    min: yAxisRange.min,
    max: yAxisRange.max,
    labels:{
      formatter: (value) => {
        return Math.round(value); //round to nearest whole number
      }
    }
  }
  };

  /*makes HTTP POST to server to turn display on and off
  */
  const turnOnOffDisplay = async () => {
    try {
      const url = displayOn ? 'http://localhost:3001/turnOffLCD' : 'http://localhost:3001/turnOnLCD';
      
      console.log('Button clicked, sending request to', url); // log the URL
  
      const response = await fetch(url, { method: 'POST' });
  
      if(!response.ok) {
          // Log the status and the response body
          console.error('Server responded with status', response.status);
          console.error('Response body:', await response.text());
      }
  
      console.log('Response received', response); // log the response received
      setDisplayOn(!displayOn); // toggle the displayOn state irrespective of the server response.
      
    } catch (error) {
      console.error("There was an error toggling the display: ", error);
      // Even if there’s an error, try toggling the displayOn state.
      setDisplayOn(!displayOn);
    }
  };
  
  /*toggles temp unit button and converts all data
  */
  const toggleTempUnit = () => {
    const convertedDataStream = dataStream.map(point => ({
      ...point,
      y: isCelsius ? toFahrenheit(point.y) : (point.y - 32) * (5 / 9) // convert each y value to the other unit
    }
    ));
    
    //update the states
    setIsCelsius(!isCelsius); //toggle the unit
    setDataStream(convertedDataStream); //set the converted datastream
    
    //update the y axis range and series
    if (isCelsius) {
      setYAxisRange({ min: 50, max: 122 });
  } else {
      setYAxisRange({ min: 10, max: 50 });
  }

    // update series with the new converted datastream
    ApexCharts.exec('realtime', 'updateOptions', {
      series: [{
          data: convertedDataStream
      }],
      yaxis: {
          min: yAxisRange.min,
          max: yAxisRange.max
      },
      chart: {
          animations: {
              enabled: false
          }
      }
  }, false, true); // forces re-rendering by setting true
};

/*adds new data points to datastream
  */
const appendData = (dataPoint) => {
  setDataStream((prev) => {
    let newArray;
    const newPoint = { x: currentTime, y: dataPoint.y }; // y can be null
    if (prev.length >= 300) {
      newArray = [newPoint, ...prev.slice(0, -1)];
    } else {
      newArray = [newPoint, ...prev];
    }
    return newArray;
  });
  setCurrentTime(currentTime - 1);
};

/*monitors and clears when a data point is outdated and no longer the most recent temp
  */
useEffect(() => {
  if (lastTemperature !== null) {
    setIsDataOutdated(false); //set outdated state to false whenever a new data point is received
    const timeoutId = setTimeout(() => {
      setIsDataOutdated(true); //set state to true if no new data point is received in one second
    }, 1000);
    return () => clearTimeout(timeoutId); //clear timeout if the component unmounts or if a new data point is received before the timeout
  }
}, [lastTemperature]);

/*adjusts width of container based off of how many data points exist
  */
useEffect(() => {
  if (dataStream.length >= 300 && chartContainerRef.current) {
    const newWidth = dataPointWidth * dataStream.length;
    chartContainerRef.current.style.width = `${newWidth}px`;
    ApexCharts.exec('realtime', 'updateOptions', {
      xaxis: {
        min: -(dataStream.length - 1)
      }
    }, false, false);
  }
}, [dataStream.length]);


useEffect(() => {
  ApexCharts.exec('realtime', 'updateOptions', {
      chart: {
          animations: {
              enabled: true
          }
      }
  });
}, [isCelsius]);

  /*establish socket connection
  */
  useEffect(() => {
    const socket = io.connect('http://localhost:3000/', { transports: ['websocket', 'polling', 'flashsocket'] });
    setSocket(socket);
    return () => {
      console.log('Disconnecting socket...');
      if (socket) socket.disconnect();
    };
  }, []);
  
  /*updates data stream whenever it is changed
  */
  useEffect(() => {
    ApexCharts.exec('realtime', 'updateSeries', [{
      data: dataStream
    }]);
  }, [dataStream]);

  /*listens for new data thru socket.io and appends new data if datastream is not set to pause
  */
  useEffect(() => {
    if (socket) {
      socket.on("Echo", data => {
        if (data !== null && !pauseData) {
          setLastTemperature(data);
          appendData({ y: data });
          console.log(data);
        }
      });
    }
  }, [socket, pauseData, currentTime]);

  

  useEffect(() => {
    if (dataStream.length >= 600) {
      ApexCharts.exec('realtime', 'updateOptions', {
        xaxis: {
          min: -(dataStream.length - 1)
        }
      }, false, false);
    }
  }, [dataStream.length]);

  return (
    <div>
      <div style={{
        fontSize: '36px',
        textAlign: 'center',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px'
      }}>
        {isUnplugged ? 'Unplugged sensor' 
        : isSwitchOff ? 'No data available'
        :lastTemperature !== null 
    ? `${isCelsius ? lastTemperature : toFahrenheit(lastTemperature)} ${isCelsius ? '°C' : '°F'}` 
    : 'N/A'}
</div>

<div style={{ overflowX: 'auto', overflowY: 'visible', width: '100%' }}>
        {/* Ref to chart container */}
        <div ref={chartContainerRef} style={{ width: `${dataPointWidth * 300}px` }}>
          <Chart series={series} options={options} height={700} />
        </div>
      </div>
      
      
      <button onClick={() => setPauseData(!pauseData)}>
        {pauseData ? "Start Data Stream" : "Stop Data Stream"}
      </button>
      <button onClick={toggleTempUnit}>
        Switch to {isCelsius ? 'Fahrenheit' : 'Celsius'}
      </button>
      <button onClick={turnOnOffDisplay}>
        Turn {displayOn ? 'Off' : 'On'} Display
      </button>
    </div>
  );
}

export default App;