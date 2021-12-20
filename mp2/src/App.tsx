import React from 'react';
import './App.css';
import Search from "./search";
import {
    Switch,
    Route,
    Link,
    useParams,
    useLocation
} from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import SortBy from "./sortby";
import GalleryFilter from "./galleryfilter";

document.body.setAttribute('style', 'background: #282828;');
document.title = "Pokedex - Kyle Chiu's MP2";



const filter_sort = (api_ret, query) => {
  var input_elem = (document.getElementById("selectList") as HTMLInputElement);
  var selection;
  if(input_elem)
    selection = input_elem.value;

  var copy = api_ret;
  copy = copy.filter((pokemon) => {
      const pokename = pokemon.species.name.toLowerCase();
      return pokename.includes(query);
  });

  var sortby = document.getElementsByName("sortorder");
  var compensate = 1;
  for(var i = 0; i < sortby.length; ++i) {
    var elem = (sortby[i] as HTMLInputElement);
    if(elem.checked)
      compensate = parseInt(elem.value, 10);
  }

  if(selection === "Pokedex ID")
    copy.sort(function(p1, p2) {
      if(p1.id < p2.id)
        return -1*compensate;
      if(p1.id > p2.id)
        return 1*compensate;
      return 0;
    });
  else if(selection === "Name")
    copy.sort(function(p1, p2) {
      if(p1.species.name < p2.species.name)
        return -1*compensate;
      if(p1.species.name > p2.species.name)
        return 1*compensate;
      return 0;
    });

  return copy;
};



const filter_gallery = (api_ret, filter) => {
  if(filter === "All" || !filter)
    return api_ret;
  
  filter = filter.toLowerCase();
  var result = [];

  for(var i = 0; i < api_ret.length; ++i) {
    const poketypes = api_ret[i].types;
    for(var j = 0; j < poketypes.length; ++j) {
      if(poketypes[j].type.name.toLowerCase() === filter) {
        result.push(api_ret[i]);
        break;
      }
    }
  }
  return result;
};



const App = () => {
  const { search } = window.location;
  const location = useLocation();
  console.log(location);
  const query = new URLSearchParams(search).get('s');
  const [searchQuery, setSearchQuery] = useState(query || '');
  var [api_ret] = useState([]);
  const filteredPosts = filter_sort(api_ret, searchQuery);



  var filterby = document.getElementsByName("filtergallery");
  var filter;
  for(var i = 0; i < filterby.length; ++i) {
    var elem = (filterby[i] as HTMLInputElement);
    if(elem.checked)
      console.log(elem.value);
    if(elem.checked)
      filter = elem.value;
  }

  const filteredGallery = filter_gallery(api_ret, filter);
  const [is_setup, set_setup] = useState(false);
  


  if(!is_setup) {
    for(i = 1; i <= 151; ++i) {
      axios.get("https://pokeapi.co/api/v2/pokemon/"+i.toString()).then((response) => {
        api_ret.push(response.data);
      });
    }
    set_setup(true);
  }
  
  var detail_id = 0;
  var detail_name = "";
  var detail_img = "";
  var detail_exp = "";
  var detail_height = "";
  var detail_weight = "";



  function update_details(poke_id) {
    if(!api_ret)
      return;
    for(var i = 0; i < api_ret.length; ++i) {
      if(api_ret[i].id.toString() === poke_id.id.toString()) {
        var name = api_ret[i].species.name;
        var real_name = name.charAt(0).toUpperCase().concat(name.slice(1));
        detail_id = api_ret[i].id;
        detail_name = real_name;
        detail_img = api_ret[i].sprites.front_default;
        detail_exp = api_ret[i].base_experience;
        detail_height = api_ret[i].height;
        detail_weight = api_ret[i].weight;
        break;
      }
    }
  }

  function PokeInfo() {
    update_details(useParams());
    return (
      <div>
      <br></br>
      <h2 id="detail_title">{detail_name}</h2>
      <img src={detail_img} alt='' id="info_img"></img>
      <h2 id="detail">Pokedex ID: {detail_id}</h2>
      <h2 id="detail">Base Experience: {detail_exp}</h2>
      <h2 id="detail">Height: {detail_height}</h2>
      <h2 id="detail">Weight: {detail_weight}</h2>
      <br></br>
      <Link id="prevnext" to={"/pokemon-info/"+(detail_id-1 > 0 ? detail_id-1 : 151)}>Previous</Link>
      <Link id="prevnext" to={"/pokemon-info/"+(detail_id+1 <= 151 ? detail_id+1 : 1)}>Next</Link>
      </div>
    );
  }



  return (
          <div className="App">
              <h1 id="title">Pokedex</h1>
              <div id="navbar">
                  <Link to="/" id="c1">Home</Link>
                  <Link to="/search" id="c2">Search</Link>
                  <Link to="/gallery" id="c3">Gallery</Link>
              </div>

              <Switch>

                <Route path="/search">
                  <br></br>
                  <Search
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <SortBy
                    searchQuery={searchQuery}
                    filteredPosts={filteredPosts}
                  />
                </Route>

                <Route path="/gallery">
                  <br></br>
                  <span id="word">Filter By Type: </span>
                  <br></br>
                  <GalleryFilter
                    searchQuery={searchQuery}
                    filteredGallery={filteredGallery}
                  />
                </Route>

                <Route path="/pokemon-info/:id">
                  <PokeInfo />
                </Route>

                <Route path="/">
                  <br></br>
                  <div id="homediv">
                    <h2 id="home_desc">This website allows users to search for a Generation I Pokemon and get information about that Pokemon. Go to 'Search' to search for a Pokemon, or use 'Gallery' to see all Pokemon in the Pokedex.</h2>
                  </div>
                </Route>

              </Switch>
          </div>
  );
};



export default App;