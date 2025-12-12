import React from 'react';
import Footer from "@/components/features/footer";
import { Header } from "@/components/features/header";
import { AboutIntro } from '@/components/about/AboutIntro';
import { VisionMission } from '@/components/about/VisionMission';
import { CoreValues } from '@/components/about/CoreValues';
import { Statistics } from '@/components/about/Statistics';
import { DoctorTeam } from '@/components/about/DoctorTeam';
import { Facilities } from '@/components/about/Facilities';
import { Commitment } from '@/components/about/Commitment';
import { TitleProvider } from '@/components/features/TitleContext';

export default function App() {
    return (
        <TitleProvider>
            <div className="min-h-screen bg-white">
                <Header />
                <AboutIntro />
                <VisionMission />
                <CoreValues />
                <Statistics />
                <DoctorTeam />
                <Facilities />
                <Commitment />
                <Footer />
            </div>
        </TitleProvider>
    );
}
