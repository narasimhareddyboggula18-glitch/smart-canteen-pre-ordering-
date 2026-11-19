/**
 * Supabase Service & Database Query Utility
 * CampusBite · Project yydlpwulcpuamowzpcbj
 * 
 * Tables:
 *   1. public.profiles (Login & User Accounts)
 *   2. public.orders   (Canteen Orders)
 * 
 * Usage:
 *   node scripts/supabase-service.js test
 *   node scripts/supabase-service.js profiles
 *   node scripts/supabase-service.js orders
 *   node scripts/supabase-service.js users
 *   node scripts/supabase-service.js create-user <email> <password> [name]
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://yydlpwulcpuamowzpcbj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_nndc9wySaYeJOweah_Gr4A_HO555EU2";
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "";

if (!SUPABASE_SECRET_KEY) {
  console.warn("⚠️ Warning: SUPABASE_SECRET_KEY environment variable is not set. Admin calls may fail.");
}

// Client with secret key (admin privileges, bypasses RLS)
const adminClient = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testConnection() {
  console.log("==================================================");
  console.log("  CampusBite · Supabase Connection & Tables Check");
  console.log("==================================================");
  console.log("URL:", SUPABASE_URL);
  console.log("Publishable Key:", SUPABASE_PUBLISHABLE_KEY.slice(0, 16) + "...");
  console.log("Secret Key:", SUPABASE_SECRET_KEY.slice(0, 12) + "...\n");

  // 1. Check Auth
  console.log("1. Checking Supabase Auth Service...");
  try {
    const { data: usersData, error: userError } = await adminClient.auth.admin.listUsers();
    if (userError) {
      console.error("   ❌ Auth Error:", userError.message);
    } else {
      console.log(`   ✅ Auth is online! Found ${usersData.users.length} registered user(s).`);
      usersData.users.forEach((u) => {
        console.log(`      - ${u.email} (ID: ${u.id})`);
      });
    }
  } catch (err) {
    console.error("   ❌ Auth Exception:", err.message);
  }

  // 2. Check Profiles Table (Table 1: Logins & Users)
  console.log("\n2. Checking Table 1: 'public.profiles' (Users / Logins)...");
  try {
    const { data, error } = await adminClient.from("profiles").select("*").limit(5);
    if (error) {
      console.log("   ⚠️ Profiles table note:", error.message);
      if (error.code === "PGRST205") {
        console.log("      ℹ️ Table 'public.profiles' is not created yet.");
        console.log("      ℹ️ Run 'supabase/schema.sql' in the Supabase SQL Editor.");
      }
    } else {
      console.log(`   ✅ 'profiles' table is active! Found ${data.length} profile(s).`);
      data.forEach((p) => {
        console.log(`      - ${p.full_name} (${p.email}) · Roll: ${p.roll_no} · Wallet: ₹${p.wallet_balance}`);
      });
    }
  } catch (err) {
    console.error("   ❌ Profiles Query Exception:", err.message);
  }

  // 3. Check Orders Table (Table 2: Canteen Orders)
  console.log("\n3. Checking Table 2: 'public.orders' (Food Orders)...");
  try {
    const { data, error } = await adminClient.from("orders").select("*").limit(5);
    if (error) {
      console.log("   ⚠️ Orders table note:", error.message);
      if (error.code === "PGRST205") {
        console.log("      ℹ️ Table 'public.orders' is not created yet.");
        console.log("      ℹ️ Run 'supabase/schema.sql' in the Supabase SQL Editor.");
      }
    } else {
      console.log(`   ✅ 'orders' table is active! Found ${data.length} order(s).`);
      data.forEach((ord) => {
        console.log(`      - Order #${ord.order_code} · Total: ₹${ord.total} · Status: ${ord.status}`);
      });
    }
  } catch (err) {
    console.error("   ❌ Orders Query Exception:", err.message);
  }
}

async function listProfiles() {
  console.log("=== Table 1: public.profiles (Users & Login Details) ===");
  const { data, error } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching profiles:", error.message);
    if (error.code === "PGRST205") {
      console.log("\n💡 Reminder: Run 'supabase/schema.sql' in the Supabase SQL Editor to create 'profiles'.");
    }
    return;
  }

  if (!data || data.length === 0) {
    console.log("No profiles found in 'profiles' table yet.");
    return;
  }

  console.table(
    data.map((p) => ({
      id: p.id.slice(0, 8) + "...",
      name: p.full_name,
      email: p.email,
      roll_no: p.roll_no,
      wallet_balance: `₹${p.wallet_balance}`,
      reward_points: p.reward_points,
      role: p.role,
    }))
  );
}

async function queryOrders() {
  console.log("=== Table 2: public.orders (Canteen Orders) ===");
  const { data, error } = await adminClient
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching orders:", error.message);
    if (error.code === "PGRST205") {
      console.log("\n💡 Reminder: Run 'supabase/schema.sql' in the Supabase SQL Editor to create 'orders'.");
    }
    return;
  }

  if (!data || data.length === 0) {
    console.log("No orders found in 'orders' table yet.");
    return;
  }

  console.table(
    data.map((o) => ({
      order_code: o.order_code,
      token: o.token,
      customer: o.customer_name,
      total: `₹${o.total}`,
      slot: o.pickup_slot,
      status: o.status,
      placed_at: o.placed_at,
    }))
  );
}

async function listAuthUsers() {
  console.log("=== Supabase Auth Users ===");
  const { data, error } = await adminClient.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error.message);
    return;
  }
  console.table(
    data.users.map((u) => ({
      id: u.id,
      email: u.email,
      confirmed: Boolean(u.email_confirmed_at),
      created_at: u.created_at,
    }))
  );
}

async function createUser(email, password, name = "Campus Student") {
  if (!email || !password) {
    console.error("Usage: node scripts/supabase-service.js create-user <email> <password> [name]");
    return;
  }
  console.log(`Creating verified user: ${email}...`);
  const { data, error } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) {
    console.error("❌ Error creating user:", error.message);
  } else {
    console.log("✅ User created successfully!");
    console.log("ID:", data.user.id);
    console.log("Email:", data.user.email);
    console.log("Name:", data.user.user_metadata?.name);
  }
}

async function main() {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "test":
      await testConnection();
      break;
    case "profiles":
      await listProfiles();
      break;
    case "orders":
      await queryOrders();
      break;
    case "users":
      await listAuthUsers();
      break;
    case "create-user":
      await createUser(args[0], args[1], args[2]);
      break;
    default:
      console.log(`CampusBite Supabase Management CLI
Commands:
  node scripts/supabase-service.js test              - Test Auth & both database tables
  node scripts/supabase-service.js profiles          - Query Table 1: profiles (users/login)
  node scripts/supabase-service.js orders            - Query Table 2: orders (food orders)
  node scripts/supabase-service.js users             - List all registered auth users
  node scripts/supabase-service.js create-user <email> <password> [name] - Create confirmed student
`);
      await testConnection();
      break;
  }
}

main().catch(console.error);
