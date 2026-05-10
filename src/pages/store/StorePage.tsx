import { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Award,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockProducts } from '../../mock/data';
import { useAuth } from '../../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PurchaseModal = ({ product, isOpen, onClose, onConfirm }: any) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        className="relative w-full max-w-sm glass-card bg-bg-surface overflow-hidden shadow-2xl border-border-light"
      >
        <div className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
            <ShoppingBag size={40} className="animate-bounce" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold font-heading text-text-primary">상품 구매 확인</h3>
            <p className="text-sm text-text-secondary">
              <span className="text-primary font-bold">[{product.name}]</span> 상품을 구매하시겠습니까?
            </p>
          </div>

          <div className="bg-bg-elevated p-4 rounded-xl border border-border flex items-center justify-between">
             <span className="text-sm font-medium text-text-muted">사용 포인트</span>
             <span className="text-lg font-bold text-text-primary">{product.price.toLocaleString()} P</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-border font-bold text-text-muted hover:bg-bg-elevated transition-all"
            >
              취소
            </button>
            <button 
              onClick={() => onConfirm(product)}
              className="flex-1 py-3 px-4 rounded-xl bg-primary font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all"
            >
              확인
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessToast = ({ message, isOpen }: { message: string, isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-4 bg-success p-4 rounded-2xl shadow-2xl text-white min-w-[300px]"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="font-bold text-sm">구매 성공!</p>
          <p className="text-xs opacity-90">{message}</p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const StorePage = () => {
  const { user, updatePoints } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handlePurchaseAttempt = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleConfirmPurchase = (product: any) => {
    updatePoints(-product.price);
    setShowModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const categories = ['전체', '상품권', '복지', '구독권'];

  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      <PurchaseModal 
        product={selectedProduct} 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmPurchase}
      />
      <SuccessToast 
        isOpen={showToast} 
        message={`${selectedProduct?.name} 구매가 완료되었습니다. 마이페이지에서 바코드를 확인할 수 있습니다.`} 
      />

      {/* Store Hero */}
      <section className="relative overflow-hidden glass-card h-52 flex flex-col justify-center px-10 border-border-light bg-gradient-to-r from-bg-surface to-primary/10">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <ShoppingBag size={240} className="translate-x-1/4 -translate-y-1/4 -rotate-12" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-widest uppercase mb-1">
              Ask Hub Reward Store
            </div>
            <h1 className="text-2xl md:text-3xl font-heading font-black text-white">포인트로 즐기는 사내 쇼핑 🛍️</h1>
            <p className="text-text-secondary text-sm md:text-base">지식인 활동으로 모은 포인트를 사용해보세요.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-bg-surface/80 backdrop-blur-md border border-primary/30 p-6 rounded-2xl shadow-xl flex items-center gap-5 min-w-[240px]"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-white">
              <Award size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-2">현재 보유 포인트</p>
              <p className="text-3xl font-heading font-black text-text-primary tracking-tight">
                {user?.points.toLocaleString()} <span className="text-lg text-primary ml-1">P</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black transition-all border",
                selectedCategory === cat
                  ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                  : "bg-bg-surface text-text-muted border-border hover:border-primary hover:text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-bg-surface border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition-all" 
            placeholder="상품명을 검색하세요..."
          />
        </div>
      </section>

      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => {
          const isAffordable = (user?.points || 0) >= product.price;
          
          return (
            <motion.div 
              key={product.id}
              whileHover={{ y: -8 }}
              className="glass-card flex flex-col group overflow-hidden"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-bg-elevated">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-bg-surface/80 backdrop-blur-md border border-border rounded font-black text-[10px] text-text-secondary uppercase">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-text-primary text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className={cn("text-xl font-heading font-black", isAffordable ? "text-text-primary" : "text-danger")}>
                      {product.price.toLocaleString()} P
                    </span>
                  </div>

                  <button 
                    disabled={!isAffordable}
                    onClick={() => handlePurchaseAttempt(product)}
                    className={cn(
                      "btn-primary h-10 px-6 rounded-xl font-black text-xs uppercase tracking-widest relative overflow-hidden",
                      !isAffordable && "bg-bg-elevated border border-border text-text-muted hover:bg-bg-elevated cursor-not-allowed"
                    )}
                  >
                    {!isAffordable ? '포인트 부족' : '구매하기'}
                    {isAffordable && <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Footer Info */}
      <section className="bg-bg-elevated/30 border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
            <Zap size={32} />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-text-primary">포인트를 더 모으고 싶나요?</h4>
            <p className="text-sm text-text-secondary">지식인에서 동료들의 질문에 답변하고 채택을 받아보세요!</p>
          </div>
        </div>
        <button 
           onClick={() => window.location.assign('/knowledge')}
           className="px-8 py-3 rounded-xl border border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all whitespace-nowrap"
        >
          지식인 바로가기
        </button>
      </section>
    </div>
  );
};
