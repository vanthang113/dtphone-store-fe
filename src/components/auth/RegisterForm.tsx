'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
    Calendar,
    Check,
    Eye,
    EyeOff,
    ChevronRight,
    ArrowLeft,
    GraduationCap,
} from 'lucide-react';
import { useRegisterMutation } from '@/store/features/authApi'

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: '',
        birthday: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        promotionConsent: false,
        isStudent: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [registerUser, { isLoading }] = useRegisterMutation();

    const handleInputChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCheckboxChange = (name: string) => (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };
    const handleSwitchChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            isStudent: e,
        }));
    };
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Basic validation
        if (!formData.name?.trim()) return setErrorMessage('Vui lòng nhập họ và tên');
        if (!formData.phone?.trim()) return setErrorMessage('Vui lòng nhập số điện thoại');
        if (!formData.password) return setErrorMessage('Vui lòng nhập mật khẩu');
        if (formData.password !== formData.confirmPassword) return setErrorMessage('Mật khẩu nhập lại không khớp');

        // Build payload for API
        let dateOfBirth: string | undefined = undefined;
        if (formData.birthday) {
            const d = new Date(formData.birthday);
            if (!isNaN(d.getTime())) {
                dateOfBirth = d.toISOString();
            }
        }

        const payload = {
            full_name: formData.name,
            email: formData.email || '',
            phone: formData.phone,
            gender: undefined as string | undefined,
            date_of_birth: dateOfBirth,
            avatar_url: undefined as string | undefined,
            password: formData.password,
        };

        try {
            if (!payload.email) {
                return setErrorMessage('Bạn cần nhập email để thực hiện xác minh tài khoản.');
            }
            const res: any = await registerUser(payload).unwrap();
            // API trả về: { message, email }
            const emailForVerify = res?.email || payload.email;
            setSuccessMessage(res?.message || 'Đăng ký thành công! Chuyển đến trang xác minh email...');
            // điều hướng tới trang xác minh email kèm query email
            setTimeout(() => {
                window.location.href = `/verify-email?email=${encodeURIComponent(emailForVerify)}`;
            }, 1000);
        } catch (err: any) {
            console.error('Register error:', err);
            setErrorMessage(
                err?.data?.detail || err?.data?.message || err?.message || 'Đăng ký thất bại. Vui lòng thử lại.'
            );
        }
    };

    return (
        <div className="w-full max-w-[800px] mx-auto flex flex-col justify-center items-center gap-2 tablet:gap-4">
             <div className="w-full flex justify-between items-center gap-4 tablet:gap-6 mb-8 tablet:mb-10">
            <Link href="/" className="flex-shrink-0 flex justify-center tablet:justify-start">
                <Image
                    src="/images/logo-dt.png"
                    alt="DTPhone"
                    width={300}
                    height={90}
                    // ↓ nhỏ lại so với trước
                    className="h-16 tablet:h-20 laptop:h-24 w-auto object-contain"
                    priority
                />
            </Link>
                <h1 className="text-xl tablet:text-3xl laptop:text-4xl max-w-[530px] font-bold text-red-600 flex-1">
                   Đăng ký trở thành SMEMBER
                </h1>
             </div>
            {/* Ảnh hero dưới logo - nhỏ ở giữa */}
                  <div className="w-full flex justify-center mt-2 tablet:mt-4 mb-2 tablet:mb-4">
                    <Image
                      src="/images/auth/robo-like.png"
                      alt="DTPhone mascot"
                      width={300}
                      height={120}
                      className="w-32 tablet:w-40 laptop:w-48 h-auto object-contain"
                      priority
                    />
                  </div>
            <span className="font-regular text-sm tablet:text-lg text-neutral-500">
                Đăng ký bằng tài khoản mạng xã hội
            </span>
            <div className="w-full flex gap-2 tablet:gap-6 justify-between items-center max-w-[450px]">
                <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 flex-1 min-w-[100px] tablet:min-w-[120px] min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base"
                >
                    <Image
                        src="/images/logo-google.png"
                        alt="Google"
                        width={25}
                        height={24}
                        className="w-[20px] h-[20px] tablet:w-[25px] tablet:h-[24px] object-contain"
                    />
                    Google
                </Button>
                <div className="w-[5px] h-[5px] tablet:w-[7px] tablet:h-[7px] rounded-full bg-neutral-200 flex-shrink-0"></div>

                <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 flex-1 min-w-[100px] tablet:min-w-[120px] min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base"
                >
                    <Image
                        src="/images/auth/logo_zalo.png"
                        alt="Zalo"
                        width={25}
                        height={24}
                        className="w-[20px] h-[20px] tablet:w-[25px] tablet:h-[24px] object-contain"
                    />
                    Zalo
                </Button>
            </div>
            <span className="font-regular text-sm tablet:text-lg text-neutral-500">
                Hoặc điền thông tin sau
            </span>
            <form
                className="w-full flex flex-col gap-3 tablet:gap-4 relative px-2 tablet:px-0"
                onSubmit={handleSubmit}
            >
                <h2 className="font-bold text-base tablet:text-xl">Thông tin cá nhân</h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 tablet:gap-4 items-stretch">
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="name" className="text-sm tablet:text-base font-medium">
                            Họ và tên
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Nhập họ và tên"
                            maxLength={255}
                            className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base"
                        />
                    </div>
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="phone" className="text-sm tablet:text-base font-medium">
                            Số điện thoại
                        </Label>
                        <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Nhập số điện thoại"
                            maxLength={10}
                            className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base"
                        />
                    </div>
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="birthday" className="text-sm tablet:text-base font-medium">
                            Ngày sinh
                        </Label>
                        <div className="relative">
                            <Input
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleInputChange}
                                placeholder="Nhập ngày sinh"
                                className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10"
                            >
                                <Calendar className="h-4 w-4 tablet:h-5 tablet:w-5 text-neutral-600" />
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="email" className="text-sm tablet:text-base font-medium">
                            Email{' '}
                            <span className="text-xs tablet:text-sm font-regular text-neutral-400">
                                (Không bắt buộc)
                            </span>
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Nhập email"
                            maxLength={255}
                            className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base"
                        />
                        <div className="flex items-center gap-1 tablet:gap-2 text-positive-700 text-xs tablet:text-sm">
                            <Check className="h-3 w-3 tablet:h-4 tablet:w-4" />
                            Hóa đơn VAT khi mua hàng sẽ được gửi qua email này
                        </div>
                    </div>
                </div>
                <h2 className="font-bold text-base tablet:text-xl">Tạo mật khẩu</h2>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 tablet:gap-4 items-stretch">
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="password" className="text-sm tablet:text-base font-medium">
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
                                className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 tablet:h-5 tablet:w-5 text-neutral-600" />
                                ) : (
                                    <Eye className="h-4 w-4 tablet:h-5 tablet:w-5 text-neutral-600" />
                                )}
                            </Button>
                        </div>
                        <div className="flex items-center gap-1 tablet:gap-2 text-positive-700 text-xs tablet:text-sm">
                            <Check className="h-3 w-3 tablet:h-4 tablet:w-4" />
                            Mật khẩu tối thiểu 6 ký tự, có ít nhất 1 chữ số và 1 số
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 tablet:gap-2">
                        <Label htmlFor="confirmPassword" className="text-sm tablet:text-base font-medium">
                            Nhập lại mật khẩu
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Nhập lại mật khẩu của bạn"
                                className="min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full w-10"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 tablet:h-5 tablet:w-5 text-neutral-600" />
                                ) : (
                                    <Eye className="h-4 w-4 tablet:h-5 tablet:w-5 text-neutral-600" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-3 tablet:gap-4 items-stretch py-3 tablet:py-4">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="promotionConsent"
                            checked={formData.promotionConsent}
                            onCheckedChange={handleCheckboxChange('promotionConsent')}
                        />
                        <Label
                            htmlFor="promotionConsent"
                            className="text-sm tablet:text-base font-regular"
                        >
                            Đăng ký nhận tin khuyến mãi từ CellphoneS
                        </Label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Label className="text-sm tablet:text-base font-regular inline-block">
                            Bằng việc Đăng ký, bạn đã đọc và đồng ý với{' '}
                            <Link
                                href="https://cellphones.com.vn/tos"
                                className="font-bold text-info-500"
                                target="_blank"
                            >
                                Điều khoản sử dụng
                            </Link>{' '}
                            và{' '}
                            <Link
                                href="https://cellphones.com.vn/tos?part=privacy-policy"
                                className="font-bold text-info-500"
                                target="_blank"
                            >
                                Chính sách bảo mật của CellphoneS
                            </Link>.
                        </Label>
                    </div>
                </div>
                {errorMessage && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">{successMessage}</p>
                    </div>
                )}

                <div className="shadow-group-button w-full z-10 box-content grid px-2 tablet:px-8 py-3 tablet:py-4 grid-cols-2 gap-3 tablet:gap-4 sticky bottom-0 left-0 right-0 bg-white -translate-x-2 tablet:-translate-x-4">
                    <Button
                        variant="outline"
                        className="w-full min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base font-medium"
                        asChild
                    >
                        <Link href="/login">
                            <ArrowLeft className="h-4 w-4 tablet:h-5 tablet:w-5 mr-2 tablet:inline-block hidden" />
                            Quay lại đăng nhập
                        </Link>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full min-h-[40px] tablet:min-h-[48px] text-sm tablet:text-base font-medium bg-red-500 hover:bg-red-700 text-white disabled:opacity-50"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                    </Button>
                </div>
            </form>
        </div>
    );
}