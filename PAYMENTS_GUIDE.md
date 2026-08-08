# Merchant API Integration Guide (UZ)

Ushbu loyihada Payme va Click to'lov tizimlari to'liq integratsiya qilingan. Tizimni ishga tushirish uchun quyidagi qadamlarni bajaring:

## 1. Payme (Merchant Cabinet)
Payme Merchant kabinetingizga kiring va quyidagilarni sozlang:

- **Endpoint URL:** `https://your-domain.app/api/public/payme`
- **Merchant ID:** (Kabinetingizdan oling)
- **Merchant Key:** (Kabinetingizdan oling)
- **Environment Variable:** Loyihaga `PAYME_KEY` nomi bilan merchant keyni qo'shing.

## 2. Click (Merchant Cabinet)
Click Merchant kabinetingizga kiring:

- **Prepare URL:** `https://your-domain.app/api/public/click/prepare`
- **Complete URL:** `https://your-domain.app/api/public/click/complete`
- **Service ID:** (Kabinetingizdan oling)
- **Merchant ID:** (Kabinetingizdan oling)
- **Secret Key:** (Kabinetingizdan oling)
- **Environment Variable:** Loyihaga `CLICK_SECRET_KEY` nomi bilan secret keyni qo'shing.

## 3. Test qilish
To'lov jarayonini test qilish uchun:
1. Dashboard'da **Pro** rejasini tanlang.
2. To'lov tizimini tanlang (Click yoki Payme).
3. Redirect orqali to'lov sahifasiga o'ting.
4. Muvaffaqiyatli to'lovdan so'ng, tizim avtomatik ravishda `activateProForOrder` server funksiyasini chaqiradi va foydalanuvchi darajasini yangilaydi.

---
*Eslatma: Xavfsizlik uchun barcha webhooklar MD5 (Click) va Basic-auth (Payme) orqali tekshiriladi.*
