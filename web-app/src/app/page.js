import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section style={{
        minHeight: "85vh",
        backgroundImage: "linear-gradient(rgba(0,80,0,.55), rgba(0,80,0,.55)), url('/kitchenGarden.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center"
      }}>
        <div className="container">
          <h1 style={{color:"white", fontSize: 52, lineHeight: 1.05, margin:0}}>Kitchen Garden</h1>
          <p style={{color:"white", fontSize: 18, maxWidth: 640}}>
            Fresh from local sellers to your home. Login with phone OTP and start buying or selling today.
          </p>
          <div style={{display:"flex", gap: 12, marginTop: 18, flexWrap:"wrap"}}>
            <Link className="btn" href="/buyer">Shop as Buyer</Link>
            <Link className="btn secondary" href="/seller">Sell as Seller</Link>
          </div>
          <p className="small" style={{color:"rgba(255,255,255,.85)", marginTop: 10}}>
            Demo starter: product listing + calories estimate + Stripe checkout session creation.
          </p>
        </div>
      </section>

      <section className="container" style={{padding:"26px 0"}}>
        <div className="grid">
          <div className="card">
            <h3>Seller portal</h3>
            <ul>
              <li>Phone OTP login (Supabase)</li>
              <li>Add product: image, price, quantity</li>
              <li>Update live stock quantity</li>
            </ul>
          </div>
          <div className="card">
            <h3>Buyer portal</h3>
            <ul>
              <li>Browse and add to cart</li>
              <li>Calories estimate per quantity</li>
              <li>Stripe Checkout payment</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
