import React, { Component } from 'react';
import './MainUI.css';

class MainUI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentTemp : undefined,
            currentConditions : undefined,
            conditionsImageURL : undefined,
            reactionURL : undefined,   
            zipCode : '94945', 
        }

        this.updateWeatherInfo();
      }
      updateWeatherInfo() {
        this.fetchCurrentConditions()
            .then(() => {
                this.fetchBackgroundImage();
                this.fetchReactionImage();
            }) 
            .catch((er) =>{
                console.log(er);
            });
      }
      fetchCurrentConditions(){
        const url = 'http://dataservice.accuweather.com/currentconditions/v1/39671_PC?ACCUWE&apikey=rvSVrxAEhkTPZ8Zzou6hLusbiaZAobB9';
        return fetch(url).then((fresp) => fresp.json())
                   .then( (cwr) => 
                    { 
                      console.log(cwr);
                      if (cwr && cwr[0] && cwr[0].Temperature) {
                        this.setState(
                            {
                              currentTemp : cwr[0].Temperature.Imperial.Value,
                              currentConditions : cwr[0].WeatherText,
                            }
                          );
                      }
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }

      fetchBackgroundImage() {
        const {currentConditions} = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `${currentConditions || 'foggy'} skies`;
        // phrase = 'rain';
        // phrase = 'cloudy';
        // phrase = 'snow';
        // phrase = 'hail';

// todo: use flickr group to search
        const photoDataUrl = `https://api.flickr.com/services/rest/?BACKGROUND&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
                   .then( (flickrSearchResponse) => 
                    { 
                        const photoData = flickrSearchResponse.photos.photo[0];
                        const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                        this.setState({ conditionsImageURL : photoUrl })
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }

      fetchReactionImage() {
        const {currentConditions} = this.state;
        // encodeURI('http://www.here.com/this that')

        let phrase = `${currentConditions || 'foggy'} symbol`;

        const photoDataUrl = `https://api.flickr.com/services/rest/?REACTION&text=${phrase}&method=flickr.photos.search&api_key=c69b8f9f5fee24232d061c0133679430&format=json&nojsoncallback=1`;
        fetch(photoDataUrl).then((fresp) => fresp.json())
                   .then( (flickrSearchResponse) => 
                    { 
                        const photoData = flickrSearchResponse.photos.photo[0];
                        const photoUrl = `https://farm${photoData.farm}.staticflickr.com/${photoData.server}/${photoData.id}_${photoData.secret}.jpg`;
                        this.setState({ reactionURL : photoUrl })
                    })
                    .catch((er) =>{
                        console.log(er);
                    })
      }
      render() {
        const { currentTemp, 
            currentConditions, 
            conditionsImageURL, 
            reactionURL,
            zipCode,
        } = this.state;
        
        return (
            <div className='mainWrapper'>
                
                Zip Code: ({zipCode})
                <input 
                    className='zipCode' 
                    type="text" 
                    name="zip" 
                    value={zipCode}
                    onChange={(ev)=>{
                        this.setState({zipCode: ev.target.value});
                    }} />
                <input className='enterButton' 
                        type="button" 
                        value="Enter" 
                        onClick={(ev)=>{
                            console.log('ouch')
                        }} />
                
                <img className='backgroundImage' src={conditionsImageURL}/>
                <div className='contentArea'>
                    <img alt="" className='reactionImage' src={reactionURL} />


                    <div className='conditionsArea'>
                        <div className='tempurature'>
                            {currentTemp}
                        </div>
                        <div className='condition'>
                            {currentConditions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainUI;