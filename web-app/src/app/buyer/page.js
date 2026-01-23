"use client";

import { useState } from "react";
import { request } from "graphql-request";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const GQL = API_BASE + "/graphql";

export default function BuyerPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [cart, setCart] = useState({}); // id -> qty

  async function load() {
    setError("");
    try {
      const q = `query { products { id name price quantityAvailable imageUrl } }`;
      const res = await request(GQL, q);
      setProducts(res.products || []);
    } catch (e) {
      setError(String(e));
    }
  }

  async function calories(name, qty) {
    const q = `query($productName:String!, $quantity:Int!){ caloriesEstimate(productName:$productName, quantity:$quantity){ low high unit } }`;
    return request(GQL, q, { productName: name, quantity: qty });
  }

  function inc(id) { setCart(c => ({...c, [id]: (c[id]||0)+1 })); }
  function dec(id) { setCart(c => ({...c, [id]: Math.max((c[id]||0)-1, 0) })); }

  return (
    <main className="container" style={{padding:"18px 0"}}>
      <h2>Buyer</h2>
      <p className="small">This page is a starter. Add Supabase OTP login + JWT to call protected endpoints.</p>
      <button className="btn" onClick={load}>Load products</button>
      {error && <p style={{color:"crimson"}}>{error}</p>}
      <div className="grid" style={{marginTop: 14}}>
        {products.map(p => (
          <div className="card" key={p.id}>
            <div style={{display:"flex", justifyContent:"space-between", gap: 12}}>
              <div>
                <b>{p.name}</b>
                <div className="small">₹ {p.price} • Stock: {p.quantityAvailable}</div>
              </div>
              <div style={{display:"flex", gap: 8, alignItems:"center"}}>
                <button className="btn secondary" onClick={() => dec(p.id)}>-</button>
                <b>{cart[p.id] || 0}</b>
                <button className="btn" onClick={() => inc(p.id)}>+</button>
              </div>
            </div>

            <CaloriesPreview productName={p.name} quantity={cart[p.id] || 0} caloriesFn={calories} />
          </div>
        ))}
      </div>
    </main>
  );
}

function CaloriesPreview({ productName, quantity, caloriesFn }) {
  const [txt, setTxt] = useState("");
  async function calc() {
    if (quantity <= 0) return setTxt("");
    const res = await caloriesFn(productName, quantity);
    setTxt(`${res.caloriesEstimate.low}-${res.caloriesEstimate.high} ${res.caloriesEstimate.unit}`);
  }
  return (
    <div style={{marginTop: 12}}>
      <button className="btn secondary" onClick={calc} disabled={quantity<=0}>
        Show calories
      </button>
      {txt && <div className="small" style={{marginTop: 8}}>Estimated: <b>{txt}</b></div>}
    </div>
  );
}
