import htm from 'https://unpkg.com/htm?module';
const html = htm.bind(React.createElement);
const { useState, useEffect } = React;

export const FarmerDashboard = ({ user }) => {
    const [crops, setCrops] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [activeTab, setActiveTab] = useState('all');
    const [ordersSubTab, setOrdersSubTab] = useState('pending');
    const [loading, setLoading] = useState(true);

    // Modal State
    const [editingCrop, setEditingCrop] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = async () => {
        try {
            const [c, o, r, a] = await Promise.all([
                window.cropService.getMyCrops(),
                window.orderService.getFarmerOrders(),
                window.reviewService.getFarmerReviews().catch(() => []),
                window.analyticsService.getFarmerAnalytics()
            ]);
            setCrops(c);
            setOrders(o);
            setReviews(r);
            setAnalytics(a);
        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.refreshDashboard = fetchData;
        return () => {
            delete window.refreshDashboard;
        };
    }, []);

    const handleDelete = async (id) => {
        if (await window.notifier.confirm('Are you sure you want to remove this listing?')) {
            try {
                await window.cropService.deleteCrop(id);
                window.notifier.showToast('Listing removed successfully');
                fetchData();
            } catch (e) {
                window.notifier.showToast(e.message, 'error');
            }
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await window.api.put(`/crops/${editingCrop._id}`, {
                cropName: editingCrop.cropName,
                price: editingCrop.price,
                quantity: editingCrop.quantity,
                expiryDate: editingCrop.expiryDate
            });
            window.notifier.showToast('✅ Crop updated successfully!');
            setEditingCrop(null);
            fetchData();
        } catch (err) {
            window.notifier.showToast(err.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Color Mapping Utility
    const getCropColor = (name, category) => {
        const lowerName = (name || '').toLowerCase();
        const lowerCat = (category || '').toLowerCase();
        if (lowerName.includes('mango') || lowerCat.includes('fruit')) return '#ffb300'; // Orange/Mango
        if (lowerName.includes('tomato') || lowerCat.includes('vegetable')) return '#e53935'; // Tomato Red
        if (lowerName.includes('rice') || lowerCat.includes('grains')) return '#fbc02d'; // Golden Rice
        return '#2e7d32'; // Default Garden Green
    };

    // Unified Icon Helper for High-End Agri-Visuals
    const getCropIcon = (name, category, size = 100) => {
        const lowerName = (name || '').toLowerCase();
        const lowerCat = (category || '').toLowerCase();
        const color = getCropColor(name, category);

        // SVG Definitions
        if (lowerName.includes('mango') || lowerCat.includes('fruit')) {
            return html`
                <div className="relative flex items-center justify-center pointer-events-none" style=${{ width: size, height: size }}>
                    <img src="img/fruits.jpg" alt="Fruit" className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_10px_20px_rgba(255,179,0,0.3)] transition-transform duration-700 group-hover:scale-110" />
                </div>`;
        }
        if (lowerName.includes('tomato') || lowerCat.includes('vegetable')) {
            return html`
                <div className="relative flex items-center justify-center pointer-events-none" style=${{ width: size, height: size }}>
                    <img src="img/vegetables.jpg" alt="Vegetables" className="w-[85%] h-[85%] object-contain filter drop-shadow-[0_10px_20px_rgba(229,57,53,0.3)] transition-transform duration-700 group-hover:scale-110" />
                </div>`;
        }
        if (lowerName.includes('rice') || lowerName.includes('basmati') || lowerCat.includes('rice') || lowerCat.includes('grains')) {
            return html`
                <div className="relative flex items-center justify-center pointer-events-none" style=${{ width: size, height: size }}>
                    <img src="img/rice_variety.jpg" alt="Rice Variety" className="w-[85%] h-[85%] object-cover rounded-full filter drop-shadow-[0_10px_20px_rgba(251,192,45,0.3)] transition-transform duration-700 group-hover:scale-110" />
                </div>`;
        }

        return html`<span>🌾</span>`;
    };

    if (loading) return html`
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    `;

    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

    return html`
        <div className="relative min-h-screen font-sans pb-20 overflow-x-hidden bg-[#fffcf5]">
            <!-- Split Background System -->
            <div className="fixed inset-0 z-0">

                <!-- Bottom Textured Layer (Aerial Crop-Row Depth) -->
                <div className="absolute inset-0 bg-[url('img/section1.png')] bg-cover bg-center opacity-[0.08] mix-blend-multiply"></div>
                
                <!-- Themed Radial Overlay for Center Contrast (Earth Depth) -->
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-[#dcedc8]/50 to-[#4e342e]/90"></div>
                
                <!-- Growing Plants Layer (Bottom) -->
                <div className="absolute bottom-0 left-0 right-0 h-[400px] opacity-[0.1] pointer-events-none" style=${{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80" fill="none" stroke="%232e7d32" stroke-width="1.5"><path d="M60 80c0-30 10-40 30-40m-30 40C60 50 50 40 30 40m30 40V20m0 0C60 10 70 0 90 0m-30 20C60 10 50 0 30 0"/></svg>')`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'bottom center',
            backgroundSize: '240px 160px',
            maskImage: 'linear-gradient(to top, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 20%, transparent 100%)'
        }}></div>

                <!-- Soil Texture Overlay -->
                <div className="absolute inset-0 opacity-[0.03]" style=${{
            backgroundImage: 'radial-gradient(circle, #4e342e 1px, transparent 1px)',
            backgroundSize: '40px 40px'
        }}></div>

            </div>

            <!-- Top Cinematic Backdrop (Only for Hero/Header area) -->
            <div className="absolute top-0 left-0 right-0 h-[500px] z-0 overflow-hidden">
                <div className="absolute inset-0 bg-[url('img/section1.png')] bg-cover bg-[position:center_35%] filter saturate-[1.1] scale-105"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e20]/80 via-[#2e7d32]/60 to-[#4caf50]/20"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#fffcf5]"></div>
            </div>


            <!-- Dashboard Content Layer -->
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-8">
                <!-- Hero Section (Immersive & Branded) -->
                <div className="relative h-72 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 group border border-white/20">
                    <img src="img/section2.png" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Farm backdrop" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1b5e20]/95 via-[#2e7d32]/50 to-transparent backdrop-blur-[1px] flex flex-col justify-center px-8 sm:px-12">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-8 h-[2px] bg-[#4caf50]"></span>
                                <span className="text-[#a5d6a7] font-black text-[10px] uppercase tracking-[0.4em]">Digital Agriculture Hub</span>
                            </div>
                            <h2 className="text-5xl font-extrabold text-white mb-3 leading-tight tracking-tighter">Welcome Back, ${user.name}!</h2>
                            <p className="text-white/90 text-lg mb-8 max-w-lg font-medium leading-relaxed">Nurturing growth and delivering fresh harvests through Earth-centered technology.</p>
                            <button onClick=${() => window.location.hash = '#/add-crop'} className="w-fit bg-[#2e7d32] text-white font-black py-4 px-10 rounded-2xl shadow-[0_20px_40px_rgba(46,125,50,0.3)] hover:shadow-[#2e7d32]/50 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 group/btn uppercase text-xs tracking-widest">
                                <span className="text-xl">+</span>
                                List New Harvest
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid (High Intensity Cards) -->
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    ${[
            { label: 'Total Revenue', value: `$${analytics?.totalRevenue?.toFixed(2) || '0.00'}`, icon: '💰', color: 'bg-[#2e7d32]', trend: 'Monthly Performance' },
            { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: '📦', color: 'bg-blue-600', trend: 'Orders Fulfilled' },
            { label: 'Pending Action', value: analytics?.pendingOrders || 0, icon: '⏳', color: 'bg-[#8d6e63]', trend: 'Requires Attention' },
            { label: 'Market Success', value: analytics?.deliveredOrders || 0, icon: '✅', color: 'bg-[#4caf50]', trend: 'Happy Customers' }
        ].map((stat, idx) => html`
                        <div key=${idx} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 hover:shadow-2xl hover:shadow-[#1b5e20]/10 transition-all duration-500 flex flex-col justify-between relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner text-2xl group-hover:scale-110 transition-transform">${stat.icon}</div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">${stat.label}</span>
                            </div>
                            <div className="relative z-10">
                                <div className="text-4xl font-black text-slate-800 tracking-tighter mb-1">${stat.value}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase opacity-60">${stat.trend}</div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 ${stat.color} opacity-[0.05] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
                        </div>
                    `)}
                </div>

                <!-- Tabs Navigation (Glassmorphic Blueprint) -->
                <div className="sticky top-4 z-50 flex flex-nowrap overflow-x-auto items-center gap-2 mb-12 bg-white/70 backdrop-blur-2xl p-2 rounded-[1.5rem] w-fit shadow-2xl border border-white/50 scrollbar-hide">
                    ${['all', 'orders', 'crop-analysis', 'my-harvests', 'customer-reviews'].map(tab => html`
                        <button 
                            key=${tab}
                            onClick=${() => setActiveTab(tab)}
                            className="px-8 py-3 rounded-xl font-black text-[10px] transition-all duration-300 capitalize tracking-widest whitespace-nowrap ${activeTab === tab ? 'bg-[#2e7d32] text-white shadow-lg' : 'text-[#2e7d32]/60 hover:bg-[#2e7d32]/5 hover:text-[#2e7d32]'}"
                        >
                            ${tab.replace('-', ' ')}
                            ${tab === 'orders' && pendingOrdersCount > 0 ? html`
                                <span className="ml-2 bg-[#8d6e63] text-white px-2 py-0.5 rounded-full text-[9px] shadow-sm">${pendingOrdersCount}</span>
                            ` : ''}
                        </button>
                    `)}
                </div>

                <!-- Content Sections -->
                <div className="space-y-24">
                    ${(activeTab === 'all' || activeTab === 'orders') && html`
                        <section id="orders-section" className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-10 bg-emerald-500 rounded-full"></div>
                                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Active Shipments</h3>
                                </div>
                                <div className="flex bg-slate-100/50 backdrop-blur-md rounded-2xl p-1.5 border border-slate-200 shadow-inner">
                                    <button onClick=${() => setOrdersSubTab('pending')} className="px-8 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${ordersSubTab === 'pending' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}">PENDING</button>
                                    <button onClick=${() => setOrdersSubTab('delivered')} className="px-8 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-widest ${ordersSubTab === 'delivered' ? 'bg-white text-emerald-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}">DELIVERED</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                ${orders.filter(o => o.status === (ordersSubTab === 'pending' ? 'pending' : 'delivered')).length === 0 ? html`
                                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                                        <div className="text-7xl mb-6 opacity-10">🌍</div>
                                        <p className="text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">Awaiting Market Activity...</p>
                                    </div>
                                ` : orders.filter(o => o.status === (ordersSubTab === 'pending' ? 'pending' : 'delivered')).map(order => html`
                                    <div key=${order._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 hover:shadow-2xl transition-all group flex flex-col relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform"></div>
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div className="max-w-[65%]">
                                                <span className="text-[9px] font-black text-emerald-800 bg-emerald-50/50 px-4 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-100/50">TRACKING #${order._id.slice(-6).toUpperCase()}</span>
                                                <h4 className="text-2xl font-black text-slate-800 mt-4 leading-tight">${order.cropId?.cropName || 'Removed Crop'}</h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">${new Date(order.orderDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-black text-emerald-700 tracking-tighter">$${order.totalPrice}</div>
                                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-tight">${order.quantity} Units</div>
                                            </div>
                                        </div>
                                        <div className="mb-10 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-lg">👤</div>
                                                <div>
                                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Purchased By</span>
                                                    <span className="text-xs font-black text-slate-700 uppercase">${order.customerId?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        ${order.status === 'pending' ? html`
                                            <button onClick=${() => window.location.hash = `#/verify-otp/${order._id}`} className="mt-auto w-full bg-emerald-950 text-white font-black py-6 rounded-[1.5rem] shadow-xl hover:shadow-emerald-950/30 hover:-translate-y-1 transition-all active:scale-95 text-[13px] uppercase tracking-[0.25em] relative z-10 border border-emerald-800/50">VALIDATE DELIVERY</button>
                                        ` : html`
                                            <div className="mt-auto w-full bg-emerald-50 text-emerald-800 font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] border border-emerald-100 relative z-10 italic">
                                                <div className="w-5 h-5 bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center text-[10px]">✓</div>
                                                Dispatched
                                            </div>
                                        `}
                                    </div>
                                `)}
                            </div>
                        </section>
                    `}

                    ${(activeTab === 'all' || activeTab === 'crop-analysis') && analytics && html`
                        <section id="analysis-section" className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-2 h-10 bg-blue-500 rounded-full"></div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Strategic Insights</h3>
                            </div>
                            <div className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-xl border border-gray-100 mb-10 group relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 opacity-20"></div>
                                <h4 className="text-xl font-black text-slate-800 mb-12 flex items-center gap-4">
                                    Predictive Demand Matrix
                                </h4>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-14">
                                    ${analytics.topSellingCrops.length === 0 ? html`<p className="col-span-full text-center text-slate-300 py-20 font-black uppercase tracking-widest text-[10px]">No intelligence parameters found.</p>` :
                analytics.topSellingCrops.map((crop, i) => {
                    const maxQty = analytics.topSellingCrops[0].quantitySold;
                    const percent = maxQty > 0 ? (crop.quantitySold / maxQty) * 100 : 0;
                    return html`
                                            <div key=${i} className="group/bar">
                                                <div className="flex justify-between items-end mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-sm opacity-80 group-hover/bar:scale-110 transition-transform">
                                                            ${getCropIcon(crop.cropName, '', 20)}
                                                        </div>
                                                        <div>
                                                            <span className="text-xs font-black text-slate-800 block mb-1 uppercase tracking-tighter">${crop.cropName}</span>
                                                            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em]">${crop.quantitySold} UNITS CONSUMED</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-2xl font-black text-emerald-700 tracking-tighter">$${crop.revenue.toFixed(2)}</span>
                                                        <span className="text-[9px] text-slate-300 font-bold block">REVENUE</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-slate-50 h-[10px] rounded-full p-0.5 border border-slate-100 shadow-inner overflow-hidden">
                                                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-[1500ms] ease-out shadow-sm group-hover/bar:brightness-110" style=${{ width: `${percent}%` }}></div>
                                                </div>
                                            </div>
                                        `;
                })}
                                </div>
                            </div>
                            ${analytics.lowStockCrops.length > 0 && html`
                                <div className="bg-slate-900 shadow-2xl p-6 md:p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center md:items-start gap-10 border border-slate-800">
                                    <div className="w-24 h-24 bg-red-500/10 rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-red-500/20">🚩</div>
                                    <div className="text-center md:text-left">
                                        <h4 className="text-white font-black text-2xl mb-3 tracking-tight">Inventory Deficit Warning</h4>
                                        <p className="text-slate-400 text-sm font-medium max-w-xl leading-relaxed">Critical thresholds reached for the following livestock/harvest. Immediate replenishment recommended to avoid platform delisting.</p>
                                        <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                                            ${analytics.lowStockCrops.map((c, idx) => html`
                                                <div key=${idx} className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex flex-col">
                                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">${c.cropName}</span>
                                                    <span className="text-lg font-black text-red-400">${c.quantity} Units Left</span>
                                                </div>
                                            `)}
                                        </div>
                                    </div>
                                </div>
                            `}
                        </section>
                    `}

                    ${(activeTab === 'all' || activeTab === 'my-harvests') && html`
                        <section id="harvests-section" className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-2 h-10 bg-emerald-400 rounded-full"></div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Active Inventory</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                ${crops.length === 0 ? html`
                                    <div className="col-span-full py-40 text-center bg-white rounded-[4rem] border border-slate-100 shadow-xl flex flex-col items-center">
                                        <div className="text-8xl mb-8 opacity-20 filter grayscale">🌾</div>
                                        <h4 className="text-2xl font-black text-slate-400 mb-10 tracking-widest uppercase">Warehouse Offline</h4>
                                        <button onClick=${() => window.location.hash = '#/add-crop'} className="bg-emerald-900 text-white px-12 py-5 rounded-2xl font-black shadow-xl hover:bg-emerald-800 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[10px]">Initialize First Listing</button>
                                    </div>
                                ` : crops.map((crop, index) => {
                    const expiryInfo = (() => {
                        const diff = new Date(crop.expiryDate) - new Date();
                        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                        return {
                            days,
                            label: days < 0 ? 'STATUS: EXPIRED' : (days === 0 ? 'STATUS: TODAY' : (days <= 3 ? `ALERT: ${days} Days` : `Expires in ${days} Days`)),
                            color: days <= 3 ? 'bg-red-500' : 'bg-emerald-500'
                        };
                    })();

                    const daysLeft = expiryInfo.days;

                    return html`
                                        <div key=${crop._id} className="relative group overflow-hidden bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col h-full transform hover:-translate-y-2">
                                            <!-- Themed Background Glow -->
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 opacity-[0.08] blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:scale-150" style=${{ backgroundColor: getCropColor(crop.cropName, crop.category) }}></div>

                                            <!-- Centered Profile Icon -->
                                            <div className="pt-10 pb-6 flex flex-col items-center relative z-10">
                                                <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100/50 shadow-inner group-hover:scale-110 transition-transform duration-700 relative">
                                                    <div className="absolute inset-4 rounded-full bg-white shadow-sm border border-slate-50 flex items-center justify-center">
                                                        ${getCropIcon(crop.cropName, crop.category, 70)}
                                                    </div>
                                                </div>
                                                
                                                <!-- Category Tag (Pill style) -->
                                                <div className="mt-4">
                                                    <span className="bg-emerald-50 text-[7px] font-black text-emerald-800 px-4 py-1.5 rounded-full uppercase tracking-[0.3em] border border-emerald-100/50 shadow-sm">${crop.category}</span>
                                                </div>
                                            </div>

                                            <!-- Centered Title & Info -->
                                            <div className="px-8 pb-6 flex-grow flex flex-col items-center text-center relative z-10">
                                                <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1 group-hover:text-[#2e7d32] transition-colors">${crop.cropName}</h4>
                                                
                                                <!-- Expiry Status (Miniature Badge) -->
                                                <div className="flex items-center gap-2 mb-6">
                                                    <div className="w-1.5 h-1.5 rounded-full ${daysLeft <= 3 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}"></div>
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">${expiryInfo.label}</span>
                                                </div>

                                                <!-- Stat Matrix (2x2 Grid) -->
                                                <div className="w-full grid grid-cols-2 gap-px bg-slate-100 rounded-2xl overflow-hidden border border-slate-100 mt-auto">
                                                    <div className="bg-white p-4 flex flex-col items-center">
                                                        <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">PRICE/KG</span>
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="text-xl font-black text-slate-900 tracking-tighter">$${crop.price}</span>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-4 flex flex-col items-center">
                                                        <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest mb-1 opacity-60">MAX STOCK</span>
                                                        <span className="text-xl font-black text-[#1b5e20] tracking-tighter">${crop.quantity}</span>
                                                    </div>
                                                </div>

                                                <!-- Actions (Integrated Footer) -->
                                                <div className="w-full grid grid-cols-5 gap-3 mt-4">
                                                    <button 
                                                        onClick=${() => setEditingCrop({ ...crop, expiryDate: crop.expiryDate?.slice(0, 10) })}
                                                        className="col-span-4 bg-slate-900 hover:bg-[#2e7d32] text-white text-[8px] font-black py-4 rounded-2xl transition-all active:scale-95 uppercase tracking-[0.3em] shadow-lg flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                        EDIT
                                                    </button>
                                                    <button 
                                                        onClick=${() => handleDelete(crop._id)}
                                                        className="col-span-1 bg-red-50 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center rounded-2xl transition-all active:scale-95 border border-red-100"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                })}
                            </div>
                        </section>
                    `}

                    ${(activeTab === 'all' || activeTab === 'customer-reviews') && html`
                        <section id="reviews-section" className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-2 h-10 bg-amber-400 rounded-full"></div>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Market Reputation</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                ${reviews.length === 0 ? html`
                                    <div className="col-span-full py-28 text-center bg-white rounded-[3.5rem] border border-slate-100 shadow-xl">
                                        <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-[10px]">Aggregating Community Intelligence...</p>
                                    </div>
                                ` : reviews.slice(0, 4).map(review => html`
                                    <div key=${review._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 relative group hover:shadow-2xl transition-all duration-700">
                                        <div className="absolute top-0 right-10 w-16 h-1.5 bg-emerald-500/10 rounded-b-full"></div>
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner border border-slate-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-700">
                                                👤
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                                                    <div>
                                                        <h4 className="font-black text-xl text-slate-800 tracking-tight leading-none mb-2">${review.customerId?.name || 'Verified Buyer'}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-emerald-500 text-xs">★</span>
                                                            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">${review.cropId?.cropName || 'Organic Harvest'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-amber-400 text-xl drop-shadow-xl filter brightness-110">
                                                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute -left-6 -top-4 text-[70px] text-slate-50 font-serif select-none pointer-events-none z-0">“</span>
                                                    <p className="text-slate-500 italic text-sm leading-relaxed line-clamp-3 relative z-10 font-medium">
                                                        ${review.comment}
                                                    </p>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center text-[7px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                                    <span className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white shadow-lg">✓</div> PLATFORM VERIFIED</span>
                                                    <span>${new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </section>
                    `}
                </div>
            </div>

            <!-- Configuration Modal (Agri-Tech Edition) -->
            ${editingCrop && html`
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-[#3e2723]/90 backdrop-blur-2xl animate-in fade-in duration-700" onClick=${() => setEditingCrop(null)}></div>
                    <form onSubmit=${handleSaveEdit} className="bg-white rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(62,39,35,0.5)] w-full max-w-2xl p-6 md:p-16 relative z-10 animate-in zoom-in-95 duration-500 overflow-hidden border border-white/20">
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#2e7d32] to-[#8d6e63]"></div>
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1b5e20] opacity-[0.02] rounded-full -translate-y-40 translate-x-40"></div>
                        
                        <div className="flex justify-between items-start mb-12 relative">
                            <div>
                                <span className="text-[#2e7d32] font-black text-[10px] uppercase tracking-[0.2em] block mb-1">Edit Details</span>
                                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Edit Harvest</h3>
                            </div>
                            <button type="button" onClick=${() => setEditingCrop(null)} className="w-14 h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-300 text-4xl transition-all hover:rotate-90 shadow-inner">×</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative">
                            <div className="md:col-span-2 group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#2e7d32] transition-colors">Crop Name</label>
                                <input 
                                    required
                                    value=${editingCrop.cropName} 
                                    onInput=${e => setEditingCrop({ ...editingCrop, cropName: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white p-6 rounded-[1.5rem] font-bold text-slate-800 outline-none transition-all shadow-inner text-xl"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#2e7d32] transition-colors">Price per KG ($)</label>
                                <input 
                                    required type="number" step="0.01"
                                    value=${editingCrop.price} 
                                    onInput=${e => setEditingCrop({ ...editingCrop, price: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white p-6 rounded-[1.5rem] font-bold text-slate-800 outline-none transition-all shadow-inner text-xl"
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#2e7d32] transition-colors">Quantity (KG)</label>
                                <input 
                                    required type="number"
                                    value=${editingCrop.quantity} 
                                    onInput=${e => setEditingCrop({ ...editingCrop, quantity: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white p-6 rounded-[1.5rem] font-bold text-slate-800 outline-none transition-all shadow-inner text-xl"
                                />
                            </div>
                            <div className="md:col-span-2 group">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-[#2e7d32] transition-colors">Expiry Date</label>
                                <input 
                                    required type="date"
                                    value=${editingCrop.expiryDate} 
                                    onInput=${e => setEditingCrop({ ...editingCrop, expiryDate: e.target.value })}
                                    className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white p-6 rounded-[1.5rem] font-bold text-slate-800 outline-none transition-all shadow-inner text-xl"
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 relative">
                            <button type="button" onClick=${() => setEditingCrop(null)} className="flex-1 py-5 font-bold text-[11px] uppercase tracking-wide text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                            <button 
                                disabled=${isSaving}
                                type="submit" 
                                className="flex-[2] bg-[#3e2723] text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-wider shadow-lg hover:bg-[#1b5e20] hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
                            >
                                ${isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            `}

            <style>
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(0.998); opacity: 0.95; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            </style>
        </div>
    `;
};
