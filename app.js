// =======================
// Supabase Setup
// =======================
const SUPABASE_URL = "https://aqigfslktrsazoxfsiqm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImllbmpneWpubmZsem9oYWVpaWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDM5ODcsImV4cCI6MjA4ODcxOTk4N30.Z0UnZe7LN610JcDDxr6jXFhXkHu_zvR15NykUkg2ee4";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// =======================
// Signup
// =======================
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const store_name = document.getElementById('store_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const whatsapp = document.getElementById('whatsapp').value;

    const { data, error } = await supabase.from('sellers').insert([
      { store_name, email, password, whatsapp, subscription_status: 'trial', subscription_end: new Date(Date.now() + 7*24*60*60*1000) }
    ]);

    if (error) alert('Error: ' + error.message);
    else alert('Signup successful! Login now.');
  });
}

// =======================
// Login
// =======================
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const { data: sellers, error } = await supabase.from('sellers')
      .select('*')
      .eq('email', email)
      .eq('password', password);

    if (error) alert('Error: ' + error.message);
    else if (sellers.length === 0) alert('Invalid credentials');
    else {
      alert('Login successful!');
      window.location.href = 'admin.html';
    }
  });
}

// =======================
// Forgot Password
// =======================
const forgotForm = document.getElementById('forgot-form');
if (forgotForm) {
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });

    if (error) alert('Error: ' + error.message);
    else alert('Password reset link sent to your email!');
  });
}

// =======================
// Load Categories, Products, Sellers (Home Page)
// =======================
async function loadData() {
  const catContainer = document.getElementById('categories');
  const prodContainer = document.getElementById('products');
  const sellerContainer = document.getElementById('sellers');

  if (catContainer) {
    const { data: categories } = await supabase.from('categories').select('*');
    categories.forEach(c => {
      const div = document.createElement('div');
      div.classList.add('category-item');
      div.textContent = c.name;
      catContainer.appendChild(div);
    });
  }

  if (prodContainer) {
    const { data: products } = await supabase.from('products').select('*');
    products.forEach(p => {
      const div = document.createElement('div');
      div.classList.add('product-item');
      div.innerHTML = `<img src="${p.image}" alt="${p.name}" style="width:100px"><br>${p.name}<br>R${p.price}`;
      prodContainer.appendChild(div);
    });
  }

  if (sellerContainer) {
    const { data: sellers } = await supabase.from('sellers').select('*');
    sellers.forEach(s => {
      const div = document.createElement('div');
      div.classList.add('seller-item');
      div.innerHTML = `<img src="${s.logo}" alt="${s.store_name}" style="width:100px"><br>${s.store_name}`;
      sellerContainer.appendChild(div);
    });
  }
}

loadData();