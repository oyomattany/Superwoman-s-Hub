import React, { useState } from 'react';
import {
  Perfume,
  ScentCategory,
  AdminSection,
  OrderRecord,
  OrderStatus,
  SiteImages,
} from '../types';
import { BrandConfig, BRAND_CONFIG } from '../config/brand';
import { formatPrice } from '../utils/format';
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveStoreSettingsToFirestore,
  updateOrderStatusInFirestore,
  uploadProductImage,
  logoutAdmin,
} from '../lib/firebase';
import { BRAND_MEDIA_LIBRARY } from '../utils/adminStorage';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Phone,
  MessageCircle,
  X,
  Eye,
  Check,
} from 'lucide-react';

interface AdminDashboardProps {
  currentSection: AdminSection;
  onNavigateSection: (section: AdminSection) => void;
  perfumes: Perfume[];
  orders: OrderRecord[];
  brandConfig: BrandConfig;
  siteImages: SiteImages;
  adminEmail?: string | null;
  onLogout: () => void;
  onViewStore: () => void;
  showToast: (msg: string) => void;
}

const CATEGORIES_LIST: ScentCategory[] = [
  'Sweet & Fruity',
  'Fresh & Clean',
  'Warm & Sensual',
  'Floral',
  'Unisex',
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentSection,
  onNavigateSection,
  perfumes,
  orders,
  brandConfig,
  adminEmail,
  onLogout,
  onViewStore,
  showToast,
}) => {
  // Product Filter State
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Perfume | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Product Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: ScentCategory;
    price: number;
    description: string;
    vibe: string;
    image: string;
    sizes: { id: string; name: string; price?: number }[];
    stockStatus: 'in_stock' | 'limited' | 'preorder' | 'out_of_stock';
    featured: boolean;
  }>({
    name: '',
    category: 'Sweet & Fruity',
    price: 3000,
    description: '',
    vibe: '',
    image: '/product-placeholder.svg',
    sizes: [
      { id: '3ml', name: '3ml Roll-on', price: 2000 },
      { id: '6ml', name: '6ml Roll-on', price: 3000 },
      { id: '12ml', name: '12ml Roll-on', price: 5500 },
    ],
    stockStatus: 'in_stock',
    featured: false,
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<BrandConfig>({
    ...BRAND_CONFIG,
    ...brandConfig,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Orders Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Sync settingsForm when brandConfig changes
  React.useEffect(() => {
    setSettingsForm((prev) => ({
      ...prev,
      ...brandConfig,
    }));
  }, [brandConfig]);

  // Metric calculations
  const totalProducts = perfumes.length;
  const inStockCount = perfumes.filter(
    (p) => p.stockStatus === 'in_stock' || p.stockStatus === 'limited'
  ).length;
  const outOfStockCount = perfumes.filter(
    (p) => p.stockStatus === ('out_of_stock' as any)
  ).length;
  const featuredCount = perfumes.filter((p) => p.featured).length;

  // Filtered Products
  const filteredPerfumes = perfumes.filter((perfume) => {
    const matchesSearch =
      perfume.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      perfume.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || perfume.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'all') return true;
    return order.status === orderStatusFilter;
  });

  // Handle Logout
  const handleSignOut = async () => {
    try {
      await logoutAdmin();
      onLogout();
      showToast('Signed out successfully.');
    } catch (err) {
      console.error('Logout error:', err);
      onLogout();
    }
  };

  // Open Add Product Modal
  const handleOpenAddProduct = () => {
    setEditingPerfume(null);
    setFormData({
      name: '',
      category: 'Sweet & Fruity',
      price: 3000,
      description: '',
      vibe: '',
      image: '/product-placeholder.svg',
      sizes: [
        { id: '3ml', name: '3ml Roll-on', price: 2000 },
        { id: '6ml', name: '6ml Roll-on', price: 3000 },
        { id: '12ml', name: '12ml Roll-on', price: 5500 },
      ],
      stockStatus: 'in_stock',
      featured: false,
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (perfume: Perfume) => {
    setEditingPerfume(perfume);
    setFormData({
      name: perfume.name,
      category: perfume.category,
      price: perfume.price ?? 3000,
      description: perfume.description,
      vibe: perfume.vibe || '',
      image: perfume.image,
      sizes: perfume.sizes.length > 0 ? perfume.sizes : [
        { id: '3ml', name: '3ml Roll-on', price: 2000 },
        { id: '6ml', name: '6ml Roll-on', price: 3000 },
        { id: '12ml', name: '12ml Roll-on', price: 5500 },
      ],
      stockStatus: perfume.stockStatus as any,
      featured: perfume.featured,
    });
    setIsProductModalOpen(true);
  };

  // Image Upload handler for product form
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
      showToast('Product photo uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Could not upload photo. Please try another image.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Product to Firestore
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSavingProduct(true);
    try {
      await saveProductToFirestore({
        id: editingPerfume?.id,
        name: formData.name.trim(),
        slug: editingPerfume?.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        price: Number(formData.price),
        description: formData.description.trim(),
        vibe: formData.vibe.trim(),
        image: formData.image,
        sizes: formData.sizes,
        stockStatus: formData.stockStatus as any,
        featured: formData.featured,
        createdAt: editingPerfume?.createdAt || new Date().toISOString(),
      });

      setIsProductModalOpen(false);
      showToast(editingPerfume ? 'Product updated successfully' : 'New perfume added to store');
    } catch (err) {
      console.error('Error saving product:', err);
      showToast('Failed to save product to database');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (perfume: Perfume) => {
    if (!window.confirm(`Are you sure you want to delete "${perfume.name}" from your catalog?`)) {
      return;
    }
    try {
      await deleteProductFromFirestore(perfume.id);
      showToast(`"${perfume.name}" deleted.`);
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast('Failed to delete product.');
    }
  };

  // Save Store Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveStoreSettingsToFirestore(settingsForm);
      showToast('Store settings updated and applied across website.');
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast('Failed to save store settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusInFirestore(orderId, status);
      showToast(`Order status marked as ${status}`);
    } catch (err) {
      console.error('Error updating order:', err);
      showToast('Failed to update order status');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-left">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#5A1224] text-[#FAF7F2] sticky top-0 z-40 border-b border-[#470C1B] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span
              className="text-lg sm:text-xl font-serif font-bold text-[#FAF7F2] tracking-wider"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              SUPERWOMAN'S HUB
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#FAF7F2]/15 text-[#E5C365] border border-[#E5C365]/30">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {adminEmail && (
              <span className="hidden md:inline-block text-xs text-[#E8D1C7] font-light truncate max-w-[200px]">
                {adminEmail}
              </span>
            )}

            <button
              onClick={onViewStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2]/10 hover:bg-[#FAF7F2]/20 text-xs text-[#FAF7F2] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#E5C365]" />
              <span className="hidden sm:inline">View Public Store</span>
            </button>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#721A30] hover:bg-[#8A243E] text-xs text-white font-medium transition-colors cursor-pointer border border-[#E5C365]/30"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-[#E5C365]" />
              <span>Logout</span>
            </button>
          </div>

        </div>

        {/* Secondary Sub-navigation Bar */}
        <div className="bg-[#480D1C] border-t border-[#611628] px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-2">
            
            <button
              onClick={() => onNavigateSection('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentSection === 'dashboard'
                  ? 'bg-[#5A1224] text-[#FAF7F2] border border-[#E5C365]/50 shadow-xs'
                  : 'text-[#D8BCB0] hover:text-white hover:bg-[#5A1224]/50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#E5C365]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onNavigateSection('products')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentSection === 'products'
                  ? 'bg-[#5A1224] text-[#FAF7F2] border border-[#E5C365]/50 shadow-xs'
                  : 'text-[#D8BCB0] hover:text-white hover:bg-[#5A1224]/50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#E5C365]" />
              <span>Products ({perfumes.length})</span>
            </button>

            <button
              onClick={() => onNavigateSection('orders')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentSection === 'orders'
                  ? 'bg-[#5A1224] text-[#FAF7F2] border border-[#E5C365]/50 shadow-xs'
                  : 'text-[#D8BCB0] hover:text-white hover:bg-[#5A1224]/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E5C365]" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => onNavigateSection('settings')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentSection === 'settings'
                  ? 'bg-[#5A1224] text-[#FAF7F2] border border-[#E5C365]/50 shadow-xs'
                  : 'text-[#D8BCB0] hover:text-white hover:bg-[#5A1224]/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-[#E5C365]" />
              <span>Store Settings</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* ========================================================= */}
        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {currentSection === 'dashboard' && (
          <div className="space-y-8">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-serif font-bold text-[#5A1224]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Store Overview
              </h1>
              <p className="text-xs text-[#6B5E57] mt-1">
                Real-time inventory summary and quick actions for Superwoman's Hub.
              </p>
            </div>

            {/* 4 Clean Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Total Products */}
              <div className="bg-white rounded-2xl border border-[#E8DDD2] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                    Total Products
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FAF3EC] text-[#5A1224] flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2825] mt-3">
                  {totalProducts}
                </div>
                <p className="text-[11px] text-[#8C7A6B] mt-1">
                  Active fragrance catalogue
                </p>
              </div>

              {/* Products In Stock */}
              <div className="bg-white rounded-2xl border border-[#E8DDD2] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                    In Stock
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#2E7D32] mt-3">
                  {inStockCount}
                </div>
                <p className="text-[11px] text-[#8C7A6B] mt-1">
                  Ready for customer orders
                </p>
              </div>

              {/* Out of Stock */}
              <div className="bg-white rounded-2xl border border-[#E8DDD2] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                    Out of Stock
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FDEDEC] text-[#B02A37] flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#842029] mt-3">
                  {outOfStockCount}
                </div>
                <p className="text-[11px] text-[#8C7A6B] mt-1">
                  Needs inventory restock
                </p>
              </div>

              {/* Featured Products */}
              <div className="bg-white rounded-2xl border border-[#E8DDD2] p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#8C7A6B]">
                    Featured
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#FFF9E6] text-[#C59E3F] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C59E3F] mt-3">
                  {featuredCount}
                </div>
                <p className="text-[11px] text-[#8C7A6B] mt-1">
                  Spotlighted on homepage
                </p>
              </div>

            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white rounded-2xl border border-[#E8DDD2] p-6 shadow-xs">
              <h2 className="text-base font-serif font-bold text-[#5A1224] mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={handleOpenAddProduct}
                  className="p-4 rounded-xl border border-[#D9C8BA] bg-[#FAF7F2] hover:bg-[#F2E8DC] hover:border-[#5A1224] text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#5A1224] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2D2825]">Add New Perfume</h3>
                  <p className="text-xs text-[#6B5E57] mt-0.5">
                    Upload photos, roll-on sizes, and prices
                  </p>
                </button>

                <button
                  onClick={() => onNavigateSection('orders')}
                  className="p-4 rounded-xl border border-[#D9C8BA] bg-[#FAF7F2] hover:bg-[#F2E8DC] hover:border-[#5A1224] text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2D2825]">Manage Orders</h3>
                  <p className="text-xs text-[#6B5E57] mt-0.5">
                    View customer cart orders & statuses
                  </p>
                </button>

                <button
                  onClick={() => onNavigateSection('settings')}
                  className="p-4 rounded-xl border border-[#D9C8BA] bg-[#FAF7F2] hover:bg-[#F2E8DC] hover:border-[#5A1224] text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#C59E3F] text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#2D2825]">Update Store Info</h3>
                  <p className="text-xs text-[#6B5E57] mt-0.5">
                    Change WhatsApp number & social links
                  </p>
                </button>
              </div>
            </div>

            {/* Recent Perfumes List Preview */}
            <div className="bg-white rounded-2xl border border-[#E8DDD2] p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-serif font-bold text-[#5A1224]">
                  Current Perfumes ({perfumes.length})
                </h2>
                <button
                  onClick={() => onNavigateSection('products')}
                  className="text-xs text-[#5A1224] hover:text-[#C59E3F] font-semibold underline cursor-pointer"
                >
                  Manage All Products →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {perfumes.slice(0, 6).map((perfume) => (
                  <div
                    key={perfume.id}
                    className="p-3 rounded-xl border border-[#E8DDD2] bg-[#FAF7F2] flex items-center gap-3"
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-[#2D2825] truncate">
                        {perfume.name}
                      </h4>
                      <p className="text-[11px] text-[#8C7A6B]">
                        {perfume.category} • {formatPrice(perfume.price)}
                      </p>
                      <span className={`inline-block text-[10px] font-medium px-2 py-0.2 rounded-full mt-1 ${
                        perfume.stockStatus === 'in_stock'
                          ? 'bg-[#E8F5E9] text-[#2E7D32]'
                          : 'bg-[#FDEDEC] text-[#842029]'
                      }`}>
                        {perfume.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: PRODUCTS MANAGEMENT */}
        {/* ========================================================= */}
        {currentSection === 'products' && (
          <div className="space-y-6">
            
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl sm:text-3xl font-serif font-bold text-[#5A1224]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Manage Products
                </h1>
                <p className="text-xs text-[#6B5E57] mt-1">
                  Add, update, or remove oil perfumes. All changes save directly to Firestore and show immediately on the Shop page.
                </p>
              </div>

              <button
                onClick={handleOpenAddProduct}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5A1224] hover:bg-[#721830] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#C59E3F]" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Filter and Search controls */}
            <div className="bg-white rounded-2xl border border-[#E8DDD2] p-4 flex flex-col sm:flex-row items-center gap-3 shadow-xs">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[#8C7A6B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or scent notes..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter by scent category"
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table / Cards */}
            <div className="bg-white rounded-2xl border border-[#E8DDD2] overflow-hidden shadow-xs">
              {filteredPerfumes.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Package className="w-12 h-12 mx-auto text-[#D9C8BA] mb-3" />
                  <h3 className="text-base font-serif font-bold text-[#5A1224]">
                    No Perfumes Found
                  </h3>
                  <p className="text-xs text-[#6B5E57] mt-1 max-w-sm mx-auto">
                    Try adjusting your search query or click "Add Product" to create your first oil perfume entry.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#2D2825]">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DDD2] text-[11px] uppercase tracking-wider text-[#6B5E57]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">Product</th>
                        <th className="py-3.5 px-4 font-semibold">Category</th>
                        <th className="py-3.5 px-4 font-semibold">Price</th>
                        <th className="py-3.5 px-4 font-semibold">Sizes</th>
                        <th className="py-3.5 px-4 font-semibold">Status</th>
                        <th className="py-3.5 px-4 font-semibold">Featured</th>
                        <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DDD2]">
                      {filteredPerfumes.map((perfume) => (
                        <tr key={perfume.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={perfume.image}
                                alt={perfume.name}
                                className="w-10 h-10 rounded-lg object-cover bg-[#F5EAE1] flex-shrink-0"
                              />
                              <div>
                                <span className="font-semibold text-sm text-[#2D2825] block">
                                  {perfume.name}
                                </span>
                                <span className="text-[11px] text-[#8C7A6B] line-clamp-1 max-w-[200px]">
                                  {perfume.vibe || perfume.description}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF3EC] text-[#5A1224] text-[11px] font-medium border border-[#E8DDD2]">
                              {perfume.category}
                            </span>
                          </td>

                          <td className="py-3 px-4 font-semibold text-[#5A1224]">
                            {formatPrice(perfume.price)}
                          </td>

                          <td className="py-3 px-4 text-[11px] text-[#6B5E57]">
                            {perfume.sizes.map((s) => s.name.split(' ')[0]).join(', ') || 'Standard'}
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              perfume.stockStatus === 'in_stock'
                                ? 'bg-[#E8F5E9] text-[#2E7D32]'
                                : perfume.stockStatus === 'limited'
                                ? 'bg-[#FFF9E6] text-[#B78103]'
                                : 'bg-[#FDEDEC] text-[#842029]'
                            }`}>
                              {perfume.stockStatus === 'in_stock' ? 'In Stock' : perfume.stockStatus === 'limited' ? 'Limited' : 'Out of Stock'}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            {perfume.featured ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C59E3F]">
                                <Sparkles className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-[11px] text-[#8C7A6B]">No</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(perfume)}
                                className="p-1.5 rounded-lg text-[#6B5E57] hover:text-[#5A1224] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(perfume)}
                                className="p-1.5 rounded-lg text-[#6B5E57] hover:text-[#C82333] hover:bg-[#FDEDEC] transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {currentSection === 'orders' && (
          <div className="space-y-6">
            
            <div>
              <h1
                className="text-2xl sm:text-3xl font-serif font-bold text-[#5A1224]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Customer Orders
              </h1>
              <p className="text-xs text-[#6B5E57] mt-1">
                WhatsApp orders and customer carts submitted on the store. Direct WhatsApp communication remains active.
              </p>
            </div>

            {/* Filter by status */}
            <div className="bg-white rounded-2xl border border-[#E8DDD2] p-4 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'New', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      orderStatusFilter === status
                        ? 'bg-[#5A1224] text-white'
                        : 'bg-[#FAF7F2] text-[#6B5E57] hover:bg-[#F2E8DC]'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status}
                  </button>
                ))}
              </div>

              <span className="text-xs text-[#8C7A6B]">
                Total: {filteredOrders.length}
              </span>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#E8DDD2] p-12 text-center shadow-xs">
                <ShoppingBag className="w-12 h-12 mx-auto text-[#D9C8BA] mb-3" />
                <h3 className="text-base font-serif font-bold text-[#5A1224]">
                  No Orders Yet
                </h3>
                <p className="text-xs text-[#6B5E57] mt-1 max-w-md mx-auto">
                  When customers click "Order via WhatsApp" in the cart, order records will appear here with customer details and purchased perfumes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#E8DDD2] p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-sm text-[#5A1224]">
                          #{order.orderId.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          order.status === 'New'
                            ? 'bg-[#E3F2FD] text-[#0D47A1]'
                            : order.status === 'Confirmed'
                            ? 'bg-[#FFF9E6] text-[#B78103]'
                            : order.status === 'Completed'
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#FDEDEC] text-[#842029]'
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] text-[#8C7A6B]">
                          {order.date}
                        </span>
                      </div>

                      {/* Items */}
                      <div className="text-xs text-[#2D2825]">
                        <ul className="list-disc list-inside space-y-0.5 text-[#544D48]">
                          {order.products.map((p, idx) => (
                            <li key={idx}>
                              <span className="font-medium text-[#2D2825]">{p.name}</span> ({p.size}) × {p.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {order.customerName && order.customerName !== 'Anonymous Customer' && (
                        <p className="text-xs text-[#6B5E57]">
                          Customer: <span className="font-medium text-[#2D2825]">{order.customerName}</span>
                          {order.phoneNumber && ` • ${order.phoneNumber}`}
                        </p>
                      )}
                    </div>

                    {/* Right side: Total and Status Actions */}
                    <div className="flex flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#E8DDD2]">
                      <div className="text-left md:text-right">
                        <span className="text-[11px] text-[#8C7A6B] block">Total Amount</span>
                        <span className="font-serif font-bold text-lg text-[#5A1224]">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#6B5E57]">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          aria-label={`Change status for order #${order.orderId.slice(-6)}`}
                          className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D9C8BA] text-xs font-medium focus:outline-none focus:border-[#5A1224]"
                        >
                          <option value="New">New</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: STORE SETTINGS */}
        {/* ========================================================= */}
        {currentSection === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-serif font-bold text-[#5A1224]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Store Settings
              </h1>
              <p className="text-xs text-[#6B5E57] mt-1">
                Update store contact channels and social media. When updated here, all WhatsApp order buttons and header links automatically update.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DDD2] p-6 sm:p-8 shadow-xs">
              <form onSubmit={handleSaveSettings} className="space-y-4">
                
                {/* Business Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.businessName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                {/* WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                      WhatsApp Number (International format for wa.me)
                    </label>
                    <input
                      type="text"
                      required
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                      placeholder="2347030881613"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                    />
                    <span className="text-[10px] text-[#8C7A6B]">
                      E.g. 2347030881613 (no plus signs or spaces)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                      Display WhatsApp / Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.displayWhatsapp || settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, displayWhatsapp: e.target.value, phone: e.target.value })}
                      placeholder="07030881613"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    placeholder="hello@superwomanshub.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                {/* Social Channels */}
                <div className="pt-2 border-t border-[#E8DDD2] space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#5A1224]">
                    Social Media Channels
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-[#47403B] mb-1">
                      Instagram Handle or URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.instagram}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                      placeholder="@superwomanshub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#47403B] mb-1">
                      Facebook Name or Page URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.facebook}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                      placeholder="Superwoman's Hub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#47403B] mb-1">
                      TikTok Handle or URL
                    </label>
                    <input
                      type="text"
                      value={settingsForm.tiktok}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tiktok: e.target.value })}
                      placeholder="@superwomanshub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full py-3 px-4 rounded-full bg-[#5A1224] hover:bg-[#721830] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {isSavingSettings ? 'Saving Settings...' : 'Save Settings'}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 text-left shadow-2xl border border-[#E8DDD2] my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DDD2] mb-5">
              <h2 className="text-xl font-serif font-bold text-[#5A1224]">
                {editingPerfume ? 'Edit Perfume' : 'Add New Perfume'}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-[#6B5E57] hover:text-[#5A1224] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Perfume Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pink Chiffon"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ScentCategory })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Base Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                    Stock Status
                  </label>
                  <select
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="limited">Limited Quantity</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="preorder">Pre-order</option>
                  </select>
                </div>
              </div>

              {/* Scent Vibe / Aura */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                  Scent Aura / Vibe
                </label>
                <input
                  type="text"
                  value={formData.vibe}
                  onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                  placeholder="e.g. Soft, sweet vanilla & floral charm"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1">
                  Description & Fragrance Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the aromatic blend, long-lasting oil concentration, and mood..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9C8BA] text-xs focus:outline-none focus:border-[#5A1224]"
                />
              </div>

              {/* Image Upload & Preview */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#47403B] mb-1.5">
                  Product Image
                </label>
                
                <div className="flex items-center gap-4">
                  {/* Thumbnail Preview */}
                  <div className="relative w-16 h-16 rounded-xl border border-[#D9C8BA] overflow-hidden bg-[#FAF7F2] flex-shrink-0">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload button & selector */}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#F2E8DC] border border-[#D9C8BA] text-xs text-[#5A1224] font-medium cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                      />
                    </label>

                    {/* Or choose from Authentic library */}
                    <div className="flex items-center gap-1 overflow-x-auto pt-1">
                      {BRAND_MEDIA_LIBRARY.map((media) => (
                        <button
                          key={media.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, image: media.url })}
                          className={`w-7 h-7 rounded-md overflow-hidden border flex-shrink-0 cursor-pointer ${
                            formData.image === media.url ? 'ring-2 ring-[#5A1224] border-transparent' : 'border-[#E8DDD2]'
                          }`}
                          title={media.name}
                        >
                          <img src={media.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-[#5A1224] focus:ring-[#5A1224]"
                />
                <label htmlFor="featured-checkbox" className="text-xs text-[#2D2825] font-medium cursor-pointer">
                  Feature this perfume on the homepage Popular Scents section
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-[#E8DDD2] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#6B5E57] hover:text-[#2D2825] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-full bg-[#5A1224] hover:bg-[#721830] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? 'Saving...' : editingPerfume ? 'Save Changes' : 'Add Perfume'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
