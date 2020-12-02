import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import axios from 'axios';

// import console = require('console');

// import console = require('console');

const PokedexScreen = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonLimit, setPokemonLimit] = useState(0);
  let pokeapi = `https://pokeapi.co/api/v2/pokemon?offset=${pokemonLimit}&limit=20`;
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20`).then(res => {
  //   //   console.log(res.data.results);
  //   //   let arr = [];
  //   //   res.data.results.forEach(pokemon => {
  //   //     axios.get(pokemon.url).then(res => {
  //   //       arr.push(res.data);
  //   //       setPokemonData(pokemonData.concat(arr));
  //   //     });
  //   //   });
  //   // });

  //   fetch(`https://pokeapi.co/api/v2/pokemon?limit=20`)
  //     .then(res => res.json())
  //     .then(data => {
  //       data.results.forEach(poke => {
  //         fetch(poke.url)
  //           .then(res => res.json())
  //           .then(data => {
  //             // console.log(data);
  //             setPokemonData(pokemonData.concat(data));
  //           });
  //       });
  //     });
  // }, []);

  // console.log(pokemonData);

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(pokeapi);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, [pokemonLimit]);

  console.log(pokemonData);
  const getPokemon = ({ url }) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          resolve(data);
        });
    });
  };

  const getAllPokemon = async url => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => {
          resolve(data);
        });
    });
  };

  const loadPokemon = async data => {
    let _pokemonData = await Promise.all(
      data.map(async pokemon => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(pokemonData.concat(_pokemonData));
  };

  const handleLoadMore = () => {
    setPokemonLimit(pokemonLimit + 20);
  };
  console.log(pokeapi);

  return (
    <Container>
      <Pokemon
        showsVerticalScrollIndicator={false}
        data={pokemonData}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <PokemonContainer>
            <PokemonBackground>
              <PokemonImage source={{ uri: item.sprites.front_default }} />
            </PokemonBackground>
            <PokemonName>
              {item.id}. {item.name}
            </PokemonName>
            <Elements>
              {item.types.map((i, index) => {
                return <Element key={index}>{i.type.name}</Element>;
              })}
            </Elements>
          </PokemonContainer>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #343434;
  align-items: center;
`;

const Loading = styled.Text`
  color: white;
`;

const Pokemon = styled.FlatList`
  margin-top: 50px;
  width: 80%;
`;

const PokemonContainer = styled.TouchableOpacity`
  padding: 10px;
  background-color: #343434;
  margin: 4px 1px;
  border-radius: 10px;

  align-items: center;
  elevation: 5;
`;

const PokemonBackground = styled.View`
  background-color: #fff;
  border-radius: 50px;
`;

const PokemonImage = styled.Image`
  height: 96px;
  width: 96px;
`;

const PokemonName = styled.Text`
  text-transform: capitalize;
  color: white;
  margin-top: 8px;
  font-weight: bolder;
`;

const Elements = styled.View`
  flex-direction: row;
  margin-top: 3px;
`;
const Element = styled.Text`
  margin: 0 3px;
  background-color: red;
  padding: 2px 5px;
  border-radius: 8px;
  text-transform: capitalize;
  font-size: 10px;
`;

export default PokedexScreen;
