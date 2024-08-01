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
npm install
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

6. Jalankan Migrasi

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

1. Landing Page

![Landing Page](https://github.com/user-attachments/assets/a1d2e22b-d335-4774-b82e-bfcfc2b1ceca)


2. Login Page

![Login Page](https://github.com/user-attachments/assets/9e1e6e76-29ab-4be7-929f-3135f9d00698)


3. Dashboard Page

![Dashboard Page](https://github.com/user-attachments/assets/cd6aa6ea-9e0c-47a6-b19d-7b7f39d5ed0d)


4. Select Difficulty

![Start Quiz](https://github.com/user-attachments/assets/b3820744-1a49-41e3-a2fe-10d54e940aab)


5. Quiz Page

![Quiz Page 1](https://github.com/user-attachments/assets/5bbf4944-cff2-4318-84ca-89064811e1cb)


![Quiz Page 2](https://github.com/user-attachments/assets/86a26b7e-90f4-4cd9-a7fd-b531cd3a545d)

6. Result Page

![Result Page](https://github.com/user-attachments/assets/74f5b932-98e5-49a2-85a1-ee2613cc3af8)
