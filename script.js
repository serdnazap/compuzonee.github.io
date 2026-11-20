// JAVASCRIPT BÁSICO. Las imágenes y los precios están escritos directamente
// en index.html (atributos data-imagenes y data-precio de cada producto).
let carrito = [];            // [{ nombre, precio }]
let productoActual = '';
let precioActual = 0;

// Dar formato de pesos mexicanos: 37999 -> $37,999 MXN
function formatoPrecio(numero) {
  return '$' + Number(numero).toLocaleString('es-MX') + ' MXN';
}

// Mostrar la ventana seleccionada desde el menú.
function mostrarVentana() {
  let pagina = location.hash.substring(1) || 'inicio';
  let categorias = ['computadoras', 'gaming', 'accesorios'];
  let ventanas = ['inicio', 'productos', 'detalle', 'carrito'];

  document.querySelectorAll('.ventana').forEach(ventana => ventana.classList.remove('activa'));

  if (categorias.includes(pagina)) {
    // Las categorías son títulos dentro de la ventana "productos"
    document.getElementById('productos').classList.add('activa');
    document.getElementById(pagina).scrollIntoView();
  } else {
    document.getElementById(ventanas.includes(pagina) ? pagina : 'inicio').classList.add('activa');
    window.scrollTo(0, 0);
  }
}
window.addEventListener('hashchange', mostrarVentana);
mostrarVentana();

// Escribir en cada tarjeta el precio guardado en data-precio.
function mostrarPrecios() {
  document.querySelectorAll('.producto').forEach(producto => {
    let precio = Number(producto.dataset.precio);
    producto.querySelector('.precio').textContent =
      precio > 0 ? formatoPrecio(precio) : 'Precio por confirmar';
  });
}
mostrarPrecios();

// Leer el nombre, la descripción, el precio y las imágenes de la tarjeta seleccionada.
function verDetalle(boton) {
  let producto = boton.closest('.producto');
  productoActual = producto.dataset.nombre;
  precioActual = Number(producto.dataset.precio) || 0;

  document.getElementById('nombre-detalle').textContent = productoActual;
  document.getElementById('descripcion-detalle').textContent = producto.dataset.descripcion;
  document.getElementById('precio-detalle').textContent =
    precioActual > 0 ? formatoPrecio(precioActual) : 'Precio por confirmar';

  // Lista de imágenes: data-imagenes="t3.1.jpeg,t3.2.jpeg,t3.3.jpeg"
  let imagenes = (producto.dataset.imagenes || '')
    .split(',')
    .map(ruta => ruta.trim())
    .filter(ruta => ruta !== '');

  // Lista de características: data-caracteristicas="uno|dos|tres"
  let lista = document.getElementById('caracteristicas-detalle');
  lista.innerHTML = '';
  (producto.dataset.caracteristicas || '')
    .split('|')
    .filter(texto => texto.trim() !== '')
    .forEach(texto => {
      let li = document.createElement('li');
      li.textContent = texto.trim();
      lista.append(li);
    });

  crearGaleria(imagenes, productoActual);
  location.hash = 'detalle';
}

// Foto grande + miniaturas (estilo Amazon).
function crearGaleria(imagenes, nombre) {
  let principal = document.getElementById('detalle-principal');
  let contenedor = document.getElementById('miniaturas');
  contenedor.innerHTML = '';

  if (imagenes.length === 0) {
    principal.removeAttribute('src');
    return;
  }

  principal.alt = nombre;
  principal.src = imagenes[0];

  imagenes.forEach((ruta, indice) => {
    let mini = document.createElement('img');
    mini.src = ruta;
    mini.alt = nombre + ' imagen ' + (indice + 1);
    mini.className = indice === 0 ? 'miniatura activa' : 'miniatura';
    mini.onerror = function () { mini.style.display = 'none'; };

    // Cambia la foto principal al hacer clic en la miniatura.
    mini.addEventListener('click', function () {
      principal.src = ruta;
      contenedor.querySelectorAll('.miniatura').forEach(m => m.classList.remove('activa'));
      mini.classList.add('activa');
    });

    contenedor.append(mini);
  });
}

// Agregar un producto al carrito.
function agregar(boton) {
  let producto = boton.closest('.producto');
  let nombre = producto.dataset.nombre;
  carrito.push({ nombre: nombre, precio: Number(producto.dataset.precio) || 0 });
  actualizarCarrito();
  alert('Producto agregado: ' + nombre);
}
function agregarDetalle() {
  if (!productoActual) return;
  carrito.push({ nombre: productoActual, precio: precioActual });
  actualizarCarrito();
  alert('Producto agregado: ' + productoActual);
}
function actualizarCarrito() {
  let lista = document.getElementById('lista-carrito');
  lista.innerHTML = '';
  if (carrito.length === 0) lista.innerHTML = '<p>Tu carrito está vacío.</p>';

  let total = 0;
  let sinPrecio = false;

  carrito.forEach((item, posicion) => {
    total += item.precio;
    if (item.precio === 0) sinPrecio = true;

    let fila = document.createElement('div');
    fila.className = 'item-carrito';
    let texto = document.createElement('span');
    texto.textContent = item.nombre + ' - ' +
      (item.precio > 0 ? formatoPrecio(item.precio) : 'Precio por confirmar');
    let boton = document.createElement('button');
    boton.textContent = 'Eliminar';
    boton.onclick = function () { carrito.splice(posicion, 1); actualizarCarrito(); };
    fila.append(texto, boton);
    lista.append(fila);
  });

  document.getElementById('contador').textContent = carrito.length;
  document.getElementById('total').textContent = carrito.length;
  document.getElementById('total-precio').textContent =
    formatoPrecio(total) + (sinPrecio ? ' (más productos con precio por confirmar)' : '');
}
function vaciarCarrito() { carrito = []; actualizarCarrito(); }