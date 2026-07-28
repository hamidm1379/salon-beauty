"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Clock,
  User,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { useServices } from "@/hooks/use-services";
import { useAvailableSlots } from "@/hooks/use-available-slots";
import { useCreateAppointment } from "@/hooks/use-create-appointment";

const bookingSchema = z.object({
  serviceId: z.string().min(1, "سرویس را انتخاب کنید"),
  date: z.string().min(1, "تاریخ را انتخاب کنید"),
  time: z.string().min(1, "ساعت را انتخاب کنید"),
  customerName: z.string().min(2, "نام حداقل ۲ کاراکتر باشد"),
  customerEmail: z.string().email("ایمیل نامعتبر است"),
  customerPhone: z.string().min(10, "شماره تلفن نامعتبر است").optional(),
  notes: z.string().max(500, "حداکثر ۵۰۰ کاراکتر").optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialServiceId?: string;
}

const STEPS = [
  { id: 1, label: "انتخاب سرویس", icon: CheckCircle2 },
  { id: 2, label: "انتخاب تاریخ", icon: CalendarDays },
  { id: 3, label: "انتخاب ساعت", icon: Clock },
  { id: 4, label: "اطلاعات شما", icon: User },
  { id: 5, label: "تایید نهایی", icon: CheckCircle2 },
];

export function BookingForm({ initialServiceId }: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || "");

  const { data: servicesData, isLoading: servicesLoading } = useServices();
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(
    selectedDate || null,
    selectedServiceId || null
  );
  const createAppointment = useCreateAppointment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: initialServiceId || "",
      date: "",
      time: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      notes: "",
    },
  });

  const services = servicesData?.items || [];
  const slots = slotsData || [];
  const watchedServiceId = watch("serviceId");
  const watchedDate = watch("date");

  const selectedService = services.find((s) => s.id === (watchedServiceId || selectedServiceId));

  const generateDates = () => {
    const dates = [];
    const today = startOfDay(new Date());
    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      dates.push({
        value: format(date, "yyyy-MM-dd"),
        label: format(date, "EEEE"),
        day: format(date, "d"),
        month: format(date, "MMMM"),
        isToday: i === 0,
      });
    }
    return dates;
  };

  const dates = generateDates();

  const handleServiceSelect = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setValue("serviceId", serviceId, { shouldValidate: true });
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setValue("date", date, { shouldValidate: true });
    setSelectedTime("");
    setValue("time", "");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue("time", time, { shouldValidate: true });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!watchedServiceId;
      case 2:
        return !!watchedDate;
      case 3:
        return !!selectedTime;
      case 4:
        return !!watch("customerName") && !!watch("customerEmail");
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: BookingFormData) => {
    createAppointment.mutate(
      {
        ...data,
        date: data.date,
      },
      {
        onSuccess: () => {
          setCurrentStep(5);
        },
      }
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">سرویس مورد نظر خود را انتخاب کنید</h3>
            {servicesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : (
              <div className="grid gap-3">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceSelect(service.id)}
                    className={cn(
                      "p-4 rounded-2xl border-2 text-right transition-all hover:scale-[1.01]",
                      watchedServiceId === service.id
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
                        : "border-gray-200 hover:border-[var(--color-primary)]/50"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[var(--color-ink)]">{service.name}</p>
                        <p className="text-sm text-[var(--color-ink-muted)] mt-1">
                          {service.category.name} • {service.duration} دقیقه
                        </p>
                      </div>
                      <p className="text-lg font-bold text-[var(--color-primary)]">
                        {service.price.toLocaleString("fa-IR")} تومان
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">تاریخ مورد نظر را انتخاب کنید</h3>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => (
                <button
                  key={date.value}
                  type="button"
                  onClick={() => handleDateSelect(date.value)}
                  className={cn(
                    "p-3 rounded-xl text-center transition-all hover:scale-105",
                    watchedDate === date.value
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-soft)] hover:bg-[var(--color-primary)]/10",
                    date.isToday && "ring-2 ring-[var(--color-primary)]/30"
                  )}
                >
                  <p className="text-xs text-[var(--color-ink-muted)]">{date.label}</p>
                  <p className="text-lg font-bold">{date.day}</p>
                  <p className="text-xs">{date.month}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">ساعت مورد نظر را انتخاب کنید</h3>
            {slotsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[var(--color-primary)]" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={cn(
                      "p-3 rounded-xl text-center transition-all",
                      !slot.available && "opacity-50 cursor-not-allowed bg-gray-100",
                      slot.available && selectedTime !== slot.time && "bg-[var(--color-bg-soft)] hover:bg-[var(--color-primary)]/10",
                      selectedTime === slot.time && "bg-[var(--color-primary)] text-white"
                    )}
                  >
                    <p className="font-medium">{slot.time}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--color-ink)]">اطلاعات خود را وارد کنید</h3>
            <Input
              label="نام کامل"
              placeholder="نام و نام خانوادگی"
              error={errors.customerName?.message}
              {...register("customerName")}
            />
            <Input
              label="ایمیل"
              type="email"
              placeholder="example@email.com"
              error={errors.customerEmail?.message}
              {...register("customerEmail")}
            />
            <Input
              label="شماره تلفن (اختیاری)"
              type="tel"
              placeholder="09123456789"
              error={errors.customerPhone?.message}
              {...register("customerPhone")}
            />
            <Textarea
              label="یادداشت (اختیاری)"
              placeholder="توضیحات اضافی..."
              error={errors.notes?.message}
              {...register("notes")}
            />
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-ink)]">نوبت شما با موفقیت ثبت شد!</h3>
            <div className="bg-[var(--color-bg-soft)] rounded-2xl p-6 text-right space-y-3">
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-muted)]">سرویس:</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-muted)]">تاریخ:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-muted)]">ساعت:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-muted)]">نام:</span>
                <span className="font-medium">{watch("customerName")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-ink-muted)]">ایمیل:</span>
                <span className="font-medium">{watch("customerEmail")}</span>
              </div>
              {selectedService && (
                <div className="flex justify-between border-t pt-3">
                  <span className="text-[var(--color-ink-muted)]">مبلغ قابل پرداخت:</span>
                  <span className="font-bold text-[var(--color-primary)]">
                    {selectedService.price.toLocaleString("fa-IR")} تومان
                  </span>
                </div>
              )}
            </div>
            <p className="text-sm text-[var(--color-ink-muted)]">
              اطلاعات تکمیلی از طریق ایمیل برای شما ارسال خواهد شد.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  currentStep >= step.id
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-1 mx-2 transition-all",
                    currentStep > step.id ? "bg-[var(--color-primary)]" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronRight className="w-4 h-4 ml-2" />
              قبلی
            </Button>
            {currentStep < 4 ? (
              <Button type="button" onClick={handleNext} disabled={!canProceed()}>
                بعدی
                <ChevronLeft className="w-4 h-4 mr-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                isLoading={createAppointment.isPending}
                disabled={!canProceed()}
              >
                تایید و رزرو
              </Button>
            )}
          </div>
        )}

        {currentStep === 5 && (
          <div className="mt-6 text-center">
            <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
              رزرو مجدد
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
