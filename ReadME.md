# BookHT - Microservices Architecture

## Giới thiệu
BookHT là hệ thống quản lý bán sách được xây dựng theo kiến trúc **Microservices** sử dụng **Spring Boot** và **Spring Cloud**.  
Mục tiêu:
- Quản lý người dùng, sách, đơn hàng độc lập.
- Dễ mở rộng, bảo trì và triển khai.
- Hỗ trợ giao tiếp giữa các service qua REST API hoặc message broker.

---

## Cấu trúc thư mục

```plaintext
BookHT/
│
├── service-identity/      # Quản lý người dùng, xác thực, phân quyền (JWT, Spring Security)
├── service-book/          # Quản lý sách, danh mục, tồn kho
├── service-order/         # Quản lý đơn hàng, thanh toán
├── api-gateway/           # API Gateway (Spring Cloud Gateway)
├── service-discovery/     # Service Discovery (Eureka Server)
└── pom.xml                # Pom cha (multi-module Maven)
