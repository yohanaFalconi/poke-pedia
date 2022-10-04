import {  filterData, sortData, greaterHeight, greaterWeight } from './data.js';

import data from './data/pokemon/pokemon.js';

//console.log(example, data);

const originalData = data.pokemon;
const containerPokemon = document.getElementById("containerPokemon");
const filterList = document.getElementById('filterList');
const sortList = document.getElementById('sortList');
const search = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");

//Esta función crea y muestra los pokémon cards
function loadedData(){
    for(let i=0; i< originalData.length; i++){
        containerPokemon.innerHTML += `
            <div id=${originalData[i]['num']} class="single-card">
                <h3 class="num-card">Nº ${originalData[i]['num']}</h3>
                <span class="tooltip">Click to see information</span>
                <img class="img-card" id="img-card" src="https://www.serebii.net/pokemongo/pokemon/${originalData[i]['num']}.png"></img>
                <div class="name-card"> ${originalData[i]['name']} </div>
            </div> `
    }
}
loadedData();

//Funcionalidad para buscar pokemones por nombre
search.onkeyup= buscar;
btnSearch.onclick = buscar;
function buscar(){
    filterList.selectedIndex = 0;
    sortList.selectedIndex = 0;
    containerPokemon.innerHTML ="";
    let textoMin = search.value.toLowerCase();
    for (let i=0; i<originalData.length; i++){
      let dataMin= originalData[i].name.toLowerCase();
      if(dataMin.indexOf(textoMin) !== -1){
        containerPokemon.innerHTML += `
        <div id=${originalData[i]['num']} class="single-card">
            <h3 class="num-card">Nº ${originalData[i]['num']}</h3>
            <span class="tooltip">Click to see information</span>
            <img class="img-card" id="img-card" src="https://www.serebii.net/pokemongo/pokemon/${originalData[i]['num']}.png"></img>
            <div class="name-card"> ${originalData[i]['name']} </div>
        </div> `
        openModal();
      }
    }
  }

//Esta función crea los pokémon cards según el tipo seleccionado
const selectTypePokemon = (typeSelected) => {
    return filterData(originalData, typeSelected).map((pokemonType)=>{
        containerPokemon.innerHTML += `
            <div id=${pokemonType['num']} class="single-card">
                <h3 class="num-card">Nº ${pokemonType['num']}</h3>
                <span class="tooltip">Click to see information</span>
                <img class="img-card" id="img-card" src="https://www.serebii.net/pokemongo/pokemon/${pokemonType['num']}.png"></img>
                <div class="name-card"> ${pokemonType['name']} </div>
            </div> `
    })
}

//Este evento selecciona un value de 'filterList', luego invoca la función para MOSTRAR los pokémon cards
filterList.addEventListener('change', (e) => {
    sortList.selectedIndex = 0;
    containerPokemon.innerHTML = ` `;
    selectTypePokemon(e.target.value);
    openModal();
});

//interacción del boton ordenar
document.getElementById("sortList").addEventListener("change", (event) => {
    containerPokemon.innerHTML = " ";
    filterList.selectedIndex = 0;

    if (event.target.value === "A-Z" || event.target.value === "Z-A" ) {
        const sortArray = sortData(data.pokemon, "name", event.target.value); 
        
        for (let i = 0; i < originalData.length; i++) {

            containerPokemon.innerHTML += `
                <div id="${sortArray[i].num}" class="single-card">
                    <h3 class="num-card">Nº ${sortArray[i].num}</h3>
                    <span class="tooltip">Click to see information</span>
                    <img class="img-card" src="https://www.serebii.net/pokemongo/pokemon/${sortArray[i].num}.png"></img>
                    <div class="name-card"> ${sortArray[i].name} </div>
                </div> `
        }
    }

    if (event.target.value === "sortNumerically"){
        const sortArrayNum = sortData(data.pokemon, "num", event.target.value);
        for(let i=0; i<originalData.length; i++) {
            containerPokemon.innerHTML += ` 
                <div id="${sortArrayNum[i].num}" class="single-card">
                    <h3 class="num-card">Nº ${sortArrayNum[i].num}</h3>
                    <span class="tooltip">Click to see information</span>
                    <img class="img-card" src="https://www.serebii.net/pokemongo/pokemon/${sortArrayNum[i].num}.png"></img>
                    <div class="name-card"> ${sortArrayNum[i].name} </div>
                </div> `
        }
    }
    openModal();
});

// Esta función escribe en los elementos del doc la información del pokemon seleccionado - MODAL
  function createModal (idCard){
      const infoCard=data.pokemon.find(pokeNum=>pokeNum.num == idCard);
       document.querySelector("#container-info-pokemon").innerHTML = `
            <div id="header-info-pokemon">
                <h3 id="name-info-pokemon">N° ${infoCard.num} ${infoCard.name}</h3>
                <h3 id="close">x</h3>
            </div>
            <div id="small-info-pokemon">
                <div id="imagen-info-pokemon">
                    <img class="imagen-info-pokemon" src="https://www.serebii.net/pokemongo/pokemon/${infoCard.num}.png">
                </div>
                <div id="first-info-pokemon">
                    <p id="height-info-pokemon">Height: ${infoCard.size.height}</p>
                    <p id="weight-info-pokemon">Weight: ${infoCard.size.weight}</p>
                    <p id="egg-info-pokemon">Egg: ${infoCard.egg} </p>
                    <p id="encounter-info-pokemon">Encounter rate: ${infoCard.encounter['base-capture-rate']}</p>
                </div>
            </div>
            <article id="about-info-pokemon">Description: ${infoCard.about}</article> `

       document.getElementById('modal').style.display = 'block';
       document.getElementById('close').addEventListener('click', ()=>{
    document.getElementById('modal').style.display = 'none';
  });
}

//Esta función permite abrir el modal con la información
const openModal = () => {
    document.querySelectorAll(".single-card").forEach(card => card.addEventListener('click', (e)=>{
        e.stopPropagation();
        createModal(e.currentTarget.id)
    })
    );
}
openModal(); //Se invoca varias veces

//Botón para limpiar búsqueda y filtros
document.querySelector('.reset-search').addEventListener('click', ()=> {
    containerPokemon.innerHTML = ` `;
    search.value = ``;
    filterList.selectedIndex = 0;
    sortList.selectedIndex = 0;
    loadedData(originalData);
    openModal();
});

//Botón para cargar el top 10 pokémon con mayor altura
const callCompute = () => {
    document.querySelector('.video-youtube').removeAttribute('src');
    document.getElementById('newContainer').style.visibility = 'hidden';
    document.getElementById('searchAreaContainer').style.display = 'none';
    containerPokemon.innerHTML = ` `;
    containerPokemon.innerHTML = `<h3 style='width: 100%; text-align: center; margin: 20px 0;'>Cool! Buddy, here you have the 10 highest pokemon in the region Kanto and Johto Regions! 📏</h3>`;
    return greaterHeight(originalData, 10).map((elemento)=>{
        containerPokemon.innerHTML += `
            <div id=${elemento['num']} class="single-card">
                <h3 class="num-card">Nº ${elemento['num']}</h3>
                <span class="tooltip">Click to see information</span>
                <img class="img-card" id="img-card" src="https://www.serebii.net/pokemongo/pokemon/${elemento['num']}.png"></img>
                <div class="name-card"> ${elemento['name']} </div>
            </div> `
    openModal();
    });
}
document.getElementById('topTenHeight').addEventListener('click', callCompute)

// Top 10 pokemones más pesados
const computeState= () =>{
    containerPokemon.innerHTML = "";
    document.getElementById("searchAreaContainer").style.display="none";
    containerPokemon.innerHTML= ` <h3 style='width: 100%; text-align: center; margin: 20px 0;'>Cool! Buddy, here you have the 10 heaviest pokemon in the region Kanto and Johto Regions! 📏</h3>`;
    return greaterWeight([...data.pokemon], 10).map(pokemonPesado=>{
    containerPokemon.innerHTML += `
                <div id=${pokemonPesado['num']} class="single-card">
                <h3 class="num-card">Nº ${pokemonPesado['num']}</h3>
                <span class="tooltip">Click to see information</span>
                <img class="img-card" id="img-card" src="https://www.serebii.net/pokemongo/pokemon/${pokemonPesado['num']}.png"></img>
                <div class="name-card"> ${pokemonPesado['name']} </div>
            </div>
    `
    openModal();
});
}
 document.getElementById('topTenWeight').addEventListener('click', computeState);


//mostrando sección de How to be a pokemon master
document.getElementById('howToBePokemonMaster').addEventListener('click', ()=>{
    document.querySelector('.video-youtube').setAttribute('src', 'https://www.youtube.com/embed/Jgh3ZgX6-vQ');
    document.getElementById('searchAreaContainer').style.display = 'none';
    containerPokemon.innerHTML = ` `;
    document.getElementById('newContainer').style.visibility = 'visible';
});