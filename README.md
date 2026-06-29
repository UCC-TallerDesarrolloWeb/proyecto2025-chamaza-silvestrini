# proyecto2025
Estructura de Proyecto Taller de Desarrollo Web - 2025

# Tenedor Libre — Buffet en Casa

**Proyecto final de la materia "Taller de Desarrollo Web"**  
Sitio web de recetas interactivas con categorias, login/registro, tienda, reseñas y mapa.

---

## Indice

1. [Descripcion del Proyecto](#descripcion-del-proyecto)
2. [Autores](#autores)
3. [Contenido de la Pagina](#contenido-de-la-pagina)
4. [Tecnologias Utilizadas](#tecnologias-utilizadas)
5. [Pasos para ejecutar el proyecto](#pasos-para-ejecutar-el-proyecto)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [GitHub Pages](#-github-pages)
8. [Licencia](#-licencia)

---

## Descripcion del Proyecto

**Tenedor Libre** es una pagina web que funciona como un recetario virtual con enfoque visual, ordenado por categorias (Saludable, Vegetariano, Dulce, Pastas, etc.).  
El usuario puede:
- Ver todas las recetas por categoria o filtrar.
- Acceder a los ingredientes y cantidades.
- Iniciar sesion o registrarse para ver recetas completas.
- Explorar una tienda de productos de cocina, mapa de ferias y clases, y una seccion de reseñas con puntuaciones.

---

## Autores

| Nombre | Universidad |
|:-------|:-------------|
| **Florencia Chamaza** | Universidad Catolica de Cordoba |
| **Mia Silvestrini** | Universidad Catolica de Cordoba |

---

##  Contenido de la Pagina

### Secciones Principales

1. **Inicio**  
   Presentacion del proyecto con el boton *"Explorar recetas"*.

2. **Categorias de Recetas**  
   Visualizacion de categorias.  
   Al hacer clic, redirige a `recetas.html` filtrando las recetas correspondientes.

3. **Recetas por Categoria**  
   Cada receta muestra foto, nombre, tiempo, porciones e ingredientes con sus cantidades.

4. **Tienda**  
   Productos destacados relacionados a la cocina (ej. cuchillos, sartenes, especias).

5. **Mapa**  
   Muestra un mapa de Cordoba con ubicaciones de ferias, clases y restaurantes.

6. **Reseñas**  
   Los usuarios pueden dejar su nombre, comentario y puntaje de estrellas.

7. **Formulario de Contacto**  
   Para mensajes o colaboraciones con el equipo de Tenedor Libre.

8. **Login / Registro**  
   Acceso mediante modal o en `login.html`, con almacenamiento local (localStorage).

---

## Tecnologias Utilizadas

| Tecnologia | Uso Principal |
|-------------|----------------|
| **HTML5** | Estructura del sitio |
| **CSS3 (Flexbox, Grid)** | Estilos, diseño responsivo y tema visual |
| **JavaScript (Vanilla)** | Interactividad, login, categorias dinamicas y modales |
| **React 18 + Vite** | Versión SPA del sitio (segunda etapa) |
| **SCSS (Sass)** | Estilos de la versión React con variables y anidamiento |
| **react-router-dom** | Enrutamiento de páginas en la versión React |
| **json-server** | Mock REST API para datos de productos |
| **LocalStorage / SessionStorage** | Almacenamiento local de usuario y recetas |
| **Markdown (.md)** | Documentacion del proyecto |
| **Git & GitHub** | Control de versiones y hosting |
| **GitHub Pages** | Publicacion del sitio web |

---

## Pasos para ejecutar el proyecto

### Versión HTML (sin instalación)
Abrir `CODIGOS/index.html` directamente en el navegador.

### Versión React
```bash
cd REACT/Tenedor-Libre
npm install
npm run dev
```
Luego acceder a `http://localhost:5173`

---

## 📁 Estructura del Proyecto

```
proyecto2025-chamaza-silvestrini/
├── CODIGOS/
│   ├── index.html          # Página principal
│   ├── recetas.html        # Catálogo de recetas por categoría
│   ├── tienda.html         # Tienda de productos de cocina
│   ├── login.html          # Login y registro de usuario
│   ├── tenedorlibre.css    # Estilos globales del sitio
│   ├── index.js            # Lógica de la página principal
│   ├── recetas.js          # Lógica de recetas y categorías
│   ├── tienda.js           # Lógica de tienda y carrito
│   ├── tenedorlibre.js     # Utilidades compartidas (Auth, Nav)
│   └── login.js            # Lógica de login y registro
├── imagenes/               # Imágenes del sitio
├── SKETCH/                 # Bocetos en papel (desktop y mobile)
├── WIREFRAME/              # Wireframes digitales (Draw.io)
└── REACT/
    └── Tenedor-Libre/      # Versión React con Vite
        ├── src/
        │   ├── components/ # Componentes reutilizables
        │   ├── pages/      # Páginas de la aplicación
        │   ├── styles/     # Estilos SCSS
        │   └── api/        # Datos y servicios mock
        └── public/         # Assets públicos
```

## 🔗 GitHub Pages

[Ver el sitio en vivo](https://ucc-tallerdesarrolloweb.github.io/proyecto2025-chamaza-silvestrini/CODIGOS/index.html)

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para la materia **Taller de Desarrollo Web** — Universidad Católica de Córdoba, 2025.
