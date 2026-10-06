import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CategoryId } from '../../types';

interface CategoryCardInfo {
  id: CategoryId;
  title: string;
  subtitle: string;
  description: string;
  bannerGradient: string;
  topDeals: string;
}

const CATEGORY_LIST: CategoryCardInfo[] = [
  {
    id: 'Electronics',
    title: 'Electronics',
    subtitle: 'Smart TVs, Voice Assistants & Displays',
    description: 'Explore ultra HD crystal 4K displays, smart speakers with Alexa, high-definition streaming devices, and home entertainment upgrades.',
    bannerGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    topDeals: 'Up to 35% OFF on Brand TVs',
  },
  {
    id: 'Mobile & Accessories',
    title: 'Mobile & Accessories',
    subtitle: 'Audio, Wearables & High-Power Peripherals',
    description: 'Active Noise Cancelling (ANC) studio headphones, fitness smartwatches with ECG, magnetic fast chargers, and tough cases.',
    bannerGradient: 'from-violet-700 via-purple-900 to-slate-950',
    topDeals: 'Starting ₹149 | Headphones & TWS',
  },
  {
    id: 'Fashion',
    title: 'Fashion & Apparel',
    subtitle: "Ethnic Kurtis, Men's Checkered Shirts & Denim",
    description: '100% breathable Schiffli cotton dresses, stretch bootcut denim jeans, handcrafted zari embroidered kurti sets, and formal shirts.',
    bannerGradient: 'from-rose-700 via-red-900 to-zinc-950',
    topDeals: 'Up to 75% OFF Clearance Sale',
  },
  {
    id: 'Beauty',
    title: 'Beauty & Fragrance',
    subtitle: 'Luxury Perfumes, Skincare & Grooming',
    description: 'Original French Eau De Toilette perfumes, woody oriental luxury fragrances, moisturizing serums, and grooming kits.',
    bannerGradient: 'from-amber-600 via-orange-800 to-neutral-900',
    topDeals: 'Luxury Perfumes Under ₹2,999',
  },
  {
    id: 'Home & Kitchen',
    title: 'Home & Kitchen',
    subtitle: 'Metal Wall Art, Storage & Cookware',
    description: 'Handcrafted Krishna & Gayatri mantra iron decor wall plaques, spice organizers, non-stick cookware, and water purification units.',
    bannerGradient: 'from-amber-700 via-stone-800 to-stone-950',
    topDeals: 'Starting ₹299 | Home Essentials',
  },
  {
    id: 'Grocery',
    title: 'Grocery & Dry Fruits',
    subtitle: 'Jumbo Almonds, Cashews & Daily Staples',
    description: 'Handpicked California jumbo almonds, Afghan white cashews, chia seeds, cold-pressed oils, and gourmet pantry goods.',
    bannerGradient: 'from-emerald-700 via-teal-900 to-slate-950',
    topDeals: 'Dry Fruits & Seeds Combo Deals',
  },
  {
    id: 'Sports',
    title: 'Sports & Fitness',
    subtitle: 'Sneakers, Yoga Mats & Gym Accessories',
    description: 'Retro basketball court sneakers, 6mm eco-friendly dual-grip alignment yoga mats, adjustable dumbbells, and training apparel.',
    bannerGradient: 'from-cyan-700 via-blue-900 to-slate-900',
    topDeals: 'Min. 40% OFF Fitness Gear',
  },
  {
    id: 'Books',
    title: 'Books & Academics',
    subtitle: 'UPSC Civil Services, Engineering & Literature',
    description: 'Prelims & Mains complete syllabus guides, solved question banks, competitive entrance exams, and world-class bestselling fiction.',
    bannerGradient: 'from-sky-700 via-indigo-900 to-slate-950',
    topDeals: 'Starting ₹165 | Competitive Exam Books',
  },
  {
    id: 'Toys',
    title: 'Toys & Robotics',
    subtitle: 'STEM 5-in-1 Engineering & Toddler Sets',
    description: 'Mechanical pulley kits, motorized excavator blocks, safe non-toxic building blocks, and brain-stimulating interactive puzzles.',
    bannerGradient: 'from-orange-600 via-amber-800 to-slate-900',
    topDeals: 'Starting ₹169 | STEM Toddler Toys',
  },
  {
    id: 'Other Products',
    title: 'Other Products & Wholesale Supplies',
    subtitle: 'Corrugated Packaging Boxes & Business Hardware',
    description: 'Heavy duty 3-ply brown cardboard shipping cartons, bubble wrap rolls, courier supplies, and industrial packaging packs.',
    bannerGradient: 'from-yellow-700 via-amber-900 to-stone-950',
    topDeals: 'Corrugated Cartons Pack of 20 at 83% OFF',
  },
];

export const CategoriesView: React.FC = () => {
  const { products, setSelectedCategory, setCustomerTab } = useStore();

  const handleSelectCategory = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCustomerTab('products');
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Explore complete wholesale departments with direct fulfillment from our Baguiati Kolkata center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORY_LIST.map((cat) => {
          const count = products.filter((p) => p.category === cat.id).length;
          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              {/* Category Card Header with Gradient */}
              <div className={`p-6 bg-gradient-to-r ${cat.bannerGradient} text-white space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/80 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-400" /> {cat.topDeals}
                  </span>
                  <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {count} Products
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black tracking-tight">{cat.title}</h2>
                <p className="text-xs text-white/90 font-medium">{cat.subtitle}</p>
              </div>

              {/* Category Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cat.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">
                    Instant Kolkata Dispatch
                  </span>
                  <span className="text-xs font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1">
                    Explore Department <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
