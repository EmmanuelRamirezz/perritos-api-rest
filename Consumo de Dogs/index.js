//Curso basico de consumo de API - rest
//App que muestra perritos aleatorios, que permite guardar tus favoritos y subir tus propios perritos. Ademas que muestra mis propios perritos al usuario.


//Consumo 1: Mis perritos peronales
//Consumo basico de la api donde solo trae mis perritos de un array definido
var mine = 0;
const  myDogs = [
  'https://cdn2.thedogapi.com/images/sO2dXxjhg.jpg',
  'https://cdn2.thedogapi.com/images/MVcTZ6NhQ.jpg',
  'https://cdn2.thedogapi.com/images/s1WDPxNQR.jpg',
  'https://cdn2.thedogapi.com/images/USJlKDDuw.jpg'
];
async function consumo1 (){ 
  //const url1 = await fetch('https:/api.thedogapi.com/v1/images/search'); //la url se puede guardar en una variable
  //const data = await url1.json();
  const pic1 = document.querySelector('#pic1');
  //pic1.src= data[0].url;
  pic1.src=myDogs[mine];
}
const next = document.querySelector('#next');
const spanError = document.querySelector('#spanError');


consumo1();
next.addEventListener('click', function(){
  
  if (mine===3){
    mine=-1;
  }
  mine++
  consumo1();
});


//Consumo 2: Seccion que muestra 3 perritos aleatorios, usando query parameters y endpoints (filtros) 
//el uso de estos están en la documentacion de la api
async function consumo2 (){
  try{
    const url2 = await fetch('https://api.thedogapi.com/v1/images/search?limit=3&api_key=live_61pP6MRunB0SXOdHxzEWyoRufVNEN78OL0CkxAyXNwjehRvhlBL8Gwto1uqUw96N');
    const data = await url2.json();
    //declaro las imagenes
    const pic2 = document.querySelector('#pic2');
    const pic3 = document.querySelector('#pic3');
    const pic4 = document.querySelector('#pic4');
    //declaro los botones de las imagenes
    const btn1 = document.querySelector('#btn1');
    const btn2 = document.querySelector('#btn2');
    const btn3 = document.querySelector('#btn3');
    
    console.log('Seccion de randoms');
    console.log(data);
    console.log(url2.status);
    //a cada imagen declarada le asigno un enlace proveniente de la api
    pic2.src= data[0].url;
    pic3.src= data[1].url;
    pic4.src= data[2].url;
    //cada boton se vincula con el id de la imagen proveniente de la api y se usan en la funcion de saveFavoriteDog
    btn1.onclick = ()=> saveFavoriteDog(data[0].id);
    btn2.onclick = ()=> saveFavoriteDog(data[1].id);
    btn3.onclick = ()=> saveFavoriteDog(data[2].id);

  }catch(err){
    console.log(err);
    //usamos el span creado anteriormente solo para mostrar errores si es que ocurren
    spanError.innerHTML = "Hubo un error " + err.message;
    console.log('hubo un error en random');
  }
}

//Consumo 3: Muestra las fotos que hayamos elegido como favoritas del consumo 2
//esta url necesita nuestra key la cual me enviaron al correo siguiendo las instrucciones de la documentacion
async function consumo3 (){
  try{
    const url3 = await fetch('https://api.thedogapi.com/v1/favourites?limit=30&api_key=live_61pP6MRunB0SXOdHxzEWyoRufVNEN78OL0CkxAyXNwjehRvhlBL8Gwto1uqUw96N');//fav
    const data = await url3.json();
    console.log('Seccion de favoritos');
    console.log(data);
    console.log(url3);
    console.log(url3.status);
    //declaramos el section el cual es un espacio vacio donde se colocarán las fotos favoritas
    const section = document.querySelector('#favoritesDoggys');
    //limpiamos la seccion para que no se repitan las fotos que ya tenemos
    section.innerHTML='';
    //creamos un h2 con js
    //const h2 = document.createElement('h2');
    //le agregamos contenido al h2
    //const h2Text = document.createTextNode('Estos son sus perritos favoritos')
    //colocamos el contenido en el propio h2
    //h2.appendChild(h2Text);
    //colocamos el h2 dentro de section
    //section.appendChild(h2)
    //hacemos un bucle el cual se aplicará para cada elemento de nuestro array de favoritos
    data.forEach(doggy => {
      //creamos una etiqueta article con js
      const article = document.createElement('article');
      article.classList.add('favorites-info');
      //creamos una img 
      const img = document.createElement('img');
      //creamos un div (contenedor de img)
      const div = document.createElement('div');
      //creamos un button
      const btn = document.createElement('button');
      //le agregamos texto a nuestro boton creado
      const btnText = document.createTextNode('Quitar este perrito de favoritos')
      const btnImg = document.createElement('img');
      //creamos un elemento 'p'
      const p = document.createElement('p')
      //colocamos el articulo dentro del section
      section.appendChild(article);
      //colocamos el div dentro del article
      article.appendChild(div);
      //le ponemos clase al div 
      div.classList.add('img-container');
      //colocamos la imagen dentro del div
      div.appendChild(img);
      //a la imagen le agregamos un link el cual proviene de la api ubicado en image.url
      img.src=doggy.image.url;
      //a img le agregamos un atributo width con un valor de 150
      img.width=150;
      btnImg.src= 'https://cdn-icons-png.flaticon.com/512/4225/4225935.png';
      btnImg.classList.add('paw')
      //colocamos el boton dentro del articulo
      article.appendChild(btn);
      //agregamos la etiqueta p con el texto dentro del btn
      p.appendChild(btnText)
      //colocamos el texto del boton en el boton
      btn.appendChild(p);
      //agregamos la imd de patita al boton
      btn.appendChild(btnImg)
      //indicamos que al ahcer click en el boton creado se ejecute la funciondelete FavoriteDog con su id
      btn.onclick = () => deleteFavoriteDog(doggy.id)
    })
  }catch(err){
    console.log(err, err.message, err.name);
    spanError.innerHTML = "Hubo un error con el servidor. Intentelo mas tarde" + err.message;
    console.log('hubo un error en favoritos');
  }
}
consumo3();
//Boton de recargar
const buttonReload = document.querySelector('#button__reload');
buttonReload.addEventListener('click', function(){
  consumo2();
})
//SaveFavoriteDog: Esta funcion es la logica para guardar a favoritos y usa metodo POST el cual necestia un header y un body, está funcion necesita un id para funcionar
async function saveFavoriteDog(id){
  try{
    //el header va como parametro dentro de la funcion de fetch junto con el link
    const res = await fetch('https://api.thedogapi.com/v1/favourites? limit=3&api_key=live_61pP6MRunB0SXOdHxzEWyoRufVNEN78OL0CkxAyXNwjehRvhlBL8Gwto1uqUw96N', {
      //indicamos que usaremos el metodo post para subir nuestras fotos
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'//garantiza que el backend nos retorne un json
      },
      //convertimos nuestro json a string para mejorar la compatibilidad con el backend
      body: JSON.stringify({
        //el post necesita un id, el cual es el que usamos en el parametro de la funcion
        image_id: id
      }),
    });
    //ejecutamos la funcion consumo3
    consumo3()
    //corroboramos en consola
    console.log('save '+res.json());
  }
  catch(err){
    console.log(err);
    spanError.innerHTML = "Hubo un error " + err.message;
  }
}

//deleteFavoriteDog: funcion para eliminiar una foto de la seccion de favoritos esta funcion necesita un id el cual tambien usamos como parte del enlace usando la concatenacion
const API_URL_DELETE= (id) => `https://api.thedogapi.com/v1/favourites/${id}?`;
async function deleteFavoriteDog(id){
  //headesr: aqui colocamos un header indicando la api key. esta puede enviearce en el mismo link pero por cuestiones esteticas tambien puede envierse como header. tambien sale en la documentacion. (es ligeramente mas seuro)
  try{
    //hacemos una solicitud al enlace que declaramos arriva
    const res = await fetch(API_URL_DELETE(id), {
      //como parte del parametro del fetch colocamos nuestro metodo el cual es delete
      method: 'DELETE',
      headers: {
        'X-API-KEY':'live_61pP6MRunB0SXOdHxzEWyoRufVNEN78OL0CkxAyXNwjehRvhlBL8Gwto1uqUw96N'
      }
    })
    //confirmacion de consola
    console.log('dogi eliminado');
    //ejecutamos esta funcion para que muestre los dogis sin mostrar el que eliminamos
    consumo3();
  }catch(err){
    //notifica si hay algun error en el span
    console.log(err);
    spanError.innerHTML = "Hubo un error " + err.message;
  }
  
}

//Ejecutamos nuestras funciones

consumo2();
//consumo3();

//uploadDogPic: Esta funcion tiene la logica para subir nuestras propias fotos de perritos
const api_url_upload = 'https://api.thedogapi.com/v1/images/upload';
async function uploadDogPic(){
  try{
    const form = document.getElementById('uploadingForm')
   //Hacemos una instancia del objeto FormData que viene por defecto en js. agregando nuestro form como argumento
   const objForm = new FormData(form) 
   //Form data agarra todos los datos de los inputs de los formularios y nos los da en forma facil
   console.log(objForm.get('file'));
   const res = await fetch(api_url_upload, {
    method: 'POST',
    headers:  {
      //'Content-Type': 'multipart/form-data',
      'X-API-KEY':'live_61pP6MRunB0SXOdHxzEWyoRufVNEN78OL0CkxAyXNwjehRvhlBL8Gwto1uqUw96N'
    },
    body: objForm,//el formato ya esta listo para ser enviado
   });
   const data = await res.json();
  console.log('foto subida');
  console.log(data);
  console.log(data.url);
  saveFavoriteDog(data.id)
  }catch(err){
    console.log(err);
    alert('Error al subir foto')
  }
   
}

//Apuntes
//Metodos HTTP:
//GET: obtener contenido, está por defecto
//POST: crear contenido
//PUT y PATCH: editar contenido
//DELETE: eliminar contenido 

//sintaxis de una funcion de async await con fetch
//  const urlz = 'www.api.com'
//  async function ejemplo(){
//    const res = await fetch(urlz);
//    const data = res.json()
//  }
   


    