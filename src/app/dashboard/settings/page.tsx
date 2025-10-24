"use client";

import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Languages, Sun, Moon, Laptop, Bell, UserCog, Scan, AlertCircle } from "lucide-react";
import { aiSensitivityAtom } from "@/lib/state/settings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useAtom(aiSensitivityAtom);
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">الإعدادات</h1>
        <p className="text-muted-foreground">
          إدارة الإعدادات العامة والتفضيلات وتكوين الحساب.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* General & Appearance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                الإعدادات العامة والمظهر
              </CardTitle>
              <CardDescription>
                تخصيص مظهر التطبيق ولغته.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="grid w-full items-center gap-4">
                  <Label>المظهر</Label>
                  <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex space-x-2 md:space-x-4">
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label htmlFor="light" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Sun className="h-6 w-6" />
                        فاتح
                      </Label>
                    </div>
                     <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label htmlFor="dark" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Moon className="h-6 w-6" />
                        داكن
                      </Label>
                    </div>
                     <div>
                      <RadioGroupItem value="system" id="system" className="peer sr-only" />
                      <Label htmlFor="system" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Laptop className="h-6 w-6" />
                        النظام
                      </Label>
                    </div>
                  </RadioGroup>
               </div>
               <div className="grid w-full items-center gap-4">
                  <Label htmlFor="language">اللغة</Label>
                  <Select defaultValue="ar">
                      <SelectTrigger id="language" className="w-full md:w-[180px]">
                          <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                  </Select>
               </div>
            </CardContent>
          </Card>

           {/* Account Management Card */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog />
                إدارة الحساب
              </CardTitle>
              <CardDescription>
                تحديث معلومات ملفك الشخصي وكلمة المرور.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">الاسم</Label>
                      <Input id="name" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <Input id="email" type="email" defaultValue="admin@networkguardian.com" disabled />
                  </div>
               </div>
               <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                    <Input id="password" type="password" placeholder="اتركه فارغًا لعدم التغيير" />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>حفظ التغييرات</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
            {/* AI & Automation Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <BrainCircuit />
                الذكاء الاصطناعي والأتمتة
                </CardTitle>
                <CardDescription>
                ضبط سلوك الميزات الذكية والمهام الآلية.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="sensitivity">مستوى حساسية الذكاء الاصطناعي للكشف</Label>
                <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as any)}>
                    <SelectTrigger id="sensitivity">
                    <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="normal">عادي</SelectItem>
                    <SelectItem value="high">مرتفع</SelectItem>
                    <SelectItem value="paranoid">مذعور</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">"مذعور" سيبلغ عن أدنى الانحرافات.</p>
                </div>
                 <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="auto-scan">عمليات الفحص الأمني التلقائية</Label>
                <Select defaultValue="weekly">
                    <SelectTrigger id="auto-scan">
                        <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">يوميًا</SelectItem>
                        <SelectItem value="weekly">أسبوعيًا</SelectItem>
                        <SelectItem value="never">أبدًا</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Bell />
                    الإشعارات
                    </CardTitle>
                    <CardDescription>
                    اختر كيف ومتى تريد أن يتم إعلامك.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-base">
                                تنبيهات البريد الإلكتروني
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                تلقي التنبيهات الهامة عبر البريد الإلكتروني.
                            </p>
                        </div>
                        <Switch id="email-notifications" />
                    </div>
                    <div>
                        <Label>إعلام لـ :</Label>
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="notify-threat" defaultChecked />
                                <Label htmlFor="notify-threat" className="font-normal">تم الكشف عن تهديد أمني</Label>
                            </div>
                             <div className="flex items-center gap-2">
                                <Checkbox id="notify-new-device" defaultChecked />
                                <Label htmlFor="notify-new-device" className="font-normal">جهاز جديد متصل</Label>
                            </div>
                             <div className="flex items-center gap-2">
                                <Checkbox id="notify-offline" />
                                <Label htmlFor="notify-offline" className="font-normal">جهاز مهم غير متصل</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
