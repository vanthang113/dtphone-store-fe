'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Gift } from 'lucide-react';
import { useLoginMutation } from '@/store/features/authApi';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [login, { isLoading }] = useLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCheckboxChange =
    (name: keyof typeof formData) => (checked: boolean | 'indeterminate') => {
      setFormData((prev) => ({
        ...prev,
        [name]: checked === true,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const result: any = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      if (result?.data?.access_token) localStorage.setItem('access_token', result.data.access_token);
      if (result?.data?.refresh_token) localStorage.setItem('refresh_token', result.data.refresh_token);

      window.location.href = '/';
    } catch (err: any) {
      setErrorMessage(err?.data?.message || err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full bg-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* ================= LEFT: Giống CellphoneS ================= */}
          <section className="hidden lg:block">
            {/* Heading */}
            <div className="space-y-2">
              <p className="text-lg text-neutral-800">
                Nhập hội khách hàng thành viên <span className="font-extrabold text-red-600">SMEMBER</span>
              </p>
              <p className="text-base text-neutral-700">
                Để không bỏ lỡ các ưu đãi hấp dẫn từ <span className="font-extrabold text-red-600">DTPhone</span>
              </p>
            </div>

            {/* Box ưu đãi (giống card bên trái) */}
            <div className="mt-6 rounded-2xl border border-red-100 bg-neutral-50 p-6 relative">
              {/* “khung đỏ” bo góc kiểu cellphones */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-red-500/20" />

              <ul className="space-y-4">
                {[
                  'Chiết khấu đến 5% khi mua các sản phẩm tại DTPhone',
                  'Miễn phí giao hàng cho thành viên và cho đơn hàng từ 300.000đ',
                  'Tặng voucher sinh nhật đến 500.000đ cho khách hàng thành viên',
                  'Trợ giá thu cũ lên đời đến 1 triệu',
                  'Thăng hạng nhận voucher đến 300.000đ',
                  'Đặc quyền ưu đãi thêm cho học sinh / sinh viên',
                ].map((t, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-800">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-red-600">
                      <Gift className="h-4 w-4" />
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 text-center">
                <Link href="/" className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Xem chi tiết chính sách ưu đãi Smember &rsaquo;
                </Link>
              </div>
            </div>

            {/* Ảnh mascot ở dưới (bạn chỉ thay src là ảnh của bạn) */}
            <div className="mt-8 flex justify-center">
              <Image
                src="/images/auth/robo1.png" 
                alt="Mascot"
                width={520}
                height={320}
                className="w-full max-w-[320px] h-auto object-contain"
                priority
              />
            </div>
          </section>

          {/* ================= RIGHT: Form đăng nhập ================= */}
          <section className="w-full">
            <div className="mx-auto w-full max-w-[520px]">
                <div className="flex items-center gap-3 mb-2">
                  <Link href="/" className="inline-flex flex-shrink-0">
                    <Image
                      src="/images/logo-dt.png"
                      alt="DTPhone"
                      width={180}
                      height={56}
                      className="h-10 w-auto object-contain"
                      priority
                    />
                  </Link>

                  <h1 className="text-2xl tablet:text-3xl font-extrabold text-center text-red-600">
                    Đăng nhập SMEMBER
                  </h1>
                </div>

              <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email của bạn"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Nhập mật khẩu của bạn"
                      className="h-12 text-base pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-10 w-10"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-neutral-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-neutral-600" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={handleCheckboxChange('rememberMe')}
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-neutral-700">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>

                  <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Quên mật khẩu?
                  </Link>
                </div>

                {errorMessage && (
                  <div className="w-full rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 text-base font-semibold bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>

                <div className="flex items-center gap-3 py-2">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <span className="text-sm text-neutral-500">Hoặc đăng nhập bằng</span>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-12 gap-2">
                    <Image
                      src="/images/logo-google.png"
                      alt="Google"
                      width={22}
                      height={22}
                      className="h-5 w-5 object-contain"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="h-12 gap-2">
                    <Image
                      src="/images/logo_zalo.png"
                      alt="Zalo"
                      width={22}
                      height={22}
                      className="h-5 w-5 object-contain"
                    />
                    Zalo
                  </Button>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-sm text-neutral-600">Bạn chưa có tài khoản? </span>
                  <Link href="/register" className="text-sm font-semibold text-red-600 hover:text-red-700">
                    Đăng ký ngay
                  </Link>
                </div>
                {/* Footer nhỏ giống cellphones (tuỳ chọn) */}
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
