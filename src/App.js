
import './App.css';
import React, { Component, useState } from 'react';
import { openweatherid, pexelsid } from './cred';


class App extends Component {

  constructor() {
    super()
  this.state={
    weatherdata: {},
    city: "london"
  }

}


  
  
  AppStatehandler(newcity) {
    var  url="https://api.openweathermap.org/data/2.5/weather?q="+newcity+"&appid="+openweatherid;
   fetch(url)
    .then((response)=>  response.json() )
    .then((data) => {
      var obj=this.state;
      obj.city=newcity;
      obj.weatherdata=data;
      this.setState(obj);

    });
    
  }
  
  
  render() {
    
    
    
    return ( 
    <div>
    <h1> Welcome. Enter your city name </h1>
    <SearchBox cityname={this.state.city} AppStatehandler={this.AppStatehandler.bind(this)}/>
    <h3>The weather in your area is described below</h3>
    <WeatherWidget weatherdata={this.state.weatherdata}/>
    </div>
    );


  }



}

class  SearchBox extends Component {

  constructor(props) {
    super(props)
    this.state={
      searchtext: props.cityname
    }

    this.changeeffect=this.changeeffect.bind(this);
    this.updatesearchtext=this.updatesearchtext.bind(this);
  }
  
   changeeffect(e) {

    this.props.AppStatehandler(this.state.searchtext);
   }


   updatesearchtext(e) {
    this.setState({searchtext: e.target.value});
   }

  render() {

  return (
    <div>
    <input type="text" onChange={this.updatesearchtext}></input>
    <button style={{height:"30px", width:"150px"}} onClick={this.changeeffect}>Check weather</button>
    </div>
  )
}
}

function WeatherWidget(props) {

  const [weatherobjwrapper,setweatherobjwrapper]= useState({weatherobj:{},prevobj: {}});



  if(Object.keys(props.weatherdata).length===0) {return}


  function setImages(obj){
    var keysarr=Object.keys(obj);
    for(var key in keysarr){
      var keyword=obj[keysarr[key]].text;
      fetch("https://api.pexels.com/v1/search?query="+keyword+"&per_page=1",{headers: {Authorization: pexelsid}})
      .then(res=> res.json())
      .then(data => {
        obj[keysarr[key]].imageurl=data.photos[0].url;
        setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj})
      });
    }    
  }



  function showweatherdata(e){

    if( Object.keys(weatherobjwrapper.weatherobj).length!==0 &&  props.weatherdata.name===weatherobjwrapper.weatherobj.City['text']){
    
      if(!e) {return;}
    }


    var obj={
      City: {imageurl:"", text: props.weatherdata.name},
      Type: {imageurl:"",text: props.weatherdata.weather[0].main},
      Temperature: {imageurl:"",text: (props.weatherdata.main.temp-273.15).toFixed(2)}
    }
      
       setImages(obj);
       setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj});
    
  }

  function showwinddata(e) {
    var obj={
      City: props.weatherdata.name,
      WindSpeed: props.weatherdata.wind.speed,
      Degree: props.weatherdata.wind.deg,
    }

    setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj});
  }

  showweatherdata();
  return (
    //<p> { JSON.stringify(props.weatherdata) } </p>
    <div>
    <p id="weather-options" onClick={showweatherdata}>Weather</p>
    <p id="weather-options" onClick={showwinddata}>Wind</p>
    <br></br>
    <DisplayData weatherobjwrapper={weatherobjwrapper} />
    </div>

  )


  function DisplayData(props) {

    

    //props.weatherobjwrapper
    return(
      <div>
        {Object.keys(props.weatherobjwrapper.weatherobj).map(function(key){
          return (
            <div>
              <img src={props.weatherobjwrapper.weatherobj[key].imageurl} alt="Good"/>
              <p> {key} = {props.weatherobjwrapper.weatherobj[key]}</p>
            </div>
          )
        })}
      </div>
    )
  }



}


export default App;
