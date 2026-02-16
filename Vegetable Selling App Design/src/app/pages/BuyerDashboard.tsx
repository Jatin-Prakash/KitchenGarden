import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { LogOut, ShoppingCart, Plus, Minus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';

export default function BuyerDashboard() {
  const { user, logout } = useAuth();
  const { addToCart, items } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/buyer/login');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(allProducts.filter((p: Product) => p.quantity > 0));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleQuantityChange = (productId: string, value: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, value),
    }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} ${product.unit} available`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`Added ${quantity} ${product.unit} of ${product.name} to cart`);
    setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)',
        }}
      />
      <div className="container mx-auto p-4 max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl mb-1">Fresh Vegetables</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/buyer/cart')}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="ml-2 bg-blue-600">{cartItemCount}</Badge>
              )}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search vegetables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const quantity = quantities[product.id] || 1;
            const finalPrice = product.discount
              ? product.price * (1 - product.discount / 100)
              : product.price;

            return (
              <Card key={product.id}>
                <CardHeader className="p-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle>{product.name}</CardTitle>
                    {product.discount && (
                      <Badge className="bg-red-500">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p className="flex justify-between">
                      <span>Price:</span>
                      <span>
                        {product.discount ? (
                          <>
                            <span className="line-through mr-2">₹{product.price}</span>
                            <span className="text-green-600">
                              ₹{finalPrice.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          `₹${product.price}`
                        )}
                        /{product.unit}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span>Available:</span>
                      <span>{product.quantity} {product.unit}</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Calories:</span>
                      <span>{product.calories} per 100g</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(product.id, parseInt(e.target.value) || 1)
                      }
                      className="w-20 text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(product.id, quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">{product.unit}</span>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart - ₹{(finalPrice * quantity).toFixed(2)}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No vegetables found matching your search' : 'No vegetables available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}