import { useHistory, Link } from 'react-router-dom';

const SortBy = ({ searchQuery, filteredPosts }) => {
    const history = useHistory();
    const onClick = (e) => {
        history.push(`?s=${searchQuery}`);
    };

    return (
        <div>
            <form
                action="/"
                method="get"
                autoComplete="off"
                onClick={onClick}
            >
                <span id="word">Sort By: </span>
                <select name="selectList" id="selectList">
                <option value="Pokedex ID">Pokedex ID</option>
                <option value="Name">Name</option>
                </select>
                
                <br></br>
                <input type="radio" value="1" name="sortorder" /> <span id="butt">Ascending</span>
                <input type="radio" value="-1" name="sortorder" /> <span id="butt">Descending</span>

                <ul id="results">
                    {filteredPosts.map((pokemon) => (
                        <li key={pokemon.species.name}>
                        <h2 id="pokename">{pokemon.species.name.charAt(0).toUpperCase()+pokemon.species.name.slice(1)}</h2>
                        <Link to={"/pokemon-info/"+pokemon.id} id="showinfo"><img src={pokemon.sprites.front_default} alt=''></img></Link>
                        </li>
                    ))}
                </ul>
                
            </form>
        </div>
    );
};

export default SortBy;