import React, { useState, useEffect } from 'react';
import axios from 'axios';


function getClassByRate(voteNum) {
    if (voteNum >= 8) {
        return "green";
    } else if (voteNum >= 5) {
        return "orange";
    } else {
        return "red";
    }
}


let API_KEY = "a3f41888f2daaab89f43deec96a8bcfa";

// const ApiUrl = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${api-key}&page=1";


const Main = () => {
    const [page, setPage] = useState(1)
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const imagePath = "https://image.tmdb.org/t/p/w1280";
    const searchApiPath = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query="`;
    const popUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
    const upcomingUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`;
    const nowUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
    const topUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`;

    const [formInfo, setFormInfo] = useState("")
    const [active, setActive] = useState("pop")

    const [pop, setPop] = useState("btn first active")
    const [now, setNow] = useState("btn first")
    const [top, setTop] = useState("btn first")
    const [upcoming, setUpcoming] = useState("btn first")

    let movie = {
        title: "",
        overview: "",
        poster_path: "",
        vote_average: "",
        backdrop_path: ""
    }

    const [movies, setMovies] = useState([movie, movie]);

    const getMovies = (url) => {
        axios.get(url)
            .then(res => {
                let APImovies = res.data.results;
                setMovies(APImovies)
                console.log(url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const nextPage = () => {
        let target = page + 1
        setPage(target)
    }

    const prevPage = () => {
        let target = page - 1
        if (target >= 1) {
            setPage(target)
        }

    }



    const refresh = () => {
        switch (active) {
            case 'pop':
                getMovies(popUrl)
                break;
            case 'now':
                getMovies(nowUrl)
                break;
            case 'top':
                getMovies(topUrl)
                break;
            case 'upcoming':
                getMovies(upcomingUrl)
                break;
            default:
                console.log("nah")
        }
    }

    useEffect(() => {
        refresh()
    }, [page])

    useEffect(() => {
        getMovies(apiUrl)
    }, [])

    useEffect(() => {
        let generic = "btn first inactive"
        let activeClass = "btn first active"

        switch (active) {
            case 'pop':
                setPop(activeClass)
                setNow(generic)
                setTop(generic)
                setUpcoming(generic)
                refresh()
                break;
            case 'now':
                setPop(generic)
                setNow(activeClass)
                setTop(generic)
                refresh()
                break;
            case 'top':
                setPop(generic)
                setNow(generic)
                setTop(activeClass)
                setUpcoming(generic)
                refresh()
                break;
            case 'upcoming':
                setPop(generic)
                setNow(generic)
                setTop(generic)
                setUpcoming(activeClass)
                refresh()
                break;
            default:
                console.log("nah")
        }
        setPage(1)
    }, [active])







    const changehandler = (e) => {

        setFormInfo(e.target.value)
    }

    const submitHandler = (e) => {
        e.preventDefault();
        let searchTerm = `${formInfo}"`;
        if (searchTerm !== "") {
            getMovies(searchApiPath + searchTerm);
        }
        setFormInfo("")
    }



    return (
        <div>
            <div className="headd">
                <div className="container headd-wrapper">
                    <h1 className="logo">Movie Night</h1>
                    <form id="form" onSubmit={submitHandler}>
                        <input type="text" id="search" className="search" placeholder="Search" onChange={changehandler} />
                    </form>
                </div>
            </div>

            <div class="container">
                <section class="movie-filter">
                    <button type="button" title="popular" className={pop} onClick={() => setActive("pop")}>
                        Popular
                    </button>
                    <button type="button" title="now-playing" className={now} onClick={() => setActive("now")}>
                        Now Playing
                    </button>
                    <button type="button" title="top-rated" className={top} onClick={() => setActive("top")}>
                        Top Rated
                    </button>
                    <button type="button" title="upcoming" className={upcoming} onClick={() => setActive("upcoming")}>
                        Upcoming
                    </button>
                </section>
                <section class="movie-filter">
                    <button type="button" title="upcoming" className="btn first inactive" onClick={() => prevPage()}>
                        Previous Page
                    </button>
                    <button type="button" title="top-rated" className="btn first inactive" onClick={() => nextPage()}>
                        Next Page
                    </button>
                </section>
                <div id="main">
                    {movies.map((movie) =>
                        <div className="movie">
                            <img src={`${imagePath + movie.poster_path}`} alt={movie.title} />
                            <div class='movie-info'>
                                <h3>{movie.title}</h3>
                                <span class={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
                            </div>
                            <div class='overview'>
                                <h3>Overview</h3>
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </div >
    );
};

export default Main;