## Pengenalan

Repositori ini merupakan quiz app sederhana, ini merupakan challenge yang diberikan oleh DOT Indonesia untuk memenuhi persyaratan magang yaitu membuat quiz app dengan menggunakan React.

## Fitur

#### 1. Login

- Pengguna dapat login dengan menggunakan username dan password yang sudah dibuat di database.

#### 2. Logout

- Pengguna dapat logout dengan menggunakan access token yang sudah dibuat di database.

#### 3. Quiz

- Pengguna dapat mengerjakan quiz dimana pada awalnya akan diberikan pilihan kategori dan juga tingkat kesulitan.

- Pada saat pengerjaan quiz, user akan diberikan waktu / timer dimana ketika timer habis, maka quiz akan berakhir, dan pada saat memilih jawaban maka user akan langsung berpindah soal berikutnya.

#### 4. Quiz Result

- Pengguna dapat melihat hasil quiz yang telah dikerjakan.

## Teknologi

- React
- TypeScript
- Node
- Express
- MySQL
- Drizzle ORM
- Tailwind CSS
- Shadcn UI

## Instalasi

1. Clone repository dengan menggunakan terminal

```bash
git clone https://github.com/vunky-himawan/quizin.git
```

2. Install dependensi

```bash
npm install or pnpm install
```

3. Buat file .env

```bash
cp .env.example .env
```

4. Tambahkan access token and jwt secret di .env

```bash
ACCESS_TOKEN=your_access_token
JWT_SECRET=your_jwt_secret
```

5. Buat database

```bash
mysql -u root -p
create database quiz_app;
exit
```

6. Jalankan migrasi

```bash
npx drizzle-kit migrate
```

7. Jalankan seeder

```bash
npm run db:seed
```

8. Jalankan aplikasi

```bash
npm run dev
```

## Screenshot

![Screenshot 2024-07-28 170815](https://github.com/user-attachments/assets/a1d2e22b-d335-4774-b82e-bfcfc2b1ceca)