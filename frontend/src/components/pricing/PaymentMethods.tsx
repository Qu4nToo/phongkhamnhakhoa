import React from 'react';
import { CreditCard, Wallet, Building2, Percent } from 'lucide-react';

const paymentMethods = [
  {
    icon: Wallet,
    title: 'Tiền Mặt',
    description: 'Thanh toán trực tiếp tại phòng khám',
    features: ['Nhanh chóng, tiện lợi', 'Nhận hóa đơn ngay'],
  },
  {
    icon: CreditCard,
    title: 'Thẻ ATM/Credit Card',
    description: 'Thanh toán qua máy POS',
    features: ['An toàn, bảo mật', 'Hỗ trợ đa dạng loại thẻ'],
  }
];

const banks = [
  { name: 'Home Credit', periods: '6-12 tháng' },
  { name: 'FE Credit', periods: '6-12 tháng' },
  { name: 'HD Saison', periods: '3-12 tháng' },
  { name: 'Mirae Asset', periods: '6-12 tháng' },
];

export function PaymentMethods() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Hình Thức Thanh Toán
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi hỗ trợ đa dạng các hình thức thanh toán để khách hàng thuận tiện nhất
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <method.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-4">{method.description}</p>
              <ul className="space-y-2">
                {method.features.map((feature, fIndex) => (
                  <li key={fIndex} className="text-gray-600 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
