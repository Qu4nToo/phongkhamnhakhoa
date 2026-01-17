"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { ServiceImageGallery } from '@/components/ServicesDetail/ServiceImageGallery';
import { ServiceSidebar } from '@/components/ServicesDetail/ServiceSidebar';
import { FloatingContact } from '@/components/ServicesDetail/FloatingContact';
import { Header } from '@/components/features/header';
import Footer from "@/components/features/footer";
import { TitleProvider } from '@/components/features/TitleContext';
import axios from 'axios';
export default function App() {
    const params = useParams();
    const slug = params?.slug as string;
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServiceBySlug = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`http://localhost:5000/api/dich-vu/getBySlug/${slug}`);
                setService(response.data);
            } catch (error: any) {
                console.error('Error fetching service:', error);
                setError(error.response?.data?.message || 'Không thể tải dữ liệu dịch vụ');
            } finally {
                setLoading(false);
            }
        };

        fetchServiceBySlug();
    }, [slug]);

    const serviceImages = service?.HinhAnhs && service.HinhAnhs.length > 0
        ? service.HinhAnhs.map((img: any) => img.URL)
        : service?.HinhAnh 
        ? [service.HinhAnh]
        : ['https://images.unsplash.com/photo-1650739353152-5488298a9d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50JTIwM2R8ZW58MXx8fHwxNzY1Mjg0MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080'];

    if (loading) {
        return (
            <TitleProvider>
                <div className="min-h-screen bg-white">
                    <Header />
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                    </div>
                    <Footer />
                </div>
            </TitleProvider>
        );
    }

    if (error || !service) {
        return (
            <TitleProvider>
                <div className="min-h-screen bg-white">
                    <Header />
                    <div className="flex items-center justify-center min-h-[400px]">
                        <p className="text-red-600">{error || 'Không tìm thấy dịch vụ'}</p>
                    </div>
                    <Footer />
                </div>
            </TitleProvider>
        );
    }

    return (
        <><TitleProvider>
            <div className="min-h-screen bg-white">
                <Header />

                <main className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <nav className="flex items-center space-x-2 text-sm mb-4">
                        <a href="/" className="text-gray-600 hover:text-blue-600">
                            Trang chủ
                        </a>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <a href={`/DichVu/${service.SlugLoaiDV}`} className="text-gray-600 hover:text-blue-600">
                            {service.TenLoaiDV}
                        </a>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <span className="text-blue-600">{service.TenDichVu}</span>
                    </nav>


                    <h1 className="text-2xl mb-6 text-blue-900 font-bold">
                        {service.TenDichVu}
                    </h1>


                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ServiceImageGallery images={serviceImages} />


                            <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8">
                                <div className="service-description">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: service.MoTa || '<p>Chưa có mô tả cho dịch vụ này.</p>'
                                        }} />
                                </div>
                            </div>

                            <style jsx global>{`
                                .service-description {
                                    max-width: none;
                                }
                                
                                .service-description h1 {
                                    font-size: 32px !important;
                                    font-weight: 800 !important;
                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                                    color: #1a202c !important;
                                    margin-top: 0 !important;
                                    margin-bottom: 1.5rem !important;
                                    line-height: 1.3 !important;
                                    padding-bottom: 0.75rem !important;
                                    border-bottom: 2px solid #e5e7eb !important;
                                }
                                
                                .service-description h1 strong {
                                    font-size: inherit !important;
                                    font-weight: inherit !important;
                                    font-family: inherit !important;
                                }
                                
                                .service-description h2 {
                                    font-size: 24px !important;
                                    font-weight: 700 !important;
                                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                                    color: #1e3a8a !important;
                                    margin-top: 2rem !important;
                                    margin-bottom: 1rem !important;
                                    line-height: 1.4 !important;
                                }
                                
                                .service-description h2:first-of-type {
                                    margin-top: 1rem !important;
                                }
                                
                                .service-description h2 strong {
                                    font-size: inherit !important;
                                    font-weight: inherit !important;
                                    font-family: inherit !important;
                                }
                                
                                .service-description h3 {
                                    font-size: 20px !important;
                                    font-weight: 600 !important;
                                    color: #1a202c !important;
                                    margin-top: 1.5rem !important;
                                    margin-bottom: 0.75rem !important;
                                }
                                
                                .service-description p {
                                    font-size: 16px !important;
                                    color: #374151;
                                    line-height: 1.8;
                                    margin-bottom: 1rem;
                                    text-align: justify;
                                }
                                
                                .service-description ul {
                                    list-style: none;
                                    padding-left: 0;
                                    margin-bottom: 1.5rem;
                                    margin-top: 0.75rem;
                                }
                                
                                .service-description li {
                                    font-size: 16px;
                                    color: #374151;
                                    line-height: 1.8;
                                    margin-bottom: 0.75rem;
                                    position: relative;
                                    padding-left: 1.5rem;
                                }
                                
                                .service-description li::before {
                                    content: '•';
                                    position: absolute;
                                    left: 0;
                                    color: #2563eb;
                                    font-weight: bold;
                                    font-size: 1.2em;
                                }
                                
                                .service-description strong {
                                    color: #1a202c;
                                    font-weight: 600;
                                }
                                
                                .service-description a {
                                    color: #2563eb;
                                    text-decoration: none;
                                    transition: color 0.2s;
                                }
                                
                                .service-description a:hover {
                                    color: #1e40af;
                                    text-decoration: underline;
                                }
                                
                                .service-description img {
                                    border-radius: 0.5rem;
                                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                                    margin: 1.5rem 0;
                                    max-width: 100%;
                                    height: auto;
                                }
                                
                                .service-description ol {
                                    list-style: decimal;
                                    padding-left: 1.5rem;
                                    margin-bottom: 1.5rem;
                                    margin-top: 0.75rem;
                                }
                                
                                .service-description ol li {
                                    padding-left: 0.5rem;
                                }
                                
                                .service-description ol li::before {
                                    content: none;
                                }
                            `}</style>
                        </div>

                        <div className="lg:col-span-1">
                            <ServiceSidebar service={service} />
                        </div>
                    </div>
                </main>
                <FloatingContact />
                <Footer />
            </div>
        </TitleProvider></>
    );
}