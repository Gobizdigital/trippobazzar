import { Link, useLocation, useNavigate } from "react-router-dom";
import React from "react";

export default function TransitionLink({ to, className, children, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleClick = async (e) => {
    e.preventDefault();
    const body = document.querySelector("body");
    if (location.pathname !== to) {
      if (body) {
        body.classList.add("page-transition");
        await sleep(350);
        window.scrollTo(0, 0);
        navigate(to);
        await sleep(350);
        body.classList.remove("page-transition");
      }
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
