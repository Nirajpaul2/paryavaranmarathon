# पर्यावरण मैराथन 2026 (Paryavaran Marathon Samastipur)

> **हर कदम प्रकृति के नाम • Fit For a Greener Tomorrow**  
> Official Registration & Race Management Web Platform for Paryavaran Marathon (5 KM Run).

---

## 🏃 About The Event
- **Event**: पर्यावरण मैराथन 2026 (Paryavaran Marathon)
- **Distance**: 5 KM Run
- **Registration Fee**: ₹99/-
- **Date**: 27 सितंबर 2026 (रविवार)
- **Reporting Time**: 05:15 AM IST | **Race Start**: 06:00 AM IST
- **Venue**: राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी, मालती, समस्तीपुर
- **Founder / Organizer**: संस्थापक: नीरज स्टार
- **Official Helpline**: 8340477782
- **Official Payee UPI ID**: `7367050371@ybl` (SAURABH KUMAR)
- **Official Domain**: [https://paryavaranmarathon.nirajpaul.com](https://paryavaranmarathon.nirajpaul.com)

---

## 🏆 Prizes (आकर्षक पुरस्कार)
- 🥇 **प्रथम पुरस्कार**: साइकिल (Bicycle)
- 🥈 **द्वितीय पुरस्कार**: रनिंग शूज (Running Shoes)
- 🥉 **तृतीय पुरस्कार**: रनिंग जर्सी (Running Jersey)
- 🎖️ **Top 10 धावक**: विशेष पुरस्कार
- 🏅 **Top 30 धावक**: मेडल
- 🎁 **विशेष बोनस**: सभी पंजीकृत धावकों को सनातन धाम App की 1 महीने की मुफ्त सेवा

---

## ✨ Features

- **Online Participant Registration (`/register`)**:
  - Validated participant data (Name, Phone, Email, DOB, Gender, Emergency Contact, T-shirt size, Running Experience).
  - Instant generation of unique registration IDs.
- **1-Tap Mobile UPI Payment (`/payment/[id]`)**:
  - Seamless mobile deep linking via universal `upi://pay` URI.
  - Direct 1-tap app openers for **PhonePe**, **Google Pay**, and **Paytm**.
  - 1-click **Copy UPI ID** utility (`7367050371@ybl`).
  - High-res PhonePe QR Scanner for laptop/desktop participants.
  - UTR / Reference ID submission with screenshot upload for manual race director verification.
- **Participant Status Lookup (`/lookup`)**:
  - Instant status search by Mobile Number, Registration ID, or Email.
  - Direct links to complete pending payment or view the confirmed pass.
- **Digital Bib & Registration Pass (`/card/[id]`)**:
  - High-resolution printable race pass with participant photo, QR code, and official verification watermark.
- **Race Admin Portal (`/admin/*`)**:
  - Protected admin dashboard (`/admin/dashboard`).
  - Manual payment review queue (`/admin/payments`) with 1-click Approve and Reject (with reason).
  - Secure payment receipt proof viewer (`/api/admin/proof/[id]`).
  - Participant management (`/admin/registrations`).
  - Live event settings editor (`/admin/settings`).
  - Comprehensive audit trail (`/admin/audit-log`).
  - CSV export for on-ground race day reporting (`/api/admin/export`).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/) (SQLite default, PostgreSQL compatible)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: JWT Cookie-based Admin Sessions with `bcryptjs`

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- npm or pnpm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Nirajpaul2/paryavaranmarathon.git
cd paryavaranmarathon

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration in `.env`:
```env
DATABASE_URL="file:./marathon.db"
MARATHON_AUTH_SECRET="your-secret-key-here"
PORT=3010
MARATHON_PUBLIC_URL="http://localhost:3010"
MARATHON_STORAGE_DIR="./uploads"
```

### 4. Database Setup & Seeding
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed default admin and event settings
npm run prisma:seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3010](http://localhost:3010) in your browser.

### 6. Production Build
```bash
npm run build
npm start
```

---

## 📄 License
Private & Proprietary — पर्यावरण मैराथन (Paryavaran Marathon Samastipur).
