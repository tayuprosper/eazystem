import React, { useState } from 'react';
import { User, Settings2, CreditCard, UploadCloud } from 'lucide-react';
import GradientButton from '../Components/ui/Button';
import { useUser } from '../Context/userContext';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    
    return (
        <div className="workspace-section text-text-primary p-4 md:p-8 mx-auto h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Settings</h1>
                <p className="text-text-secondary">Manage your account, rendering preferences, and billing.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-12rem)] pb-20">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
                    <TabButton 
                        active={activeTab === 'profile'} 
                        onClick={() => setActiveTab('profile')} 
                        icon={<User size={20} />} 
                        label="Profile" 
                    />
                    <TabButton 
                        active={activeTab === 'preferences'} 
                        onClick={() => setActiveTab('preferences')} 
                        icon={<Settings2 size={20} />} 
                        label="Preferences" 
                    />
                    <TabButton 
                        active={activeTab === 'billing'} 
                        onClick={() => setActiveTab('billing')} 
                        icon={<CreditCard size={20} />} 
                        label="Billing & Usage" 
                    />
                </div>

                {/* Content Pane */}
                <div className="flex-1 bg-bg-secondary border border-border-subtle rounded-2xl p-6 md:p-10 shadow-2xl">
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'preferences' && <PreferenceSettings />}
                    {activeTab === 'billing' && <BillingSettings />}
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 w-full p-4 rounded-xl font-medium transition-all duration-200 text-left ${
            active 
            ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
            : 'text-text-secondary hover:bg-bg-hover hover:text-white'
        }`}
    >
        {icon}
        {label}
    </button>
);

const ProfileSettings = () => {
    const { session } = useUser();
    
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-bold mb-1">Profile Information</h2>
                <p className="text-sm text-text-secondary mb-6">Update your account's profile information and email address.</p>
                
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-bg-tertiary border-2 border-border-subtle flex items-center justify-center overflow-hidden">
                        <User size={40} className="text-text-muted" />
                    </div>
                    <button className="flex items-center gap-2 bg-bg-tertiary hover:bg-bg-hover border border-border-subtle px-4 py-2 rounded-lg text-sm font-medium transition">
                        <UploadCloud size={16} />
                        Change Avatar
                    </button>
                </div>

                <div className="grid gap-6 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <input 
                            type="email" 
                            disabled 
                            value={session?.user?.email || ""} 
                            className="w-full bg-bg-tertiary border border-border-subtle rounded-xl p-3 text-text-primary focus:outline-none focus:border-primary transition opacity-70 cursor-not-allowed" 
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Display Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. John Doe" 
                            className="w-full bg-bg-tertiary border border-border-subtle rounded-xl p-3 text-text-primary focus:outline-none focus:border-primary transition" 
                        />
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-border-subtle max-w-xl">
                <GradientButton className="w-auto px-8">Save Changes</GradientButton>
            </div>
        </div>
    );
};

const PreferenceSettings = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-bold mb-1">Rendering Preferences</h2>
                <p className="text-sm text-text-secondary mb-6">Set your default configurations for AI-generated Manim videos.</p>

                <div className="grid gap-8 max-w-xl">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Default Resolution</label>
                        <select className="w-full bg-bg-tertiary border border-border-subtle rounded-xl p-3 text-text-primary focus:outline-none focus:border-primary transition appearance-none">
                            <option value="720p">720p (Fastest)</option>
                            <option value="1080p">1080p HD (Recommended)</option>
                            <option value="4k">4K Ultra HD</option>
                        </select>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Framerate</label>
                        <select className="w-full bg-bg-tertiary border border-border-subtle rounded-xl p-3 text-text-primary focus:outline-none focus:border-primary transition appearance-none">
                            <option value="30">30 FPS</option>
                            <option value="60">60 FPS (Smoother Animations)</option>
                        </select>
                    </div>

                    <div className="space-y-4 pt-4">
                        <label className="text-sm font-medium text-text-secondary">Theme & Accessibility</label>
                        
                        <label className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-subtle rounded-xl cursor-pointer hover:border-primary/50 transition">
                            <div>
                                <h4 className="font-medium">Dark Mode Videos</h4>
                                <p className="text-xs text-text-muted mt-1">Generate videos with a dark background</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-subtle rounded-xl cursor-pointer hover:border-primary/50 transition">
                            <div>
                                <h4 className="font-medium">Email Notifications</h4>
                                <p className="text-xs text-text-muted mt-1">Send an email when a long render finishes</p>
                            </div>
                            <input type="checkbox" className="w-5 h-5 accent-primary" defaultChecked />
                        </label>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-border-subtle max-w-xl">
                <GradientButton className="w-auto px-8">Save Preferences</GradientButton>
            </div>
        </div>
    );
};

const BillingSettings = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-xl font-bold mb-1">Billing & Usage</h2>
                <p className="text-sm text-text-secondary mb-6">Manage your subscription plan and monitor AI rendering usage.</p>

                <div className="bg-gradient-to-br from-bg-tertiary to-bg-main border border-primary/20 rounded-2xl p-6 mb-8 max-w-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-primary font-bold text-lg mb-1">Pro Plan</h3>
                            <p className="text-sm text-text-secondary">Active subscription</p>
                        </div>
                        <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Active
                        </span>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-text-secondary">Rendering Minutes Used</span>
                            <span className="font-medium">45 / 100 mins</span>
                        </div>
                        <div className="w-full bg-bg-main rounded-full h-2.5 border border-border-subtle">
                            <div className="bg-primary h-2.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                    <p className="text-xs text-text-muted">Resets on May 1st, 2026</p>
                </div>

                <div className="flex gap-4">
                    <GradientButton className="w-auto px-6">Manage Subscription</GradientButton>
                    <button className="px-6 py-4 rounded-xl font-medium border border-border-subtle hover:bg-bg-tertiary transition text-text-secondary">
                        View Invoices
                    </button>
                </div>
            </div>
        </div>
    );
};