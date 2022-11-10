// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";


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
const auth = getAuth();


// Variables

// Login
var usuario = "";
var contraseña = ""


// Botones

// Login
var btnIniciarSesion = document.getElementById('btnIniciarSesion');
var btnLimpiar = document.getElementById('btnLimpiar');


// Funciones

// Login
function leerUsuario(){
    usuario = document.getElementById('usuario').value;
    contraseña = document.getElementById('contraseña').value;
}

// Login
function iniciarSesion(){
    leerUsuario();
    signInWithEmailAndPassword(auth, usuario, contraseña).then((userCredential) => { 
    const user = userCredential.user;
    alert("Inicio sesion")
    window.location.href="https://2020030810.000webhostapp.com/html/admin.html";
    }).catch((error) => {
        if(error.code == 'auth/invalid-email' || error.code == 'auth/wrong-password' ){
            alert('Usuario o contraseña incorrectos')
        }else{
            alert("Surgio un error " + error);
        }
        
    });
}

function limpiar(){
    document.getElementById('usuario').value = "";
    document.getElementById('contraseña').value = "";
}



if(window.location.href == "https://2020030810.000webhostapp.com/html/admin.html"){
    window.onload = validarUsuario();    
}

// Eventos
if(btnIniciarSesion){
    btnIniciarSesion.addEventListener('click',iniciarSesion);
}

if(btnLimpiar){
    btnLimpiar.addEventListener('click', limpiar)
}
