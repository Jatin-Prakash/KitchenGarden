import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalCalories } = useCart();

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/buyer/login');
    }
  }, [user, navigate]);

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/buyer/checkout');
  };

  const totalPrice = getTotalPrice();
  const totalCalories = getTotalCalories();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)'
        }}
      />
      <div className="container mx-auto p-4 max-w-4xl relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate('/buyer/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/buyer/dashboard')}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const finalPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;

                return (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">
                                {item.calories} cal per 100g
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  handleUpdateQuantity(
                                    item.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-16 text-center"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateQuantity(item.id, item.quantity + 1)
                                }
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                              <span className="text-sm text-gray-600">{item.unit}</span>
                            </div>

                            <div className="text-right">
                              {item.discount ? (
                                <div>
                                  <p className="text-sm text-gray-500 line-through">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                  <p className="text-green-600">
                                    ₹{(finalPrice * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                              ) : (
                                <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Items</span>
                      <span>{items.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Calories</span>
                      <span>{totalCalories} cal</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="text-2xl">₹{totalPrice.toFixed(2)}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/buyer/dashboard')}
                  >
                    Add More Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}