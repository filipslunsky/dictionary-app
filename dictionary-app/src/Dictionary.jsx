import { useState, useEffect } from 'react';
import searchIcon from './assets/images/icon-search.svg';
import playIcon from './assets/images/icon-play.svg';

const Dictionary = () => {
    const [search, setSearch] = useState('');
    const [select, setSelect] = useState('serif');
    // const [night, setNight] = useState(false);
    const [data, setData] = useState('');

    const getData = async () => {
        const baseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        
        if (search.length === 0) return;
        
        const res = await fetch(`${baseUrl}${search}`);
        const data = await res.json();
        console.log(data);
        setData(data);
    };

    // useEffect(() => {
    //     console.log(search);
    //     console.log(select);
    // }, [search, select])

    return (
        <>
            <select onChange={(e) => setSelect(e.target.value)} name="font">
                <option value="serif">Serif</option>
                <option value="sansSerif">Sans Serif</option>
                <option value="mono">Mono</option>
            </select>
            <input type="text" placeholder='search' onChange={(e) => {setSearch(e.target.value)}} />
            <button onClick={getData}><img src={searchIcon} alt="search" /></button>
            {
                data
                ?
                    !data.message
                    ? 
                        data.map((item, index) => {
                            return (
                            <div key={index}>
                                <h2>{item.word}</h2>
                                {item.phonetics
                                    .filter(phonetic => phonetic.audio)
                                    .map((phonetic, idx) => (
                                        <div key={idx}>
                                            <p>{phonetic.text}</p>
                                            <audio controls>
                                                <source src={phonetic.audio} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    ))}
                                    {item.meanings.map((meaning, indx) => {
                                        return (
                                            <div key={indx}>
                                                <p>{meaning.partOfSpeech}</p>
                                                <h3>Meaning:</h3>
                                                <ul>
                                                    {meaning.definitions.map((definition, ind) => {
                                                        return (
                                                            <li key={ind}>
                                                                <p>{definition.definition}</p>
                                                                {definition.example ? <p>{definition.example}</p> : ''}
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                                {meaning.antonyms.length > 0 ? <p>Antonyms: {meaning.antonyms.join(', ')}</p> : ''}
                                                {meaning.synonyms.length > 0 ? <p>Synonyms: {meaning.synonyms.join(', ')}</p> : ''}
                                            </div>
                                        )
                                    })}
                                <p>
                                    Source:{' '}  
                                    {item.sourceUrls.map((url, idx) => (
                                        <span key={idx}>
                                            <a href={url} target="_blank">{url}</a>
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
        </>
    );
}
 
export default Dictionary;