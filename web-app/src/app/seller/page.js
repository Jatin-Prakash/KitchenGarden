export default function SellerPage() {
  return (
    <main className="container" style={{padding:"18px 0"}}>
      <h2>Seller</h2>
      <p className="small">
        Starter placeholder. Add Supabase OTP login, then call GraphQL mutation <code>createProduct</code>
        with JWT auth to create products.
      </p>
      <div className="card">
        <h3>Next steps</h3>
        <ol>
          <li>Implement phone OTP using Supabase JS</li>
          <li>Send JWT in <code>Authorization: Bearer</code> header to backend</li>
          <li>Use GraphQL mutations to create/update stock</li>
        </ol>
      </div>
    </main>
  );
}
