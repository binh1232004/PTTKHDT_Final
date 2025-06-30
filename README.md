# FishBig: Clothing E-Commerce Web Application

FishBig is a dynamic e-commerce web application for an online clothing store, enabling customers to browse products, add items to their cart, and complete purchases via PayPal. Built with HTML, CSS, JavaScript, Firebase, and Tawk.to, it offers a seamless shopping experience with product search, filtering, size selection, and real-time customer support through live chat. The admin dashboard supports user management, product and category management, inventory tracking, order fulfillment, and revenue analytics with exportable Excel reports, ensuring efficient store operations.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Product Browsing & Search**: Users can browse clothing items, search by keywords, and filter by categories.
- **Shopping Cart & Payments**: Supports adding products to the cart with size selection and secure checkout via PayPal.
- **Real-Time Customer Support**: Integrated Tawk.to live chat for instant assistance with customizable widgets.
- **User Order History**: Allows customers to view and track past purchases.
- **Admin & Staff Management**: Includes role-based dashboards for:
  - Admins to manage user accounts and system settings.
  - Sales staff to manage products and categories.
  - Cashiers to view revenue analytics and export Excel reports.
  - Warehouse staff to handle inventory, supplier management, and order fulfillment.
- **Inventory & Revenue Tracking**: Provides detailed inventory statistics and revenue charts for business insights.

## Tech Stack
- HTML
- CSS
- JavaScript
- Firebase (Authentication, Firestore Database, Storage)
- Tawk.to (Live Chat)

## Screenshots
1. **Homepage**: Displays featured products and navigation.  
   ![Homepage](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/Home_wyefvn.png)
2. **Product Detail Page**: Shows detailed product information and size selection.  
   ![Product Detail](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/product_detail_lbpkdw.png)
3. **Shopping Cart**: Allows users to review selected items before checkout.  
   ![Shopping Cart](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/cart_zhxvar.png)
4. **Size Selection**: Enables users to choose clothing sizes.  
   ![Size Selection](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/size_of_clothes_izfysd.png)
5. **Payment Page**: Facilitates secure checkout with PayPal.  
   ![Payment Page](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296466/page_payment_tcdhlv.png)
6. **PayPal Payment Integration**: Displays the PayPal payment dialog.  
   ![PayPal Payment](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296466/payment_with_paypal_yrqcbz.png)
7. **Order History**: Shows users their past purchases.  
   ![Order History](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/profile_history_invoice_pqfoje.png)
8. **Login Page**: Provides secure user authentication.  
   ![Login Page](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296465/login_mpemhm.png)
9. **Live Chat with Tawk.to**: Offers real-time customer support.  
   ![Live Chat](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296467/chat_th%C3%B4n_qua_tawkto_sygbly.png)
10. **Admin User Management**: Interface for admins to manage user accounts.  
    ![Admin User Management](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296468/Giao_di%E1%BB%87n_c%E1%BB%A7a_qu%E1%BA%A3n_tr%E1%BB%8B_vi%C3%AAn_qu%E1%BA%A3n_l%C3%BD_ng%C6%B0%E1%BB%9Di_d%C3%B9ng_zp5w90.png)
11. **Sales Staff Product Management**: Allows sales staff to manage product listings.  
    ![Product Management](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296466/23_Giao_di%E1%BB%87n_qu%E1%BA%A3n_l%C3%BD_s%E1%BA%A3n_ph%E1%BA%A9m_c%E1%BB%A7a_nh%C3%A2n_vi%C3%AAn_b%C3%A1n_h%C3%A0ng_ph%E1%BA%A7n_d%C6%B0%E1%BB%9Bi_gm1shy.png)
12. **Warehouse Inventory Management**: Interface for warehouse staff to manage stock.  
    ![Inventory Management](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296468/Giao_di%E1%BB%87n_c%E1%BB%A7a_th%E1%BB%A7_kho_%C4%91%E1%BB%83_qu%E1%BA%A3n_l%C3%BD_kh_wht51o.png)
13. **Warehouse Supplier Management**: Manages supplier information.  
    ![Supplier Management](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296468/Giao_di%E1%BB%87n_qu%E1%BA%A3n_l%C3%BD_nh%C3%A0_cung_c%E1%BA%A5p_c%E1%BB%A7a_th%E1%BB%A7_kho_imvgjd.png)
14. **Warehouse Import Invoice Management**: Handles import order invoices.  
    ![Import Invoice Management](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296466/18_Giao_di%E1%BB%87n_qu%E1%BA%A3n_l%C3%AD_h%C3%B3a_%C4%91%C6%A1n_nh%E1%BA%ADp_h%C3%A0ng_c%E1%BB%A7a_th%E1%BB%A7_kho_wrwddm.png)
15. **Revenue Analytics**: Displays revenue statistics with exportable charts.  
    ![Revenue Analytics](https://res.cloudinary.com/dapvvdxw7/image/upload/v1751296465/H%C3%ACnh_minh_h%E1%BB%8Da_th%E1%BB%91ng_k%C3%AA_doanh_thu_vjpvla.png)

## Prerequisites
Before setting up the project, ensure you have:
- **VS Code**: With the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension installed for running the application.
- **Git**: For cloning the repository.
- **Firebase Account**: For Authentication, Firestore Database, and Storage configuration.
- **Tawk.to Account**: For live chat integration.
- **PayPal Developer Account**: For payment integration.
- A modern web browser (e.g., Chrome, Firefox) for testing.

## Setup Instructions
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/binh1232004/PTTKHDT_Final.git
   cd PTTKHDT_Final
   ```

2. **Configure Firebase**:
   - Log in to your [Firebase Console](https://console.firebase.google.com/).
   - Create or select a project, then go to **Project Settings > General > Your apps**.
   - Add a web app to get the Firebase configuration (API key, auth domain, etc.).
   - In your project’s JavaScript code (e.g., `firebase-config.js`), initialize Firebase with the configuration. Example:
     ```javascript
     import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
     import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
     import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
     import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

     const firebaseConfig = {
       apiKey: "your_firebase_api_key",
       authDomain: "your_firebase_auth_domain",
       projectId: "your_firebase_project_id",
       storageBucket: "your_firebase_storage_bucket",
       messagingSenderId: "your_firebase_messaging_sender_id",
       appId: "your_firebase_app_id"
     };

     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);
     const storage = getStorage(app);
     ```
   - Replace the placeholder values (`your_firebase_*`) with your Firebase project’s credentials.
   - **Note**: Store the configuration securely in your JavaScript file (e.g., `firebase-config.js`) and avoid committing sensitive keys to Git. Check the repository for the exact file name.

3. **Configure Tawk.to**:
   - Log in to your [Tawk.to Dashboard](https://dashboard.tawk.to/).
   - Go to **Admin > Property Settings** to find your `Property ID` and `Widget ID`.
   - Add the Tawk.to script to your HTML files (e.g., `index.html`). Example:
     ```html
     <script type="text/javascript">
       var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
       (function(){
         var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
         s1.async=true;
         s1.src='https://embed.tawk.to/your_property_id/your_widget_id';
         s1.charset='UTF-8';
         s1.setAttribute('crossorigin','*');
         s0.parentNode.insertBefore(s1,s0);
       })();
     </script>
     ```
   - Replace `your_property_id` and `your_widget_id` with your Tawk.to credentials.
   - **Note**: Add this script to the appropriate HTML file (e.g., `index.html`) as per the repository’s structure.

4. **Configure PayPal**:
   - Log in to your [PayPal Developer Dashboard](https://developer.paypal.com/).
   - Create a sandbox or live app under **My Apps & Credentials**.
   - Obtain the `Client ID` and add it to your JavaScript code for PayPal integration. Example:
     ```html
     <script src="https://www.paypal.com/sdk/js?client-id=your_paypal_client_id"></script>
     ```
   - Replace `your_paypal_client_id` with your PayPal Client ID.
   - **Note**: Add this script to the relevant HTML file (e.g., `payment.html`) handling PayPal payments, as per the repository’s structure.

## Running the Application
1. Open the project in **VS Code**:
   - Launch VS Code and open the `PTTKHDT_Final` folder:
     ```bash
     code .
     ```

2. **Start Live Server**:
   - Ensure the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension is installed in VS Code.
   - Open the `index.html` file in VS Code.
   - Right-click on `index.html` and select **Open with Live Server**, or click the "Go Live" button in the VS Code status bar.
   - The application will open in your default browser.

   **Note**: Ensure your Firebase, Tawk.to, and PayPal accounts are active and properly configured before running the application. Verify the configuration files (e.g., `firebase-config.js`) for correct credentials.

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
