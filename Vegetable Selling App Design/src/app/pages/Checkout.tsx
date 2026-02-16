import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalCalories, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'buyer') {
      navigate('/buyer/login');
      return;
    }
    if (items.length === 0 && !orderPlaced) {
      navigate('/buyer/cart');
    }
  }, [user, items, navigate, orderPlaced]);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    // Create order (would be saved to AWS DB in production)
    const order = {
      id: Date.now().toString(),
      buyerId: user!.id,
      items: items,
      totalPrice: getTotalPrice(),
      totalCalories: getTotalCalories(),
      paymentMethod,
      address,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage (replace with AWS DB)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Update product quantities
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = products.map((product: any) => {
      const cartItem = items.find(item => item.id === product.id);
      if (cartItem) {
        return {
          ...product,
          quantity: product.quantity - cartItem.quantity,
        };
      }
      return product;
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts));

    clearCart();
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  const totalPrice = getTotalPrice();
  const totalCalories = getTotalCalories();
  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const finalTotal = totalPrice + deliveryFee;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)'
          }}
        />
        <Card className="max-w-md w-full relative z-10">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been confirmed and will be delivered soon.
            </p>
            <div className="space-y-2 mb-6">
              <Button
                className="w-full"
                onClick={() => navigate('/buyer/dashboard')}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/buyer/cart')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-3xl mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user?.name} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={user?.phone} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Delivery Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your complete delivery address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value: 'online' | 'cod') => setPaymentMethod(value)}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <div>
                          <p>Online Payment</p>
                          <p className="text-sm text-gray-600">Pay using UPI, Cards, Wallet</p>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-green-600" />
                        <div>
                          <p>Cash on Delivery</p>
                          <p className="text-sm text-gray-600">Pay when you receive</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    const finalPrice = item.discount
                      ? item.price * (1 - item.discount / 100)
                      : item.price;
                    return (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x {item.quantity} {item.unit}
                        </span>
                        <span>₹{(finalPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {totalPrice < 500 && (
                    <p className="text-xs text-gray-500">
                      Add ₹{(500 - totalPrice).toFixed(2)} more for free delivery
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Calories</span>
                    <span>{totalCalories} cal</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Total</span>
                  <span className="text-2xl">₹{finalTotal.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By placing order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}