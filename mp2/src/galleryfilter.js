import { useHistory, Link } from 'react-router-dom';

const GalleryFilter = ({ searchQuery, filteredGallery }) => {
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
                <input type="radio" value="All" name="filtergallery" /><span id="filt">All Types </span>
                <input type="radio" value="Bug" name="filtergallery" /><span id="filt">Bug </span>
                <input type="radio" value="Dragon" name="filtergallery" /><span id="filt">Dragon </span>
                <input type="radio" value="Electric" name="filtergallery" /><span id="filt">Electric </span>
                <input type="radio" value="Fighting" name="filtergallery" /><span id="filt">Fighting </span>
                <input type="radio" value="Fire" name="filtergallery" /><span id="filt">Fire </span>
                <input type="radio" value="Flying" name="filtergallery" /><span id="filt">Flying </span>
                <input type="radio" value="Ghost" name="filtergallery" /><span id="filt">Ghost </span>
                <input type="radio" value="Grass" name="filtergallery" /><span id="filt">Grass </span>
                <input type="radio" value="Ground" name="filtergallery" /><span id="filt">Ground </span>
                <input type="radio" value="Ice" name="filtergallery" /><span id="filt">Ice </span>
                <input type="radio" value="Normal" name="filtergallery" /><span id="filt">Normal </span>
                <input type="radio" value="Poison" name="filtergallery" /><span id="filt">Poison </span>
                <input type="radio" value="Psychic" name="filtergallery" /><span id="filt">Psychic </span>
                <input type="radio" value="Rock" name="filtergallery" /><span id="filt">Rock </span>
                <input type="radio" value="Water" name="filtergallery" /><span id="filt">Water </span>

                <ul id="results">
                    {filteredGallery.map((pokemon) => (
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

export default GalleryFilter;