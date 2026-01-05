# BOSH PARFUME - Core RESTful API Service

![Backend](https://img.shields.io/badge/Type-REST%20API-green)
![Security](https://img.shields.io/badge/Auth-JWT%20Protected-red)

## 🧠 Overview
Repository ini merupakan "Otak" dari ekosistem BOSH PARFUME. Bertanggung jawab atas manajemen data terpusat, otentikasi, dan penyediaan sumber daya melalui protokol HTTP/JSON. Backend ini dirancang dengan prinsip **Stateless**, memungkinkan skalabilitas horizontal yang mudah saat trafik pengguna meningkat.

## ⚙️ Core Responsibilities
- **Data Orchestration:** Mengelola siklus hidup data produk, banner, dan informasi tim pengembang.
- **Resource Delivery:** Menyediakan aset gambar dan metadata melalui endpoint yang teroptimasi.
- **Content Security:** Menjaga integritas data agar hanya dapat dimodifikasi melalui hak akses yang sah.

## 📡 API Endpoints (Documentation)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch all curated fragrance products. |
| `GET` | `/api/products/tag/:id` | Filter products based on specific aroma tags. |
| `GET` | `/api/banners` | Get latest promotional hero banners. |
| `GET` | `/api/developers` | Retrieve development team information. |

## 🔗 Institution Reference
- **UIN Sunan Gunung Djati Bandung:** [https://uinsgd.ac.id/](https://uinsgd.ac.id/)
- **Jurusan Informatika:** [http://if.uinsgd.ac.id/](http://if.uinsgd.ac.id/)

## 📽 Pitch Deck
Dokumentasi alur sistem dan arsitektur database dapat dilihat di:
👉 **[Link Pitch Deck BOSH PARFUME Di Sini]**
