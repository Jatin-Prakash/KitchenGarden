import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';

const VEGETABLE_OPTIONS = [
  { name: 'Tomato', calories: 18, image: 'https://images.unsplash.com/photo-1560433802-62c9db426a4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHRvbWF0b2VzJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NzExNDg2MzR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Carrot', calories: 41, image: 'https://images.unsplash.com/photo-1757332914679-0906a57881e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGNhcnJvdHMlMjBvcmdhbmljfGVufDF8fHx8MTc3MTE1MTU1MXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Spinach', calories: 23, image: 'https://images.unsplash.com/photo-1653842648037-2e449847a78d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGluYWNoJTIwbGVhZnklMjBncmVlbnN8ZW58MXx8fHwxNzcxMjU4MzgzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Potato', calories: 77, image: 'https://images.unsplash.com/photo-1744659751904-3b2e5c095323?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHBvdGF0byUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzcxMjU4MzgzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Onion', calories: 40, image: 'https://images.unsplash.com/photo-1543590540-d4f212ad97ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBvbmlvbnMlMjBmcmVzaHxlbnwxfHx8fDE3NzEyMTUzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { name: 'Broccoli', calories: 34, image: 'https://images.unsplash.com/photo-1757332334626-8dadb145540d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9jY29saSUyMGZyZXNoJTIwdmVnZXRhYmxlfGVufDF8fHx8MTc3MTIwODY0MXww&ixlib=rb-4.1.0&q=80&w=1080' },
];

export default function SellerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    discount: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/seller/login');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = () => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const myProducts = allProducts.filter((p: Product) => p.sellerId === user?.id);
    setProducts(myProducts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.quantity) {
      toast.error('Please fill all required fields');
      return;
    }

    const vegData = VEGETABLE_OPTIONS.find(v => v.name === formData.name);
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');

    if (editingProduct) {
      const updatedProducts = allProducts.map((p: Product) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              quantity: parseFloat(formData.quantity),
              unit: formData.unit,
              discount: formData.discount ? parseFloat(formData.discount) : undefined,
              calories: vegData?.calories || 0,
              image: vegData?.image || '',
            }
          : p
      );
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        calories: vegData?.calories || 0,
        image: vegData?.image || '',
        sellerId: user!.id,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
      };
      allProducts.push(newProduct);
      localStorage.setItem('products', JSON.stringify(allProducts));
      toast.success('Product added successfully');
    }

    loadProducts();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      quantity: '',
      unit: 'kg',
      discount: '',
    });
    setEditingProduct(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit,
      discount: product.discount?.toString() || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    const allProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    loadProducts();
    toast.success('Product deleted successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1611511449908-4835bf24a62c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwZ2FyZGVuJTIwdmVnZXRhYmxlcyUyMGhlcmJzfGVufDF8fHx8MTc3MTI1ODY3MHww&ixlib=rb-4.1.0&q=80&w=1080)'
        }}
      />
      <div className="container mx-auto p-4 max-w-6xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl mb-1">Seller Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="mb-6">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogDescription>
                  {editingProduct ? 'Update product details' : 'Add a new vegetable to your inventory'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Vegetable</Label>
                  <Select
                    value={formData.name}
                    onValueChange={(value) => setFormData({ ...formData, name: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vegetable" />
                    </SelectTrigger>
                    <SelectContent>
                      {VEGETABLE_OPTIONS.map((veg) => (
                        <SelectItem key={veg.name} value={veg.name}>
                          {veg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Price per {formData.unit}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="piece">Piece</SelectItem>
                        <SelectItem value="bunch">Bunch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    {editingProduct ? 'Update' : 'Add'} Product
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
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
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      {product.discount}% OFF
                    </span>
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
                            ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products added yet</p>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}