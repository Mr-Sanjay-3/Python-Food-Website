import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  ShoppingBag, 
  RefreshCw, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const TRACKING_STEPS = [
  { key: 'PENDING', label: 'Order Placed', desc: 'Restaurant has received your order' },
  { key: 'PREPARING', label: 'Preparing Food', desc: 'Chef is cooking your fresh meal' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Delivery partner is on the way' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Food delivered! Enjoy your meal' },
];

const Track = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryOrderId = searchParams.get('orderId');

  const [orderIdInput, setOrderIdInput] = useState(
    queryOrderId || localStorage.getItem('latestOrderId') || '1'
  );
  const [activeOrderId, setActiveOrderId] = useState(
    queryOrderId || localStorage.getItem('latestOrderId') || '1'
  );

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch Order details from Django API
  const fetchOrderStatus = async (id, isManual = false) => {
    if (!id) return;
    if (isManual) setIsRefreshing(true);

    try {
      const url = (
        import.meta.env.VITE_API_URI ||
        import.meta.env.API_URI ||
        API_BASE_URL ||
        'https://foodweb-aaoi.onrender.com'
      ).replace(/\/+$/, '');
      const res = await fetch(`${url}/api/orders/${id}/`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data.order);
      setError('');
    } catch (err) {
      setError(err.message || 'Could not fetch order details');
      setOrder(null);
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  // Initial load when activeOrderId changes
  useEffect(() => {
    setLoading(true);
    fetchOrderStatus(activeOrderId);
  }, [activeOrderId]);

  // Auto-polling: checks Django backend every 4 seconds for status changes
  useEffect(() => {
    if (!activeOrderId) return;
    const interval = setInterval(() => {
      fetchOrderStatus(activeOrderId);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeOrderId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (orderIdInput.trim()) {
      setActiveOrderId(orderIdInput.trim());
      setSearchParams({ orderId: orderIdInput.trim() });
    }
  };

  // Calculate current step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PREPARING':
        return 1;
      case 'OUT_FOR_DELIVERY':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Title & Search Bar */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Live <span className="text-[#F54748]">Order Tracking</span>
          </h1>
          <p className="text-gray-400 text-sm">
            Enter your Order ID to see real-time updates from our kitchen & delivery team.
          </p>

          {/* Order ID Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center justify-center gap-2 max-w-md mx-auto pt-4"
          >
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">
                #
              </span>
              <input
                type="text"
                placeholder="Enter your order ID etc"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full bg-[#161616] border border-white/15 rounded-xl py-2.5 pl-8 pr-4 text-white placeholder-gray-500 text-sm focus:border-[#F54748] outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#F54748] hover:bg-[#e03839] text-white font-semibold text-sm py-2.5 px-5 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
            >
              Track
            </button>
          </form>
        </div>

        {/* Live Indicator Header */}
        <div className="flex justify-between items-center bg-[#141414] border border-white/10 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2">
          Refresh 
          </div>

          <button
            onClick={() => fetchOrderStatus(activeOrderId, true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && !order && (
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-12 text-center text-gray-400 space-y-3">
            <RefreshCw size={32} className="animate-spin mx-auto text-[#F54748]" />
            <p className="text-sm">Fetching order status from server...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-3xl p-8 text-center space-y-3">
            <AlertCircle size={36} className="mx-auto text-red-400" />
            <h3 className="text-lg font-bold text-red-200">Order Not Found</h3>
            <p className="text-xs text-gray-300 max-w-sm mx-auto">
              We couldn't find an order with ID #{activeOrderId}. Please check your order number or place a new order.
            </p>
            <Link
              to="/orderfood"
              className="inline-flex items-center gap-1.5 bg-[#F54748] text-white text-xs font-bold py-2.5 px-4 rounded-xl hover:bg-[#e03839] transition-all"
            >
              <span>Browse Menu & Order</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Main Order Details & Stepper */}
        {order && (
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl">
            {/* Top Bar: Order ID & Badge */}
            <div className="flex flex-wrap justify-between items-center gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                  Tracking Order
                </span>
                <h2 className="text-2xl font-extrabold text-white">
                  Order #{order.id}
                </h2>
                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Clock size={12} /> Placed at: {order.created_at}
                </span>
              </div>

              {/* Status Badge */}
              <div className="shrink-0">
                {isCancelled ? (
                  <span className="bg-red-900/60 text-red-300 border border-red-700/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                    Cancelled
                  </span>
                ) : (
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-900/50 text-green-300 border-green-600/50'
                        : order.status === 'OUT_FOR_DELIVERY'
                        ? 'bg-blue-900/50 text-blue-300 border-blue-600/50'
                        : order.status === 'PREPARING'
                        ? 'bg-amber-900/50 text-amber-300 border-amber-600/50'
                        : 'bg-zinc-800 text-yellow-300 border-yellow-600/50'
                    }`}
                  >
                    {order.status_display || order.status}
                  </span>
                )}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {!isCancelled && (
              <div className="py-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-2 relative">
                        {/* Circle Indicator */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                            isDone
                              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                              : isCurrent
                              ? 'bg-[#F54748] text-white shadow-lg shadow-[#F54748]/50 ring-4 ring-[#F54748]/30 animate-pulse'
                              : 'bg-zinc-800 text-gray-400 border border-white/10'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={20} /> : idx + 1}
                        </div>

                        {/* Step Details */}
                        <div>
                          <h4
                            className={`text-xs md:text-sm font-bold ${
                              isDone || isCurrent ? 'text-white' : 'text-gray-500'
                            }`}
                          >
                            {step.label}
                          </h4>
                          <p className="text-[11px] text-gray-400 hidden md:block mt-0.5 max-w-[130px]">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery Info & Ordered Items Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {/* Customer Info Card */}
              <div className="bg-[#1A1A1A] p-4 md:p-5 rounded-2xl border border-white/5 space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                  Delivery Destination
                </h3>
                <div className="space-y-2 text-sm text-gray-200">
                  <div className="flex items-center gap-2">
                    <User size={15} className="text-[#F54748]" />
                    <span className="font-semibold text-white">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={15} className="text-[#F54748]" />
                    <span>{order.customer_phone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={15} className="text-[#F54748] shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300 leading-relaxed">
                      {order.customer_address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-[#1A1A1A] p-4 md:p-5 rounded-2xl border border-white/5 space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2">
                    Ordered Items
                  </h3>
                  <div className="flex items-start gap-2 text-sm">
                    <ShoppingBag size={15} className="text-[#FDC55E] shrink-0 mt-1" />
                    <p className="text-xs text-gray-200 leading-relaxed font-mono">
                      {order.items_summary}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-semibold">Total Paid:</span>
                  <span className="text-lg font-extrabold text-[#FDC55E]">
                    ₹{order.total_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
 );
};

export default Track;