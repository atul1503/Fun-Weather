
import './App.css';
import nothingfound from './nothingfound.jpg'
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
    <h1> Welcome. </h1>
    <p>Explore weather of the world</p>
    <SearchBox cityname={this.state.city} AppStatehandler={this.AppStatehandler.bind(this)}/>
    <h3>The weather in your area is described below</h3>
    <WeatherWidget   weatherdata={this.state.weatherdata}/>
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
    <div id="flex-box-container">
    <input id="flex-box-item"  style={{type: "text"}} onChange={this.updatesearchtext}></input>
    <button id="flex-box-item" style={{height:"30px",width: "200px"}} onClick={this.changeeffect}>Check weather</button>
    </div>
  )
}
}

function WeatherWidget(props) {

  const [weatherobjwrapper,setweatherobjwrapper]= useState({weatherobj:{},prevobj: {}});

  if( Object.keys(props.weatherdata).length===0 ) return(<p>Sorry. City or location not found.</p>);
  if( props.weatherdata.cod==='404' ) return(<p>Sorry. City or location not found.</p>);
 


  if(Object.keys(props.weatherdata).length===0) {return}



  function setImages(obj,oldcity){
    Object.keys(obj).forEach(function(key,index){
      if(oldcity===obj.City.text && key===oldcity){return}
      var keyword=obj[key].text;
      if(key==="Temperature") {keyword=key}
      fetch("https://api.pexels.com/v1/search?query="+keyword+"&per_page=1",{headers: {Authorization: pexelsid}})
      .then(res=> res.json())
      .then(data => {
        if(data.photos.length>0)  obj[key].imageurl=data.photos[0].src.original;
        setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj})
      });
     });   
  }



  function showweatherdata(e){

    
    if( Object.keys(weatherobjwrapper.weatherobj).length===0){}
    else if(e){}
    else if(props.weatherdata.name!==weatherobjwrapper.weatherobj.City.text){}
    else{ return; }


    var obj={
      City: {imageurl:"", text: props.weatherdata.name},
      Type: {imageurl:"",text: props.weatherdata.weather[0].main},
      Temperature: {imageurl:"",text: (props.weatherdata.main.temp-273.15).toFixed(2)+" °C"}
    }
    var isAnyImageLoaded=false;
      Object.keys(obj).forEach(function(key,i){
        if(obj[key].imageurl!=="") isAnyImageLoaded=true;
      })
      if(!isAnyImageLoaded) setImages(obj);
       setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj});
  }



  function showwinddata(e) {
    var obj={
      City: { imageurl: "",text: props.weatherdata.name},
      WindSpeed: {imageurl: "",text: props.weatherdata.wind.speed+"m/s"},
      Degree: { imageurl: "",text: props.weatherdata.wind.deg+"°"},
    }

    var isAnyImageLoaded=false;
      Object.keys(obj).forEach(function(key,i){
        if(obj[key].imageurl!=="") isAnyImageLoaded=true;
      })
      if(!isAnyImageLoaded) setImages(obj,weatherobjwrapper.weatherobj.City.text);
    setweatherobjwrapper({weatherobj: obj,prevobj: weatherobjwrapper.weatherobj});
  }

  showweatherdata();
  return (
    //<p> { JSON.stringify(props.weatherdata) } </p>
    <div>
      <div id="flex-box-container">
    <p id="weather-options" onClick={showweatherdata}>Weather</p>
    <p id="weather-options" onClick={showwinddata}>Wind</p>
    </div>
    <br></br>
    <DisplayData  weatherobjwrapper={weatherobjwrapper} />
    </div>

  )

  
  function Conditionalimagerender(props){
    if(props.obj[props.bkey].imageurl==="")  return(<img src={nothingfound}  height="300" alt="Nothing found" />); 
    return (<img src={props.obj[props.bkey].imageurl}  height="300" alt="Good"/>);
  }   

  function DisplayData(props) {

     
    
    //props.weatherobjwrapper
    return(
      <div id="flex-box-container">
        {Object.keys(props.weatherobjwrapper.weatherobj).map(function(key){
          return (
            <div id="flex-box-item">
              <Conditionalimagerender bkey={key} obj={props.weatherobjwrapper.weatherobj}/>
              
              <p> {props.weatherobjwrapper.weatherobj[key].text}</p>
            </div>
          )
        })}
      </div>
    )
  }



}






export default App;
