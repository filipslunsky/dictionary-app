import { useState } from 'react';
import searchIcon from './assets/images/icon-search.svg';
import playIcon from './assets/images/icon-play.svg';
import logo from './assets/images/logo.svg';
import moonIcon from './assets/images/icon-moon.svg';
import './dictionary.css';

const Dictionary = () => {
    const [search, setSearch] = useState('');
    const [select, setSelect] = useState('serif');
    const [night, setNight] = useState(false);
    const [data, setData] = useState('');

    const getData = async () => {
        const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        
        if (search.length === 0) return;
        
        const res = await fetch(`${baseUrl}${search}`);
        const data = await res.json();
        setData(data);
    };

    const handlePlayAudio = (audioUrl) => {
        const audio = new Audio(audioUrl);
        audio.play();
    };

    const handleNightMode = () => {
        setNight(!night);
    };

    return (
        <>
            <div className={`${select} ${night ? 'nightMode' : 'dayMode'}`}>
                <div className='navbar'>
                    <img className='logo' src={logo} alt="logo" />
                    <div className='controls'>
                        <select className='fontSelect' onChange={(e) => setSelect(e.target.value)} name="font">
                            <option value="serif">Serif</option>
                            <option value="sansSerif">Sans Serif</option>
                            <option value="mono">Mono</option>
                        </select>
                        <span className='separator'>|</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={night}
                                onChange={handleNightMode}
                            />
                            <span className="slider"></span>
                        </label>
                        <img className='moon' src={moonIcon} alt="moon" />
                    </div>
                </div>
                <div className='searchContainer'>
                    <input className='searchField' type="text" placeholder='search' onChange={(e) => {setSearch(e.target.value)}} />
                    <button className='searchButton' onClick={getData}><img src={searchIcon} alt="search" /></button>
                </div>
                    {
                        data
                        ?
                            !data.message
                            ? 
                                data.map((item, index) => {
                                    return (
                                    <div key={index}>
                                        <h2 className='wordTitle'>{item.word}</h2>
                                        {item.phonetics
                                            .filter(phonetic => phonetic.audio)
                                            .map((phonetic, idx) => (
                                                <div className='phonetics' key={idx}>
                                                    <p className='phoneticText'>{phonetic.text}</p>
                                                    <img className='phoneticIcon' src={playIcon} alt='play audio' onClick={() => handlePlayAudio(phonetic.audio)} />
                                                </div>
                                            ))}
                                            {item.meanings.map((meaning, indx) => {
                                                return (
                                                    <div key={indx}>
                                                        <div className='typeTitleContainer'>
                                                            <p className='typeTitle'>{meaning.partOfSpeech}</p>
                                                            <hr className='horizontalSeparator' />
                                                        </div>
                                                        <p className='subtitle'>Meaning:</p>
                                                        <ul>
                                                            {meaning.definitions.map((definition, ind) => {
                                                                return (
                                                                    <li className='meaningItem' key={ind}>
                                                                        <p>{definition.definition}</p>
                                                                        {definition.example ? <p>{definition.example}</p> : ''}
                                                                    </li>
                                                                )
                                                            })}
                                                        </ul>
                                                        {meaning.antonyms.length > 0 ? <p className='subtitle'>Antonyms: <span className='synonymAntonym'>{meaning.antonyms.join(', ')}</span></p> : ''}
                                                        {meaning.synonyms.length > 0 ? <p className='subtitle'>Synonyms: <span className='synonymAntonym'>{meaning.synonyms.join(', ')}</span></p> : ''}
                                                    </div>
                                                )
                                            })}
                                        <p  className='source'>
                                            Source:{' '}  
                                            {item.sourceUrls.map((url, idx) => (
                                                <span key={idx}>
                                                    <a className='sourceLink' href={url} target="_blank">{url}</a>
                                                    {idx < item.sourceUrls.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                    )
                                })
                                :
                                <div>
                                    <h2>{data.title}</h2>
                                    <p>{data.message}</p>
                                    <p>{data.resolution}</p>
                                </div>
                        :
                        ''
                    }
            </div>
        </>
    );
}
 
export default Dictionary;