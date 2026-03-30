import React, { useEffect, useState } from "react";
import { Carousel } from "bootstrap";
import "./Commerce.css";
import phoneTwo from "./asset/iphseventeen.jpeg"
import negotiate from "./asset/negotiation.jpeg";
import negotiates from "./asset/acura.jpg";
import negotiateOne from "./asset/range.jpg";
import negotiateTwo from "./asset/rangeRov.jpg";
import negotiateThree from "./asset/toyota.jpg";
import mount from "./asset/mountain.jpg";
import mountOne from "./asset/mountTwo.jpg";
import cloth from "./asset/shrt.webp";


const cardWord = ["Amazing Phones & Tablet", "From KOYa Stores", "Order @ your Convenient ⌚"];
const cardWordOne = ["Chill with Netflix", "Movie Box & Youtube", "📺 🍿"];
const cardWordTwo = ["ORDER @ KY STORES", "MEN & WOMEN OUTFIT", "NIKE AND PUMA FOOTWEARS"];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [wantedProduct , setWantedProduct] = useState([]);


  useEffect(() =>{
    const wantedProductIds = [46,48,49,44,28,10,55,56,57,60,61,62,];

    Promise.all(
      wantedProductIds.map(id =>
        fetch(`${process.env.REACT_APP_API_URL}/store/products/${id}/`)
        .then(res => res.json())
        .then(data => data.data)
      )
    ).then(setWantedProduct);
  },[]);

  

  // 🔹 Fetch products
  useEffect(() => {
    const productIds = [1, 11, 7, 3, 5, 6];

    Promise.all(
      productIds.map(id =>
        fetch(`${process.env.REACT_APP_API_URL}/store/products/${id}/`)
          .then(res => res.json())
          .then(data => data.data)
      )
    ).then(setProducts);
  }, []);

  // 🔹 Rotate card text (match carousel timing)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % cardWord.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔹 Bootstrap carousel init
  useEffect(() => {
    const carouselElement = document.querySelector("#carouselExampleSlidesOnly");
    if (carouselElement) {
      new Carousel(carouselElement, {
        interval: 3000,
        ride: "carousel",
      });
    }
  }, []);

  return (
    <div className="home " id="homes">
      <div
        className="bg-dark d-flex gap-5"
        style={{ height: "470px", border: "thick solid white", marginTop: "10px" }}
      >
        {/* 🔹 Carousel */}
        <div id="carouselExampleSlidesOnly" className="carousel slide">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={mount} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={mountOne} className="img d-block w-100" alt="iphon" />
            </div>

            <div className="carousel-item active">
              <img src={negotiate} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={negotiates} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={negotiateOne} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={negotiateTwo} className="img d-block w-100" alt="iphones" />
            </div>

             <div className="carousel-item active">
              <img src={negotiateThree} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={phoneTwo} className="img d-block w-100" alt="iphones" />
            </div>

            <div className="carousel-item active">
              <img src={cloth} className="img d-block w-100" alt="iphones" />
            </div>

          </div>
        </div>

        {/* 🔹 Text Cards */}
        <div className="card bg-dark">
          <div className="d-flex gap-4 ">
            <div
              style={{
                width: "213px",
                height: "195px",
                background: "black",
                textAlign: "center",
                fontSize: "30px",
                color: "green",
                alignContent: "center"
              }}
            >
              <i>
                Nigerians <br />
                Love <br />
                Fashions
              </i>
            </div>

            <div
              style={{
                width: "213px",
                height: "195px",
                background: "gold",
                textAlign: "center",
                fontSize: "30px",
                fontWeight: 700,
                alignContent: "center"
              }}
            >
              <i>{cardWord[index]}</i>
            </div>
          </div>

          <div className="d-flex gap-4 mt-3">
            <div
              style={{
                width: "213px",
                height: "195px",
                background: "green",
                textAlign: "center",
                fontSize: "30px",
                fontWeight: 700,
                alignContent: "center"
              }}
            >
              {cardWordOne[index]}
            </div>

            <div
              style={{
                width: "213px",
                height: "195px",
                background: "pink",
                textAlign: "center",
                fontSize: "30px",
                fontWeight: 700,
                alignContent: "center"
              }}
            >
              {cardWordTwo[index]}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Apple Product Row */}
      <div className="homeSecond">
        <div className="product_name d-flex"> 
          <h3>
            <i>APPLE PHONES AND TABLET</i>
          </h3>
          <h4>See all  </h4>
        </div>
        <div className="homeSeconds d-flex">
          {products.map((item, i) => (
            <div key={i} className="imageContainer">
              <img
                src={`http://127.0.0.1:8000${item.image}`}
                alt={item.name}
                style={{ width: "190px", height: "150px" }}
              />
              <p>{item.name}</p>
            </div>
          ))}
        </div>
        
      </div>

      <div className="homeThird ">
        <div className="container_name d-flex">
          <h3>
            <i>TOP QUALITY PRODUCTS</i>
          </h3>
          <h3>

            <i>See All</i>
          </h3>
        </div>
        <div className="container container_product ">
          {wantedProduct.map((items,i) => (
            <div key={i} className="imageContainers">
              <img className="w-100"
                src={`http://127.0.0.1:8000${items.image}`}
                alt={items.name}
                style={{ width: "190px", height: "150px" }}
              />
              <p>{items.name}</p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;