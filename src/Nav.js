import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Commerce.css";

const Nav = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/store/categories/")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  return (
    <nav className="main_nav bg-dark text-white position-relative">
      {/* 🔥 HOVER WRAPPER */}
      
      <div
        className="nav-hover-wrapper"
        onMouseLeave={() => setActiveCategory(null)}
      >
        <ul className="nav-list d-flex justify-content-around p-3">
          <span>ALL Categories</span>
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="nav-item"
              onMouseEnter={() => setActiveCategory(cat)}
            >
              <NavLink to={`/store/${cat.slug}`} className="nav_link text-white">
                {cat.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* 🔥 ONE FIXED DROPDOWN */}
        {activeCategory?.children?.length > 0 && (
          <div className="product-dropdown">
            {activeCategory.children.map((sub) => (
              <div key={sub.id} className="subcategory-block">
                <h6 className="subcategory-title">{sub.name}</h6>

                {sub.children?.length > 0 && (
                  <ul className="text-red">
                    {sub.children.map((child) => (
                      <li className="text-success" key={child.id}>
                        <NavLink
                          to={`/store/${child.slug}`}
                          className="dropdown-link"
                          onClick={() => setActiveCategory(null)}
                        >
                          {child.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;