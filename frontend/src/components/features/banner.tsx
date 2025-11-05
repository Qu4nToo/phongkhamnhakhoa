"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";

export default function BannerCard() {
  return (
    <Carousel>
      <CarouselContent className="mb-4">
        <CarouselItem>
          <div className="flex flex-col items-center justify-around bg-gradient-to-r from-emerald-700 to-teal-500 p-8 pt-8 pb-8 rounded-lg shadow-lg md:flex-row w-full h-auto">
            <div className="flex flex-col justify-between p-auto lg:p-16 leading-normal md:w-1/2">
              <h1 className="text-xl md:text-4xl font-extrabold text-white mb-2">
                NHA KHOA HOÀNG QUÂN
              </h1>
              <h2 className="text-base md:text-xl font-semibold text-white mb-3">
                PHÒNG KHÁM CHUYÊN KHOA RĂNG HÀM MẶT
              </h2>
              <p className="mt-2 text-sm md:text-base text-white">
                Liên hệ ngay để sở hữu nụ cười tự tin và rạng rỡ. Đặt lịch hẹn
                với đội ngũ chuyên gia của chúng tôi!
              </p>
              <p className="mt-3 text-sm md:text-lg font-bold text-white">
                HOTLINE: 1900 4775
              </p>
              <Link href="/DatLich" className="w-fit h-auto">
                <Button className="w-40 mt-4 bg-white text-emerald-700 hover:bg-gray-100 font-bold shadow-lg">
                  ĐẶT LỊCH HẸN
                </Button>
              </Link>
            </div>
            <img
              className="object-cover xl:w-96 xl:h-96 md:w-48 md:h-48 rounded-xl m-auto mt-4 md:m-0 md:ml-6"
              src="banner.jpg"
              alt="Đội ngũ Nha Khoa Hoàng Quân"
            />
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex flex-col items-center justify-around bg-gradient-to-r from-emerald-700 to-teal-500 p-8 pt-8 pb-8 rounded-lg shadow-lg md:flex-row w-full h-auto">
            <div className="flex flex-col justify-between p-auto lg:p-16 leading-normal md:w-1/2">
              <h1 className="text-xl md:text-4xl font-extrabold text-white mb-2">
                NHA KHOA HOÀNG QUÂN
              </h1>
              <h2 className="text-base md:text-xl font-semibold text-white mb-3">
                PHÒNG KHÁM CHUYÊN KHOA RĂNG HÀM MẶT
              </h2>
              <p className="mt-2 text-sm md:text-base text-white">
                Liên hệ ngay để sở hữu nụ cười tự tin và rạng rỡ. Đặt lịch hẹn
                với đội ngũ chuyên gia của chúng tôi!
              </p>
              <p className="mt-3 text-sm md:text-lg font-bold text-white">
                HOTLINE: 1900 4775
              </p>
              <Link href="/DatLich" className="w-fit h-auto">
                <Button className="w-40 mt-4 bg-white text-emerald-700 hover:bg-gray-100 font-bold shadow-lg">
                  ĐẶT LỊCH HẸN
                </Button>
              </Link>
            </div>
            <img
              // Tăng kích thước trên desktop (md:) từ 48 lên 64 (tương đương 16rem)
              className="object-cover xl:w-96 xl:h-96 md:w-64 md:h-64 rounded-xl m-auto mt-4 md:m-0 md:ml-6"
              src="banner.jpg"
              alt="Đội ngũ Nha Khoa Hoàng Quân"
            />
          </div>
        </CarouselItem>

        {/* --- Carousel Item 3: Cần sửa tương tự Item 1 --- */}
        <CarouselItem>
          <div className="flex flex-col items-center justify-around bg-gradient-to-r from-emerald-700 to-teal-500 p-8 pt-8 pb-8 rounded-lg shadow-lg md:flex-row w-full h-auto">
            <div className="flex flex-col justify-between p-auto lg:p-16 leading-normal md:w-1/2">
              <h1 className="text-xl md:text-4xl font-extrabold text-white mb-2">
                NHA KHOA HOÀNG QUÂN
              </h1>
              <h2 className="text-base md:text-xl font-semibold text-white mb-3">
                PHÒNG KHÁM CHUYÊN KHOA RĂNG HÀM MẶT
              </h2>
              <p className="mt-2 text-sm md:text-base text-white">
                Liên hệ ngay để sở hữu nụ cười tự tin và rạng rỡ. Đặt lịch hẹn
                với đội ngũ chuyên gia của chúng tôi!
              </p>
              <p className="mt-3 text-sm md:text-lg font-bold text-white">
                HOTLINE: 1900 4775
              </p>
              <Link href="/DatLich" className="w-fit h-auto">
                <Button className="w-40 mt-4 bg-white text-emerald-700 hover:bg-gray-100 font-bold shadow-lg">
                  ĐẶT LỊCH HẸN
                </Button>
              </Link>
            </div>
            <img
              className="object-cover xl:w-96 xl:h-96 md:w-48 md:h-48 rounded-xl m-auto mt-4 md:m-0 md:ml-6"
              src="banner.jpg"
              alt="Đội ngũ Nha Khoa Hoàng Quân"
            />
          </div>
        </CarouselItem>
      </CarouselContent>
      <div className="mt-4 container flex justify-center">
        <CarouselPrevious />
        <p>&ensp;</p>
        <CarouselNext />
      </div>
    </Carousel>
  );
}