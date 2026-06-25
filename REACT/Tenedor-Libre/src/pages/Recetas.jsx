import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "@styles/recetas.scss";

const CATEGORIES = [
  { key: "saludable",  label: "Saludable",        img: "/imagenes/saludable.JPG" },
  { key: "vegetariano",label: "Vegetariano",       img: "/imagenes/vegano.JPG" },
  { key: "dulce",      label: "Dulce",             img: "/imagenes/dulce.JPG" },
  { key: "romantica",  label: "Cena romántica",    img: "/imagenes/cena.png" },
  { key: "paises",     label: "Países",            img: "/imagenes/mundo.png" },
  { key: "minutos",    label: "10 minutos",        img: "/imagenes/10min.png" },
  { key: "sintacc",    label: "SIN TACC",          img: "/imagenes/SINTAC.png" },
  { key: "pastas",     label: "Pastas y Salsas",   img: "/imagenes/pasta.png" },
];

const RECIPES = [
  { id:"ensalada-quinoa",    title:"Ensalada de quinoa y palta",    img:"/imagenes/quinoa.jpg",           time:18, servings:2, method:"crudo",    cats:["saludable"],             ingredients:{"Quinoa":"100 g","Palta":"1 unidad","Tomate":"1 mediano","Pepino":"1/2 unidad","Limón":"1/2 (jugo)","Aceite de oliva":"2 cdas","Sal":"1 pizca"} },
  { id:"pollo-grill",        title:"Pollo grillado con verduras",   img:"/imagenes/pollo.jpg",            time:25, servings:2, method:"plancha",  cats:["saludable"],             ingredients:{"Pechuga de pollo":"2 uds","Zucchini":"1 unidad","Morrón":"1 unidad","Aceite de oliva":"1 cda","Sal":"1/2 cdta","Pimienta":"1/4 cdta"} },
  { id:"sopa-calabaza",      title:"Sopa cremosa de calabaza",      img:"/imagenes/sopacalabaza.jpg",     time:30, servings:4, method:"olla",     cats:["saludable"],             ingredients:{"Calabaza":"500 g","Cebolla":"1 unidad","Caldo de verduras":"600 ml","Crema":"100 ml","Sal":"1/2 cdta"} },
  { id:"bowl-med",           title:"Bowl mediterráneo",             img:"/imagenes/ensalada-mediterranea.jpg", time:15, servings:2, method:"crudo", cats:["saludable"],           ingredients:{"Garbanzos":"150 g","Tomate":"1 unidad","Pepino":"1/2 unidad","Aceitunas":"6 uds","Queso feta":"50 g","Limón":"1/2 (jugo)"} },
  { id:"pesto",              title:"Pesto clásico",                 img:"/imagenes/pesto.jpg",            time:10, servings:4, method:"crudo",    cats:["vegetariano","pastas"],  ingredients:{"Albahaca":"40 g","Queso parmesano":"40 g","Nueces":"30 g","Aceite de oliva":"100 ml"} },
  { id:"risotto-hongos",     title:"Risotto de hongos",             img:"/imagenes/risotto.jpg",          time:35, servings:3, method:"olla",     cats:["vegetariano","pastas"],  ingredients:{"Arroz arborio":"200 g","Hongos":"150 g","Caldo de verduras":"600 ml","Queso parmesano":"50 g"} },
  { id:"caprese",            title:"Sándwich caprese",              img:"/imagenes/sandwich.jpg",         time:8,  servings:2, method:"frío",     cats:["vegetariano"],           ingredients:{"Pan ciabatta":"2 uds","Mozzarella":"100 g","Tomate":"1 unidad","Albahaca":"4 hojas"} },
  { id:"curry-garb",         title:"Curry de garbanzos",            img:"/imagenes/curry.jpg",            time:25, servings:3, method:"olla",     cats:["vegetariano"],           ingredients:{"Garbanzos":"200 g","Leche de coco":"200 ml","Curry":"1 cda","Cebolla":"1 unidad"} },
  { id:"brownies",           title:"Brownies",                      img:"/imagenes/brownie.jpg",          time:35, servings:12,method:"horno",    cats:["dulce"],                 ingredients:{"Chocolate":"200 g","Manteca":"120 g","Huevos":"3 uds","Azúcar":"150 g","Harina":"100 g"} },
  { id:"alfajores",          title:"Alfajores de maicena",          img:"/imagenes/alfajores-de-maicena.jpg", time:50, servings:18, method:"horno", cats:["dulce"],              ingredients:{"Maicena":"200 g","Harina":"100 g","Manteca":"150 g","Dulce de leche":"200 g","Coco rallado":"50 g"} },
  { id:"pancakes",           title:"Pancakes",                      img:"/imagenes/pancakes.jpg",         time:20, servings:10,method:"sartén",   cats:["dulce"],                 ingredients:{"Harina":"150 g","Huevos":"2 uds","Leche":"250 ml","Azúcar":"2 cdas","Polvo de hornear":"1 cdta"} },
  { id:"flan",               title:"Flan casero",                   img:"/imagenes/flan.jpg",             time:70, servings:8, method:"horno",    cats:["dulce"],                 ingredients:{"Huevos":"4 uds","Leche":"500 ml","Azúcar":"120 g","Vainilla":"1 cdta"} },
  { id:"risotto-azaf",       title:"Risotto al azafrán",            img:"/imagenes/azafran.jpg",          time:30, servings:2, method:"olla",     cats:["romantica"],             ingredients:{"Arroz arborio":"200 g","Caldo":"600 ml","Azafrán":"1 pizca","Queso parmesano":"40 g"} },
  { id:"salmon-hierbas",     title:"Salmón con manteca de hierbas", img:"/imagenes/salmon.jpg",           time:22, servings:2, method:"plancha",  cats:["romantica"],             ingredients:{"Salmón":"2 filetes","Manteca":"40 g","Hierbas frescas":"1 cda","Limón":"1/2 unidad"} },
  { id:"lomo-malbec",        title:"Lomo al malbec",                img:"/imagenes/lomo.jpg",             time:35, servings:2, method:"sartén",   cats:["romantica"],             ingredients:{"Lomo":"2 medallones","Vino malbec":"150 ml","Manteca":"30 g","Sal":"1/2 cdta","Pimienta":"1/4 cdta"} },
  { id:"brulee",             title:"Crème brûlée",                  img:"/imagenes/creme-brule.jpg",      time:50, servings:2, method:"horno",    cats:["romantica"],             ingredients:{"Crema":"250 ml","Yemas":"3 uds","Azúcar":"60 g","Vainilla":"1 cdta"} },
  { id:"tacos",              title:"Tacos de carne",                img:"/imagenes/tacos.jpg",            time:20, servings:4, method:"sartén",   cats:["paises"],                ingredients:{"Tortillas":"4 uds","Carne vacuna":"200 g","Cebolla":"1 unidad","Cilantro":"1 cda","Limón":"1/2 unidad"} },
  { id:"paella",             title:"Paella mixta",                  img:"/imagenes/paella.jpg",           time:45, servings:4, method:"paellera", cats:["paises"],                ingredients:{"Arroz":"300 g","Mariscos":"200 g","Pollo":"150 g","Morrón":"1 unidad","Azafrán":"1 pizca"} },
  { id:"sushi",              title:"Sushi básico",                  img:"/imagenes/sushi.jpg",            time:50, servings:3, method:"crudo",    cats:["paises"],                ingredients:{"Arroz":"200 g","Alga nori":"3 láminas","Salmón":"100 g","Pepino":"1/2 unidad","Vinagre de arroz":"2 cdas"} },
  { id:"tikka",              title:"Pollo tikka masala",            img:"/imagenes/pollo-tikka.jpg",      time:40, servings:3, method:"olla",     cats:["paises"],                ingredients:{"Pollo":"300 g","Yogur":"100 ml","Garam masala":"1 cda","Tomate":"1 unidad","Crema":"50 ml"} },
  { id:"omelette-caprese",   title:"Omelette caprese",              img:"/imagenes/omelet.jpg",           time:6,  servings:1, method:"sartén",   cats:["minutos"],               ingredients:{"Huevos":"2 uds","Tomate":"1 unidad","Albahaca":"4 hojas","Mozzarella":"50 g","Sal":"1 pizca"} },
  { id:"pasta-ajoaceite",    title:"Pasta ajo y aceite",            img:"/imagenes/pasta-ajo.jpg",        time:8,  servings:2, method:"olla",     cats:["minutos"],               ingredients:{"Pasta":"200 g","Ajo":"2 dientes","Aceite de oliva":"3 cdas","Ají molido":"1/2 cdta","Perejil":"1 cda"} },
  { id:"tostadas-fr",        title:"Tostadas francesas",            img:"/imagenes/tostada-francesa.jpg", time:8,  servings:2, method:"sartén",   cats:["minutos"],               ingredients:{"Pan":"4 rebanadas","Huevo":"2 uds","Leche":"100 ml","Azúcar":"1 cda","Canela":"1/2 cdta"} },
  { id:"ensalada-atun",      title:"Ensalada rápida de atún",       img:"/imagenes/ensalada-atun.jpg",    time:8,  servings:2, method:"crudo",    cats:["minutos"],               ingredients:{"Atún":"1 lata","Lechuga":"1 taza","Tomate":"1 unidad","Aceite de oliva":"1 cda","Limón":"1/2 unidad","Sal":"1 pizca"} },
  { id:"pan-sg",             title:"Pan sin gluten",                img:"/imagenes/pan-sin.jpg",          time:25, servings:12,method:"horno",    cats:["sintacc"],               ingredients:{"Mezcla sin gluten":"400 g","Levadura":"10 g","Agua":"300 ml","Aceite":"2 cdas","Sal":"1 cdta"} },
  { id:"pizza-sg",           title:"Pizza sin gluten",              img:"/imagenes/pizza-sin.jpg",        time:30, servings:8, method:"horno",    cats:["sintacc"],               ingredients:{"Mezcla sin gluten":"300 g","Salsa de tomate":"100 ml","Queso":"150 g","Orégano":"1 cdta"} },
  { id:"arroz-pollo",        title:"Arroz con pollo",               img:"/imagenes/arroz-pollo.jpg",      time:35, servings:3, method:"olla",     cats:["sintacc"],               ingredients:{"Arroz":"200 g","Pollo":"200 g","Morrón":"1 unidad","Caldo":"400 ml"} },
  { id:"budin-naranja",      title:"Budín de naranja",              img:"/imagenes/budin-naranja.jpg",    time:50, servings:10,method:"horno",    cats:["sintacc"],               ingredients:{"Harina sin gluten":"250 g","Huevos":"2 uds","Azúcar":"150 g","Naranja":"1 unidad"} },
  { id:"fileto",             title:"Salsa fileto",                  img:"/imagenes/salsa-fileto.jpg",     time:25, servings:4, method:"olla",     cats:["pastas"],                ingredients:{"Tomate triturado":"400 g","Cebolla":"1 unidad","Aceite de oliva":"2 cdas","Albahaca":"4 hojas"} },
  { id:"bolognesa",          title:"Salsa bolognesa",               img:"/imagenes/bolognesa.jpg",        time:45, servings:6, method:"olla",     cats:["pastas"],                ingredients:{"Carne picada":"300 g","Zanahoria":"1 unidad","Cebolla":"1 unidad","Tomate":"400 g"} },
  { id:"pesto-pasta",        title:"Fetuccini al pesto",            img:"/imagenes/fetuccini.jpg",        time:12, servings:2, method:"olla",     cats:["pastas"],                ingredients:{"Fetuccini":"200 g","Pesto":"80 g","Queso parmesano":"30 g","Sal":"1 pizca"} },
  { id:"puttanesca",         title:"Salsa puttanesca",              img:"/imagenes/salsa-putanesca.jpg",  time:20, servings:4, method:"olla",     cats:["pastas"],                ingredients:{"Tomate":"400 g","Aceitunas":"8 uds","Alcaparras":"1 cda","Ajo":"2 dientes"} },
];

/**
 * Verifica si hay sesión activa
 * @returns {boolean}
 */
const isLoggedIn = () => {
  try { return !!JSON.parse(localStorage.getItem("cmf_auth")); }
  catch { return false; }
};

const Recetas = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("categories");
  const [activeCat, setActiveCat] = useState(null);
  const [modalRecipe, setModalRecipe] = useState(null);

  const catLabel = CATEGORIES.find((c) => c.key === activeCat)?.label || "";
  const filteredRecipes = activeCat
    ? RECIPES.filter((r) => r.cats.includes(activeCat))
    : RECIPES;

  /**
   * Abre una categoría y muestra sus recetas
   * @param {string} key - Clave de la categoría
   */
  const openCategory = (key) => {
    setActiveCat(key);
    setView("recipes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Muestra todas las recetas independientemente de la categoría
   */
  const showAll = () => {
    setActiveCat(null);
    setView("recipes");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Abre el modal de una receta — requiere sesión activa
   * @param {Object} recipe - Objeto de receta
   */
  const openRecipe = (recipe) => {
    if (!isLoggedIn()) {
      navigate("/login?redirect=/recetas");
      return;
    }
    setModalRecipe(recipe);
  };

  return (
    <main className="recetas-page section">
      <div className="container">

        {/* Encabezado */}
        <div className="actions-row">
          <h1>{view === "categories" ? "Todas las recetas" : catLabel || "Todas las recetas"}</h1>
          <div className="actions-btns">
            {view === "recipes" && (
              <button className="btn secondary small" onClick={() => { setView("categories"); setActiveCat(null); }}>
                ← Volver a categorías
              </button>
            )}
            {!(view === "recipes" && !activeCat) && (
              <button className="btn secondary small" onClick={showAll}>
                Ver todas
              </button>
            )}
          </div>
        </div>
        <p className="lead muted">
          Elegí una <b>categoría</b> o mirá <b>todas</b> las recetas.
        </p>

        {/* Grid de categorías */}
        {view === "categories" && (
          <div className="cat-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className="cat-card-tile"
                onClick={() => openCategory(cat.key)}
                aria-label={`Ver recetas: ${cat.label}`}
              >
                <figure>
                  <img src={cat.img} alt={cat.label} loading="lazy" />
                  <figcaption className="overlay">
                    <h3>{cat.label}</h3>
                  </figcaption>
                </figure>
              </button>
            ))}
          </div>
        )}

        {/* Grid de recetas de una categoría */}
        {view === "recipes" && (
          <div className="recipe-gallery">
            {filteredRecipes.map((r) => (
              <button
                key={r.id}
                className="recipe-card"
                onClick={() => openRecipe(r)}
                aria-label={`Ver receta: ${r.title}`}
              >
                <figure>
                  <img src={r.img} alt={r.title} loading="lazy" />
                  <figcaption className="overlay">
                    <h3 className="title">{r.title}</h3>
                    <p className="meta">⏱️ {r.time} min · 👥 {r.servings}</p>
                  </figcaption>
                </figure>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de receta */}
      {modalRecipe && (
        <div className="recipe-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="recipe-modal-box">
            <img src={modalRecipe.img} alt={modalRecipe.title} className="recipe-modal-img" />
            <h2 id="modal-title">{modalRecipe.title}</h2>
            <p className="recipe-modal-meta">
              <span>⏱️ {modalRecipe.time} min</span>
              <span>👥 {modalRecipe.servings} porciones</span>
              <span>🍳 {modalRecipe.method}</span>
            </p>
            <h4>Ingredientes</h4>
            <ul className="recipe-ingredients">
              {Object.entries(modalRecipe.ingredients).map(([name, qty]) => (
                <li key={name}><strong>{name}</strong>: {qty}</li>
              ))}
            </ul>
            <div className="modal-actions">
              <button className="btn secondary" onClick={() => setModalRecipe(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Recetas;
