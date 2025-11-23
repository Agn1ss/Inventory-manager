# Inventory Management Web Application

A full-featured web application for creating, managing, and sharing customizable **inventories** (e.g., office equipment, books, HR documents, etc.).  
Users define **inventory templates with custom fields**, and other users fill them with **items**.

---

## ✨ Features Overview

### Technology Stack
  - Frontend: **React**, **Bootstrap**, **Zustand**, **i18**
  - Backend: **Node.js**, **Express**, **PostgreSQL**, **Prisma**
  - Integrations: **Power Automate**


## 📦 Core Functionality

### 🗂 Inventories

- Create inventories with:
  - Name
  - Description with Markdown
  - Category (single predefined value)
  - Tags with autocomplete
  - Optional image uploaded to cloud
- Custom fields (up to 3 per type):
  - Single-line text
  - Multiline text
  - Numeric
  - Boolean (checkbox)
  - Document/image links
- Inventories must be displayed **in table format only**
- Full-text search on every page
- Public or user-specific write access
- Optimistic locking for concurrent editing

### 📝 Items

- Belong to a specific inventory
- Use inventory-defined fields
- Displayed in table format
- Authenticated users may add items to public inventories
- Support:
  - Custom editable ID
  - Likes (max 1 per user)
  - Fixed fields (created_by, created_at, etc.)
- Optimistic locking required

---

## 🔢 Custom ID Generator

Each inventory defines its own ID generation format.

Supported ID components:

- Fixed Unicode text
- Random numbers:
  - 20-bit random
  - 32-bit random
  - 6-digit random
  - 9-digit random
- GUID
- Timestamp
- Auto-incrementing sequence

## 🔗 Power Automate Integration Overview

The system allows any registered user to submit a **Help Ticket** directly from the application.  
When a ticket is created, the client sends a **JSON payload** to the cloud endpoint.  
A **Power Automate flow** is configured as the target for this event.

The flow:

1. **Receives the JSON** with ticket details  
2. **Parses and validates** the submitted data  
3. **Sends an email** to the administrator containing the problem summary and metadata  
4. **Dispatches a mobile push notification** to the support team, ensuring quick reaction  

#### help form
<img width="310" height="431" alt="image" src="https://github.com/user-attachments/assets/2cfa8797-00cf-42b9-b0c2-78b371fa4587" />

---

## 📊 Pages

### Main Page
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/263e2f62-e921-4eb0-86f9-748acfe85f98" />

### User Page
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/9d689f58-938e-4a9c-a2b1-702313d01781" />

### Inventory Items Page
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/1d6a4e4f-8753-44a3-b6ad-44f090925513" />

### Inventory Editor Page
<img width="600" height="500" alt="image" src="https://github.com/user-attachments/assets/731175d6-5133-4e12-a8e4-ed1a10b4c317" />

---

## 👤 Authentication & Users

### Authentication

- OAuth required **Google + Facebook**
- Registration/login required for all write operations

### Guests Can:

- View inventories
- View items
- Use search

### Guests Cannot:

- Create inventories
- Add/edit/delete items

### User Profile Page

Two tables:

1. Inventories owned  
2. Inventories with write access  

Both support filtering, sorting, editing, and creating.

---

## 👮 Permission System

### Inventory Editing Allowed For:

- Inventory creator  
- Administrators  

Editable sections:

- Fields
- Access permissions
- Custom ID settings
- General settings

### Item Editing Allowed For:

- Creator
- Administrators
- Users with write permissions
- Any authenticated user (public inventories)

### Access Management Panel

- Add/remove users
- Autocomplete by name/email
- Sortable list (by name or email)

---

## 🌐 Internationalization & Theming

- At least 2 languages (English + one more)
- At least 2 themes (Light / Dark)
- User settings are saved in cookies.

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Agn1ss/Inventory-manager.git
