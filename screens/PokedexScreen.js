import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { pokeapi } from '../api/pokeapi';

const PokedexScreen = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [nextUrl, setNextUrl] = useState('');
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function fetchData() {
      let response = await getAllPokemon(pokeapi);
      setNextUrl(response.next);
      await loadPokemon(response.results);
      setLoading(false);
    }
    fetchData();
  }, []);

  const loadPokemon = async data => {
    let _pokemonData = await Promise.all(
      data.map(async pokemon => {
        let pokemonRecord = await getPokemon(pokemon);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  return (
    <Container>
      {loading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Pokemon
          showsVerticalScrollIndicator={false}
          data={pokemonData.map(item => {
            return item;
          })}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PokemonContainer>
              <PokemonName> {item.name}</PokemonName>
            </PokemonContainer>
          )}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: #343434;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.Text`
  color: white;
`;

const Pokemon = styled.FlatList`
  margin-top: 50px;
`;

const PokemonContainer = styled.TouchableOpacity`
  padding: 10px;
  background-color: #fff;
  margin: 8px;
`;

const PokemonName = styled.Text`
  text-transform: capitalize;
`;

export default PokedexScreen;
