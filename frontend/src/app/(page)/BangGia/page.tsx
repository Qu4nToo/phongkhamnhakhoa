import React from 'react';
import { Header } from '@/components/features/header';
import { PricingHero } from '@/components/pricing/PricingHero';
import { PricingIntro } from '@/components/pricing/PricingIntro';
import { PricingTables } from '@/components/pricing/PricingTables';
import { PaymentMethods } from '@/components/pricing/PaymentMethods';
import { PricingNotes } from '@/components/pricing/PricingNotes';
import { ConsultationCTA } from '@/components/pricing/ConsultationCTA';
import Footer from '@/components/features/footer';
import { TitleProvider } from '@/components/features/TitleContext';

export default function App() {
    return (
        <TitleProvider>
            <div className="min-h-screen bg-white">
                <Header />
                <PricingHero />
                <PricingIntro />
                <PricingTables />
                <PaymentMethods />
                <PricingNotes />
                <ConsultationCTA />
                <Footer />
            </div>
        </TitleProvider>
    );
}