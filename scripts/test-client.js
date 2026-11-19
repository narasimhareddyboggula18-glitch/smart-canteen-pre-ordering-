/**
 * Supabase Client Demo: Two Separate Tables (Profiles & Orders)
 * Demonstrates:
 *   1. Client-Side Authentication (Sign In)
 *   2. Querying Table 1: 'public.profiles' (Student info, wallet balance, roll number)
 *   3. Querying Table 2: 'public.orders' (Canteen meal orders)
 *   4. Inserting into Table 2: 'public.orders' (Placing an order)
 * 
 * Run with:
 *   node scripts/test-client.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://yydlpwulcpuamowzpcbj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nndc9wySaYeJOweah_Gr4A_HO555EU2";

async function runDemo() {
  console.log("=== 1. Initialize Supabase Client ===");
  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  console.log("Connected to:", SUPABASE_URL);

  console.log("\n=== 2. Authenticate User (Login) ===");
  const email = "student@campusbite.com";
  const password = "CampusPassword123!";

  console.log(`Signing in as: ${email}...`);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    console.error("❌ Sign in failed:", authError.message);
    return;
  }

  console.log("✅ Authenticated successfully!");
  console.log("User UUID:", authData.user.id);
  console.log("User Email:", authData.user.email);

  // ----------------------------------------------------
  // TABLE 1: PROFILES (User Login & Account Table)
  // ----------------------------------------------------
  console.log("\n=== 3. Query Table 1: 'public.profiles' (User & Login Details) ===");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) {
    console.log("⚠️ Profiles query status:", profileError.message);
    if (profileError.code === "PGRST205") {
      console.log("💡 'public.profiles' table not created yet in Postgres.");
      console.log("   Execute 'supabase/schema.sql' in the Supabase SQL Editor.");
    }
  } else if (!profile) {
    console.log("ℹ️ No profile found for this user in 'profiles' table yet.");
  } else {
    console.log("✅ User Profile Retrieved from 'profiles' table:");
    console.log(`   - Name: ${profile.full_name}`);
    console.log(`   - Roll No: ${profile.roll_no}`);
    console.log(`   - Branch: ${profile.branch}`);
    console.log(`   - Campus Wallet: ₹${profile.wallet_balance}`);
    console.log(`   - Reward Points: ${profile.reward_points}`);
    console.log(`   - Role: ${profile.role}`);
  }

  // ----------------------------------------------------
  // TABLE 2: ORDERS (Canteen Food Orders Table)
  // ----------------------------------------------------
  console.log("\n=== 4. Query Table 2: 'public.orders' (Canteen Food Orders) ===");
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", authData.user.id)
    .order("placed_at", { ascending: false });

  if (ordersError) {
    console.log("⚠️ Orders query status:", ordersError.message);
    if (ordersError.code === "PGRST205") {
      console.log("💡 'public.orders' table not created yet in Postgres.");
      console.log("   Execute 'supabase/schema.sql' in the Supabase SQL Editor.");
    }
  } else {
    console.log(`✅ Retrieved ${orders.length} orders from 'orders' table for this student:`);
    if (orders.length > 0) {
      console.table(
        orders.map((o) => ({
          order_code: o.order_code,
          token: o.token,
          total: `₹${o.total}`,
          slot: o.pickup_slot,
          status: o.status,
        }))
      );
    }
  }

  // ----------------------------------------------------
  // INSERT DEMO ORDER INTO TABLE 2
  // ----------------------------------------------------
  console.log("\n=== 5. Insert New Order into Table 2: 'public.orders' ===");
  const sampleOrder = {
    user_id: authData.user.id,
    order_code: "DEMO-" + Math.floor(1000 + Math.random() * 9000),
    token: String(Math.floor(100 + Math.random() * 900)),
    items: [
      { id: "masala-dosa", name: "Crispy Masala Dosa", qty: 1, price: 65 },
      { id: "cold-coffee", name: "Cold Coffee", qty: 1, price: 40 },
    ],
    subtotal: 105,
    discount: 0,
    gst: 5.25,
    packaging: 10,
    wallet_used: 0,
    total: 120.25,
    pickup_slot: "1:00 PM - 1:15 PM",
    customer_name: "Riya Sharma",
    customer_phone: "9876543210",
  };

  const { data: inserted, error: insertError } = await supabase
    .from("orders")
    .insert([sampleOrder])
    .select();

  if (insertError) {
    console.log("⚠️ Insert status:", insertError.message);
    if (insertError.code === "PGRST205") {
      console.log("💡 Run 'supabase/schema.sql' in the Supabase SQL editor to enable database inserts.");
    }
  } else {
    console.log("✅ Order inserted successfully into 'orders' table!");
    console.log("Order code:", inserted[0]?.order_code);
  }

  console.log("\n=== 6. Sign Out ===");
  await supabase.auth.signOut();
  console.log("✅ Signed out successfully.");
}

runDemo().catch(console.error);
