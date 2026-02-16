import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ShoppingCart, Store, Leaf } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)'
        }}
      />
      <div className="max-w-4xl w-full relative z-10">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl mb-2">KitchenGarden</h1>
          <p className="text-xl text-gray-600">Fresh vegetables delivered to your doorstep</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <ShoppingCart className="w-10 h-10 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl text-center mb-4">I'm a Buyer</h2>
              <p className="text-gray-600 text-center mb-6">
                Browse fresh vegetables, add to cart, and get them delivered
              </p>
              <div className="space-y-3">
                <Link to="/buyer/login" className="block">
                  <Button className="w-full" size="lg">
                    Login as Buyer
                  </Button>
                </Link>
                <Link to="/buyer/register" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Register as Buyer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Store className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl text-center mb-4">I'm a Seller</h2>
              <p className="text-gray-600 text-center mb-6">
                List your fresh produce and reach more customers
              </p>
              <div className="space-y-3">
                <Link to="/seller/login" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                    Login as Seller
                  </Button>
                </Link>
                <Link to="/seller/register" className="block">
                  <Button variant="outline" className="w-full" size="lg">
                    Register as Seller
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}