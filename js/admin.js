// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, onValue,ref,set,child,get,update} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
import { getStorage, ref as refS, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvOiq1fL4HNhaYNSSkXJ0kkQG7UYVat9o",
  authDomain: "programacion-7cc22.firebaseapp.com",
  databaseURL: "https://programacion-7cc22-default-rtdb.firebaseio.com",
  projectId: "programacion-7cc22",
  storageBucket: "programacion-7cc22.appspot.com",
  messagingSenderId: "546742492136",
  appId: "1:546742492136:web:b310c39bf44d52bd8d625d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const storage = getStorage();


// Variables

// Admin
var id = "";
var nombreProducto = "";
var precioProducto = "";
var descripcionProducto = "";
var nombreImagen = "";
var urlImagen = "";
var estatus = 0;

// Botones
var btnCerrarSesion = document.getElementById('btnCerrarSesion');
var btnInsertar = document.getElementById('btnInsertar');
var btnBuscar = document.getElementById('btnBuscar');
var btnActualizar = document.getElementById('btnActualizar');
var btnDeshabilitar = document.getElementById('btnDeshabilitar');
var btnLimpiar = document.getElementById('btnLimpiar');
var btnMostrar = document.getElementById('btnMostrar');
var archivo = document.getElementById('archivo');
var lista = document.getElementById('lista');
var todo = document.getElementById('todo');
var btnInicio = document.getElementById('btnInicio');

// Funciones
function leerInputs(){
    id = document.getElementById('idProducto').value;
    nombreProducto = document.getElementById('nombreProducto').value;
    precioProducto = document.getElementById('precioProducto').value;
    descripcionProducto = document.getElementById('descripcionProducto').value;
    nombreImagen = document.getElementById('nombreImagen').value;
    urlImagen = document.getElementById('urlImagen').value;
    estatus = document.getElementById('estatusProducto').value;
}

function cerrarSesion(){
    signOut(auth).then(() => {
        alert('Cerrado Exitosamente');
        window.location.href="https://2020030810.000webhostapp.com/html/login.html";
    }).catch((error) => {
        console.log('Surgio un error' + error);
    });
}

if(window.location.href == "https://2020030810.000webhostapp.com/html/admin.html"){
    window.onload = validarUsuario();    
}

if(window.location.href == "https://2020030810.000webhostapp.com/html/tenishombre.html"){
    window.onload = mostrarProductos();    
}


if(window.location.href == "https://2020030810.000webhostapp.com/html/admin.html"){
    window.onload = mostrarProductos(); 
}



function validarUsuario(){
    onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        const nombre = user.email;
        alert('Usuario Valido')
    } else {
        document.getElementById('xd').style.display ="none"        
        document.getElementById('prohibido').innerHTML = "No tienes acceso"
        setTimeout(function(){
            window.location.href="https://2020030810.000webhostapp.com/html/login.html";
        }, 3000);
        


    }
    });
}

function cargarImagen(){
    const file = event.target.files[0];
    const name = event.target.files [0].name;
    document.getElementById('nombreImagen').value = name
    let id = document.getElementById('idProducto').value;

    const storageRef = refS(storage, 'imagenes/' + id);

    uploadBytes(storageRef, file).then((snapshot)=>{
    })
    setTimeout(descargarImagen,1500);
  
  }

function descargarImagen(){
    let id = document.getElementById('idProducto').value
    const storageRef = refS(storage, 'imagenes/' + id);
    // Get the download URL
    getDownloadURL(storageRef)
        .then((url) => {
        document.getElementById('urlImagen').value = url;
        document.getElementById('imagenProducto').src = url
        })
        .catch((error) => {
        switch (error.code) {
            case 'storage/object-not-found':
            console.log('No existe el archivo')
            break;
            case 'storage/unauthorized':
            console.log('No tiene permisos')
            break;
            case 'storage/canceled':
            console.log('Se cancelo o no tiene internet')
            break;
            case 'storage/unknown':
            console.log('Surgio al inesperado')
            break;
        }
        });
}

function insertarProducto(){
    leerInputs();
    if(id == "" || nombreProducto == "" || precioProducto == "" || descripcionProducto == ""){
        alert("Falta llenar un campo")
    }else{
        set(ref(db,'productos/' + id),{
            nombreProducto : nombreProducto,
            precioProducto : precioProducto,
            descripcionProducto : descripcionProducto,
            urlImagen : urlImagen,
            estatus : estatus
          }).then((response) =>{
            alert("Se agrego el registro con exito")
            mostrarProductos();
          }).catch((error)=>{
            alert("Surgio un error " + error)
          })
    }    
}

function buscarProducto(){
    leerInputs();
    const dbref = ref(db);
    if(id == ""){
        alert("Ingresa un ID")
    }else{
        get(child(dbref, 'productos/'+ id)).then((snapshot) =>{
            if(snapshot.exists()){
              nombreProducto = snapshot.val().nombreProducto,
              precioProducto = snapshot.val().precioProducto,
              descripcionProducto = snapshot.val().descripcionProducto,
              urlImagen = snapshot.val().urlImagen,
              estatus = snapshot.val().estatus
              escribirInputs();
            }else{
              alert("No existe la matricula");
            }
          }).catch((error) =>{
              alert("Surgio un error " + error)
          })
    }
    
  }

  function escribirInputs(){
    document.getElementById('idProducto').value = id;
    document.getElementById('nombreProducto').value = nombreProducto;
    document.getElementById('precioProducto').value = precioProducto;
    document.getElementById('descripcionProducto').value = descripcionProducto;
    document.getElementById('urlImagen').value = urlImagen;
    document.getElementById('imagenProducto').src= urlImagen;
    document.getElementById('estatusProducto').value = estatus;
  }

function actualizarProducto(){
    leerInputs();
    update(ref(db, 'productos/' + id),{
        nombreProducto : nombreProducto,
        precioProducto : precioProducto,
        descripcionProducto : descripcionProducto,
        urlImagen : urlImagen,
        estatus : estatus
    }).then(()=>{
        alert("Se realizo actualizacion")
        mostrarProductos();
    }).catch((error)=>{
        alert("Surgio un error" + error)
    })  
}



function mostrarProductos(){
    if(lista != null){
        lista.innerHTML = "";
    }
    const dbref = ref(db, 'productos/');
    onValue(dbref, (snapshot)=>{
        snapshot.forEach(childSnapshot => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        if(lista){
            if(childData.estatus == 0){
                lista.innerHTML = lista.innerHTML + "<div class='producto'><div class='foto'><img src='"+childData.urlImagen+"' style='height: 230px; width: 250px;'></img><h4>Id: ("+ childKey+ ")</h4><h4>"
                +childData.nombreProducto+"</h4><h5 style='text-align: center;'>Estatus( "+ childData.estatus +")</h5><p style='text-align: center;'>$"
                +childData.precioProducto+"</p><div class='descripcion'><p>"
                +childData.descripcionProducto+"</p></div></div></div>"
            }
            if(childData.estatus == 1){
                lista.innerHTML = lista.innerHTML + "<div class='producto'><div class='foto'><img src='"+childData.urlImagen+"' style='height: 230px; width: 250px;'></img><h4>Id: ("+ childKey+ ")</h4><h4>"
                +childData.nombreProducto+"</h4><h5 style='text-align: center;'>Estatus( "+ childData.estatus +")</h5><p style='text-align: center;'>$"
                +childData.precioProducto+"</p><div class='descripcion'><p>"
                +childData.descripcionProducto+"</p></div></div></div>"
            }
        }
        if(todo){
            if(childData.estatus == 0){
                todo.innerHTML = todo.innerHTML + "<div class='producto'><div class='foto'><img src='"+childData.urlImagen+"' style='height: 230px; width: 250px;'></img><h4>"
                +childData.nombreProducto+"</h4><p style='text-align: center;'>$"+childData.precioProducto+"</p><div class='descripcion'><p>"
                +childData.descripcionProducto+"</p></div></div></div>"

            }
        }
                                              
        });
    },{
        onlyOnce: true
    });

}

function deshabilitar(){
    leerInputs();
    if(estatus == 0){
        update(ref(db, 'productos/' + id),{
            estatus : 1
        }).then(()=>{
            alert("Se deshabilito")
            buscarProducto();
            escribirInputs();
            mostrarProductos();
        }).catch((error)=>{
            alert("Surgio un error" + error)
        })  
    }
    if(estatus == 1){
        update(ref(db, 'productos/' + id),{
            estatus : 0
        }).then(()=>{
            alert("Se habilito")
            buscarProducto();
            escribirInputs();
            mostrarProductos();
        }).catch((error)=>{
            alert("Surgio un error" + error)
        })  
    }
    
    
    

}

function irInicio(){
    window.location.href="https://2020030810.000webhostapp.com/html/inicio.html";
}



function limpiar(){
    id = "";
    nombreProducto = "";
    precioProducto = "";
    descripcionProducto = "";
    nombreImagen = "";
    urlImagen = "https://firebasestorage.googleapis.com/v0/b/programacion-7cc22.appspot.com/o/imagenes%2Ficono.png?alt=media&token=26bbcfd6-a1a5-4cbe-b5f0-efc61afcb592";
    escribirInputs();
    document.getElementById('urlImagen').value = "";
    document.getElementById('nombreImagen').value ="";  

}



// Eventos
if(btnCerrarSesion){
    btnCerrarSesion.addEventListener('click',cerrarSesion);
}

if(btnInsertar){
    btnInsertar.addEventListener('click',insertarProducto);
}

if(btnDeshabilitar){
    btnDeshabilitar.addEventListener('click',deshabilitar);
}

if(btnLimpiar){
    btnLimpiar.addEventListener('click',limpiar);
}

if(btnActualizar){
    btnActualizar.addEventListener('click',actualizarProducto);
}

if(btnBuscar){
    btnBuscar.addEventListener('click',buscarProducto);
}

if(btnMostrar){
    btnMostrar.addEventListener('click',mostrarProductos);
}

if(archivo){
    archivo.addEventListener('change',cargarImagen);
}

if(btnCerrarSesion){
    btnCerrarSesion.addEventListener('click',cerrarSesion);
}

if(btnInicio){
    btnInicio.addEventListener('click',irInicio);
}


